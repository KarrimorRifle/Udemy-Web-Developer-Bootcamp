const Campground = require('../models/campground')

module.exports.isLoggedIn = async(req,res,next) => {
    if(!req.isAuthenticated()){
        res.cookie('returnUrl',req.originalUrl)
        req.flash('error', 'You must be logged in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.campAuth = async(req, res, next) => {
    const {id} = req.params;
    const camp = await Campground.findById(id).populate('author');
    console.log(camp)
    console.log(camp.author.id)
    console.log(req.user.id)
    if(req.user.id == camp.author.id)
        next();
    else{
        req.flash('error','You aren\'t the author of this camp!')
        res.redirect(`/campgrounds/${id})`)
    }
}