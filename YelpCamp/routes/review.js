//Vital requires
const express = require('express');
const router = express.Router({mergeParams: true});

//Essential requires
const Campground = require('../models/campground');
const {reviewSchema} = require('../models/JoiSchema');
const catchAsync = require('../utility/catchAsync');
const ExpressError = require('../utility/ExpressError');
const Review = require('../models/review');

//middleware
const validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error)
      throw new ExpressError(error.details.map(el => el.message).join(','), 400);
    else
      next()
}

//responses
router.post('/', validateReview ,catchAsync( async(req,res) => {
    const {id} = req.params;
    const camp = await Campground.findById(id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('reviewSuccess', 'Review has been commented')
    res.redirect(`/campgrounds/${camp.id}`);
}))
  
router.delete('/:reviewId', catchAsync( async(req, res) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('reviewSuccess', 'Review has been deleted!')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;