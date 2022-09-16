//Vital requires
const express = require('express');
const router = express.Router({mergeParams: true});

//Essential requires
const Campground = require('../../models/campground');
const {reviewSchema} = require('../../models/JoiSchema');
const catchAsync = require('../../utility/catchAsync');
const ExpressError = require('../../utility/ExpressError');
const Review = require('../../models/review');

//middleware
module.exports.validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error)
      throw new ExpressError(error.details.map(el => el.message).join(','), 400);
    else
      next()
}

module.exports.reviewAuth = async(req,res,next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId).populate('author');
    console.log(review.author.id)
    if(req.user.id && (req.user.id == review.author.id))
      next();
    else{
      req.flash('error','The review isnt yours!');
      return res.redirect(`/campgrounds/${id}`);
    }
}

//route Controllers
module.exports.postReview = catchAsync( async(req,res) => {
    const {id} = req.params;
    const camp = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user.id;
    camp.reviews.push(review);
    console.log(review)
    await review.save();
    await camp.save();
    req.flash('reviewSuccess', 'Review has been commented')
    res.redirect(`/campgrounds/${camp.id}`);
})

module.exports.deleteReview = catchAsync( async(req, res) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('reviewSuccess', 'Review has been deleted!')
    res.redirect(`/campgrounds/${id}`)
})