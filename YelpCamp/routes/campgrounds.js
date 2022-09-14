//Vital require
const express= require('express');
const router = express.Router({mergeParams: true});

//essential require
const catchAsync = require('../utility/catchAsync');
const ExpressError = require('../utility/ExpressError');
const Campground = require('../models/campground');
const {campgroundSchema} = require('../models/JoiSchema');

//middleware
const validateCampground = (req,res,next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        throw new ExpressError(error.details.map(el => el.message).join(','), 400);
    }
    else
        next()
}

//responses
router.get('/', async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
})
  
router.get('/new', (req,res) =>{
    res.render('campgrounds/new');
})

router.get('/:id', catchAsync( async(req,res) => {
    const {id} = req.params;
    const camp = await Campground.findById(id).populate('reviews');
    if(!camp){
        req.flash('error','Campground not found!');
        return res.redirect('/campgrounds');}
    res.render('campgrounds/show', {camp})
}))

router.post('/',validateCampground, catchAsync( async(req, res) => {
    console.log(req.body)
    const newCamp = new Campground(req.body.campground)
    await newCamp.save();
    req.flash('success', 'Campground has been created!')
    res.redirect(`/campgrounds/${newCamp.id}`);
}))

router.get('/:id/edit', catchAsync (async (req,res) => {
    const {id} = req.params;
    const camp = await Campground.findById(id);
    if(!camp){
        req.flash('error','Campground not found!');
        return res.redirect('/campgrounds');}
    res.render('campgrounds/edit',{camp});
}))

router.patch('/:id',validateCampground, catchAsync( async(req, res) => {
    const {id} = req.params;
    const camp = await Campground.findByIdAndUpdate(id,req.body);
    req.flash('success', 'Campground changes have been saved!')
    res.redirect(`/campgrounds/${id}`);
}))

router.delete('/:id', catchAsync(async(req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Camp has been deleted!')
    res.redirect(`/campgrounds`);
}))


//export
module.exports = router;