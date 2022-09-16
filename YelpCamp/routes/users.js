//vital Requires
const express= require('express');
const router = express.Router({mergeParams: true});
const passport = require('passport')

//Essential Requires
const User = require('../models/user');
const { route } = require('./campgrounds');

//controller requires
const controller = require('./controllers/usersController');
//routes

//registration
router.route('/register')
    .get( controller.registerForm)
    .post( controller.register)

//login
router.route('/login')
    .get(controller.loginForm)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), controller.login)

//logout
router.get('/logout', controller.logout)

//export
module.exports = router;