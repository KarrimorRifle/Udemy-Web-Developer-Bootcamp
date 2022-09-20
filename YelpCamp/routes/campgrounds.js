//Vital require
const express= require('express');
const router = express.Router({mergeParams: true});
const multer  = require('multer')


//essential require
const {isLoggedIn, campAuth} = require('../utility/middleWare')
const {validateCampground} = require('./controllers/campgroundsController');
const controller = require('./controllers/campgroundsController');
const {storage} = require('../cloudinary')
const upload = multer({storage})

//responses
router.route('/')
    .get(controller.renderCampgrounds)
    .post(isLoggedIn,upload.array('campground[images]'),validateCampground, controller.createNewCampground)
router.get('/new',isLoggedIn, controller.newCampground)

router.route('/:id')
    .get(controller.showCampgroundByParamId)
    .patch(isLoggedIn,campAuth,upload.array('campground[images]'), validateCampground, controller.editCampgroundByParamId)
    .delete(isLoggedIn,campAuth, controller.deleteCampgroundByParamId)

router.get('/:id/edit',isLoggedIn, campAuth, controller.editCampgroundByParamIdForm)

//export
module.exports = router;