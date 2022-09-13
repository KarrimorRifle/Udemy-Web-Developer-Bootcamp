const express = require('express');
const path = require('path');
const methodoverride = require('method-override');
const app = express();
const Campground = require('./models/campground');
const engine = require('ejs-mate');
const catchAsync = require('./utility/catchAsync');
const ExpressError = require('./utility/ExpressError');
const {campgroundSchema, reviewSchema} = require('./models/JoiSchema');
const Review = require('./models/review')

app.engine('ejs',engine);
app.use(methodoverride('_method'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp');
  
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/yelpcamp');` if your database has auth enabled
}


//middleware
const validateCampground = (req,res,next) => {
  const {error} = campgroundSchema.validate(req.body);
  if(error){
    throw new ExpressError(error.details.map(el => el.message).join(','), 400);
  }
  else
    next()
}
const validateReview = (req,res,next) => {
  const {error} = reviewSchema.validate(req.body);
  if(error)
    throw new ExpressError(error.details.map(el => el.message).join(','), 400);
  else
    next()
}




//Main items
app.get('/', async(req, res) => {
  const campgrounds = await Campground.find({});
  res.render('home', {campgrounds});
})

app.get('/campgrounds', async(req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', {campgrounds});
})

app.get('/campgrounds/new', (req,res) =>{
  res.render('campgrounds/new');
})

app.get('/campgrounds/:id', catchAsync( async(req,res) => {
    const {id} = req.params;
    const camp = await Campground.findById(id).populate('reviews');
    res.render('campgrounds/show', {camp})
}))

app.post('/campgrounds',validateCampground, catchAsync( async(req, res) => {
    
    const newCamp = new Campground(req.body)
    await newCamp.save();
    res.redirect('/campgrounds');

}))

app.get('/campgrounds/:id/edit', async (req,res) => {
  const {id} = req.params;
  const camp = await Campground.findById(id);
  res.render('campgrounds/edit',{camp});
})

app.patch('/campgrounds/:id',validateCampground, catchAsync( async(req, res) => {
  const {id} = req.params;
  const camp = await Campground.findByIdAndUpdate(id,req.body);
  res.redirect(`/campgrounds/${id}`);
}))

app.delete('/campgrounds/:id', catchAsync(async(req, res) => {
  const {id} = req.params;
  //my solution to deleting reviews;
  // const camp = await Campground.findById(id).populate('reviews');
  // console.log("1")
  // for(let review of camp.reviews){
  //   await Review.findByIdAndDelete(review.id);
  //   console.log(review.id)
  // }
  // console.log("3")

  await Campground.findByIdAndDelete(id);
  res.redirect(`/campgrounds`);
}))


//reviews
app.post('/campgrounds/:id/reviews', validateReview ,catchAsync( async(req,res) => {
  const {id} = req.params;
  const camp = await Campground.findById(id);
  const review = new Review(req.body.review);
  camp.reviews.push(review);
  await review.save();
  await camp.save();
  res.redirect(`/campgrounds/${camp.id}`);
}))

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync( async(req, res) => {
  const {id, reviewId} = req.params;
  await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/campgrounds/${id}`)
}))


app.all('*', (req,res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

app.use((err,req,res,next) => {
  const {statusCode = 500, message = "something went wrong"} = err;
  res.render('error',{err, statusCode, message});
})

app.listen(3000, () => {
    console.log('port open on 3000')
})

