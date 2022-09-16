//Vital require
const express= require('express');
const router = express.Router({mergeParams: true});

//essential require
const {isLoggedIn, campAuth} = require('../utility/middleWare')
const {validateCampground} = require('./controllers/campgroundsController');
const controller = require('./controllers/campgroundsController');

//responses
router.route('/')
    .get(controller.renderCampgrounds)
    .post(isLoggedIn,validateCampground, controller.createNewCampground)


router.get('/new',isLoggedIn, controller.newCampground)

router.route('/:id')
    .get(controller.showCampgroundByParamId)
    .patch(isLoggedIn,campAuth, validateCampground, controller.editCampgroundByParamId)
    .delete(isLoggedIn,campAuth, controller.deleteCampgroundByParamId)

router.get('/:id/edit',isLoggedIn, campAuth, controller.editCampgroundByParamIdForm)

//export
module.exports = router;