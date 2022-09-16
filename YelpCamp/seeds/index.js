const Campground = require('../models/campground');
const cities = require('./cities')
const mongoose = require('mongoose');
const {places,descriptors} = require('./seedHelpers');
const fetch = require('node-fetch');
const {reviewSchema} = require('../models/review')
const Users = require('../models/user')

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp');
  
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/yelpcamp');` if your database has auth enabled
}

const sample = array => array[Math.floor(Math.random()* array.length)];

// // let xhr = new XMLHttpRequest();
// // xhr.open("GET",'https://api.unsplash.com/collections/483251/?client_id=apXL2cicGwpIBkhjVsiK4XZyOtxoCpD6nWwdF3X0IOw');
// // xhr.send();
// // xhr.onload = () => console.log(xhr.responseText);



const seedDB = async () =>{
    let images = await fetch('https://api.unsplash.com/collections/483251/photos/?client_id=apXL2cicGwpIBkhjVsiK4XZyOtxoCpD6nWwdF3X0IOw')
        .then(res => res.text())
        .then(text => JSON.parse(text))
    await Campground.deleteMany({});
    for(let i=0; i<50; i++){
        let imageNum = images.length;
        const random1000 = Math.floor(Math.random()*1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            image: images[Math.floor(Math.random()*imageNum)].urls.regular,
            title: `${sample(descriptors)} ${sample(places)}`,
            price: random1000/100,
            author: '632470727d03451de01d1702',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat voluptatum nesciunt odit, tempore deleniti enim ipsum velit possimus incidunt ipsa nemo reiciendis quis sed dolore? Voluptate consectetur adipisci nostrum laudantium Quas architecto magnam impedit! Porro, dicta. Dignissimos explicabo at alias odit officiis id eaque, tempore culpa, fugiat est saepe quia in, incidunt quisquam dicta perspiciatis sunt quae numquam cumque repellat'
            
            })
        await camp.save();
    }
}



seedDB()

// const Review = mongoose.model('Review', reviewSchema);