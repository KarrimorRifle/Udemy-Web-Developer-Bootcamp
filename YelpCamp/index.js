//Vital Requires
const express = require('express');
const path = require('path');
const methodoverride = require('method-override');
const app = express();
const engine = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport')
const LocalStrategy = require('passport-local')
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const helmet = require('helmet')

//essential requires
const Campground = require('./models/campground');
const catchAsync = require('./utility/catchAsync');
const ExpressError = require('./utility/ExpressError');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');

//.env setup
if(process.env.NODE_ENV !== "production"){
  require('dotenv').config();
};

//express set up
app.engine('ejs',engine);
app.use(methodoverride('_method'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({secret: 'haKBsg30s',
  keepSessionInfo:true,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 60 * 60 * 1000,
    maxAge: 60 * 60 * 1000
  }
}));
app.use(flash());
app.use(mongoSanitize());
app.use(helmet({contentSecurityPolicy: false,
  referrerPolicy: false}));

//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Route requires
const campgroundsRoute = require('./routes/campgrounds');
const reviewsRoute = require('./routes/review');
const usersRoute = require('./routes/users');

//mongoose set up
const mongoose = require('mongoose');
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp');
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/yelpcamp');` if your database has auth enabled
}

//flash middleware
app.use((req,res,next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.reviewSuccess = req.flash('reviewSuccess');
  res.locals.err = req.flash('error');
  next();
})

//app route use
app.use('/campgrounds', campgroundsRoute);//campgrounds
app.use('/campgrounds/:id/reviews', reviewsRoute);//reviews
app.use('/', usersRoute);//users

//User Creation:
// app.get('/fakeUser',async (req,res) => {
//   const user = new User({email: 'example@gmail.com', username: 'user'})

// })

//Home Page
app.get('/', catchAsync (async(req, res) => {
  const campgrounds = await Campground.find({});
  res.render('home', {campgrounds});
}))


//404 middleware
app.all('*', (req,res, next) => {
  next(new ExpressError('Page Not Found', 404))
})


//error handler middleware
app.use((err,req,res,next) => {
  const {statusCode = 500, message = "something went wrong"} = err;
  res.render('error',{err, statusCode, message});
})


//port listener
app.listen(3000, () => {
    console.log('port open on 3000')
})

