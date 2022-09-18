//Vital require
const express= require('express');
const router = express.Router({mergeParams: true});

//essential require
const catchAsync = require('../../utility/catchAsync');
const ExpressError = require('../../utility/ExpressError');
const Campground = require('../../models/campground');
const {campgroundSchema} = require('../../models/JoiSchema');
const {isLoggedIn, campAuth} = require('../../utility/middleWare')

//middleware
module.exports.validateCampground = (req,res,next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        throw new ExpressError(error.details.map(el => el.message).join(','), 400);
    }
    else
        next()
}

//route controllers

module.exports.renderCampgrounds = (async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
})

module.exports.newCampground = (req,res) =>{res.render('campgrounds/new');}

module.exports.showCampgroundByParamId = catchAsync( async(req,res) => {
    const {id} = req.params;
    const camp = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!camp){
        req.flash('error','Campground not found!');
        return res.redirect('/campgrounds');}
    res.render('campgrounds/show', {camp})
})

module.exports.createNewCampground = catchAsync( async(req, res) => {
    const newCamp = new Campground(req.body.campground)
    console.log(req.files);
    newCamp.images = req.files.map(f => ({url: f.path, fileName: f.fileName}))
    newCamp.author = req.user.id;
    await newCamp.save();
    req.flash('success', 'Campground has been created!')
    res.redirect(`/campgrounds/${newCamp.id}`);
})

module.exports.editCampgroundByParamIdForm = catchAsync (async (req,res) => {
    const {id} = req.params;
    const camp = await Campground.findById(id);
    if(!camp){
        req.flash('error','Campground not found!');
        return res.redirect('/campgrounds');}
    res.render('campgrounds/edit',{camp});
})

module.exports.editCampgroundByParamId = catchAsync( async(req, res) => {
    const {id} = req.params;
    const camp = await Campground.findByIdAndUpdate(id,req.body);
    req.flash('success', 'Campground changes have been saved!')
    res.redirect(`/campgrounds/${id}`);
})

module.exports.deleteCampgroundByParamId = catchAsync(async(req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Camp has been deleted!')
    res.redirect(`/campgrounds`);
})