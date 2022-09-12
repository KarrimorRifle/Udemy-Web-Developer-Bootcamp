const express = require('express');
const path = require('path');
const methodoverride = require('method-override');
const app = express();
const Campground = require('./models/campground')
const engine = require('ejs-mate');

app.engine('ejs',engine);
app.use(methodoverride('_method'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const mongoose = require('mongoose');
const campground = require('./models/campground');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp');
  
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/yelpcamp');` if your database has auth enabled
}

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

app.get('/campgrounds/:id', async(req,res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', {campground})
})

app.post('/campgrounds', async(req, res) => {
  const newCamp = new Campground(req.body)
  await newCamp.save();
  res.redirect('/campgrounds');
})

app.get('/campgrounds/:id/edit', async (req,res) => {
  const {id} = req.params;
  const camp = await Campground.findById(id);
  res.render('campgrounds/edit',{camp});
})

app.patch('/campgrounds/:id', async(req, res) => {
  const {id} = req.params;
  const camp = await Campground.findByIdAndUpdate(id,req.body);
  res.redirect(`/campgrounds/${id}`);
})

app.delete('/campgrounds/:id', async(req, res) => {
  const {id} = req.params;
  const camp = await Campground.findByIdAndDelete(id);
  res.redirect(`/campgrounds`);
})

app.listen(3000, () => {
    console.log('port open on 3000')
})

