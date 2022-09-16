//vital Requires
const express= require('express');

//Essential Requires
const User = require('../../models/user');

//register
module.exports.registerForm = (req,res) => {
    res.render('users/register')
}

module.exports.register = async(req,res) => {
    try{
        const {email, username, password} = req.body;
        const user = new User({username,email});
        const newUser = await User.register(user, password);
        req.login(newUser, err => {
            if(err) return next(err);
            req.flash('success','Welcome to YelpCamp!')
            res.redirect('/campgrounds')
        })
    }catch(e){
        req.flash('error', e.message);
        res.redirect('register');
    }
}

//login
module.exports.loginForm = (req,res) => {
    res.render('users/login');
}

module.exports.login = (req,res) => {
    req.flash('success','Welcome back to YelpCamp!');
    const redirectUrl = req.cookies.returnUrl || '/campgrounds';
    res.clearCookie('returnUrl')
    res.redirect(redirectUrl);

}

//logout
module.exports.logout = (req,res) => {
    req.logout(function(err){
        if(err){return next(err);};
        req.flash('success',"Goodbye!")
        res.redirect('/campgrounds');
    });

}