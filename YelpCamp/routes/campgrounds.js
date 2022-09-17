//Vital require
const express= require('express');
const router = express.Router({mergeParams: true});
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

//essential require
const {isLoggedIn, campAuth} = require('../utility/middleWare')
const {validateCampground} = require('./controllers/campgroundsController');
const controller = require('./controllers/campgroundsController');

//responses
router.route('/')
    .get(controller.renderCampgrounds)
    // .post(isLoggedIn,validateCampground, controller.createNewCampground)
    .post(upload.single('gampground.image'), (req,res) => {
        res.send(req.body, req.file)
    })

router.get('/new',isLoggedIn, controller.newCampground)

router.route('/:id')
    .get(controller.showCampgroundByParamId)
    .patch(isLoggedIn,campAuth, validateCampground, controller.editCampgroundByParamId)
    .delete(isLoggedIn,campAuth, controller.deleteCampgroundByParamId)

router.get('/:id/edit',isLoggedIn, campAuth, controller.editCampgroundByParamIdForm)

//export
module.exports = router;