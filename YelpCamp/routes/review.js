//Vital requires
const express = require('express');
const router = express.Router({mergeParams: true});

//Essential requires
const {isLoggedIn} = require('../utility/middleWare')

//controller requires
const {reviewAuth, validateReview} = require('./controllers/reviewController')
const controller = require('./controllers/reviewController')




//responses
router.post('/',isLoggedIn, validateReview , controller.postReview);
  
router.delete('/:reviewId',isLoggedIn,reviewAuth, controller.deleteReview)

module.exports = router;