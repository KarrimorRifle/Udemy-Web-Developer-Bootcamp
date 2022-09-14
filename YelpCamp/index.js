//Vital Requires
const express = require('express');
const path = require('path');
const methodoverride = require('method-override');
const app = express();
const engine = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');

//essential requires
const Campground = require('./models/campground');
const catchAsync = require('./utility/catchAsync');
const ExpressError = require('./utility/ExpressError');

//express set up
app.engine('ejs',engine);
app.use(methodoverride('_method'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({secret: 'haKBsg30s',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 60 * 60 * 1000,
    maxAge: 60 * 60 * 1000
  }
}));
app.use(flash());

//Route requires
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/review');

//mongoose set up
const mongoose = require('mongoose');
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp');
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/yelpcamp');` if your database has auth enabled
}

//flash middleware
app.use((req,res,next) => {
  res.locals.success = req.flash('success');
  res.locals.reviewSuccess = req.flash('reviewSuccess');
  res.locals.err = req.flash('error');
  next();
})

//app route use
app.use('/campgrounds', campgrounds);//campgrounds
app.use('/campgrounds/:id/reviews', reviews);//reviews

//Home Page
app.get('/', catchAsync (async(req, res) => {
  const campgrounds = await Campground.find({});
  res.render('home', {campgrounds});
}))


//404 middleware
app.all('*', (req,res, next) => {
  next(new ExpressError('Page Not Found', 404))
})


//error handler middleware
app.use((err,req,res,next) => {
  const {statusCode = 500, message = "something went wrong"} = err;
  res.render('error',{err, statusCode, message});
})


//port listener
app.listen(3000, () => {
    console.log('port open on 3000')
})

