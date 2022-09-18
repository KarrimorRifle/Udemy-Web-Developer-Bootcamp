const Campground = require('../models/campground');
const cities = require('./cities')
const mongoose = require('mongoose');
const {places,descriptors} = require('./seedHelpers');
const fetch = require('node-fetch');
const {reviewSchema} = require('../models/review')
const Users = require('../models/user')
if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
  };

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
    let images = await fetch(process.env.unsplash)
        .then(res => res.text())
        .then(text => JSON.parse(text))
    await Campground.deleteMany({});
    for(let i=0; i<50; i++){
        let imageNum = images.length;
        const random1000 = Math.floor(Math.random()*1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price: random1000/100,
            author: '632470727d03451de01d1702',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat voluptatum nesciunt odit, tempore deleniti enim ipsum velit possimus incidunt ipsa nemo reiciendis quis sed dolore? Voluptate consectetur adipisci nostrum laudantium Quas architecto magnam impedit! Porro, dicta. Dignissimos explicabo at alias odit officiis id eaque, tempore culpa, fugiat est saepe quia in, incidunt quisquam dicta perspiciatis sunt quae numquam cumque repellat',
            images: [
                {
                  url: 'https://res.cloudinary.com/dg7f4euwg/image/upload/v1663460125/YelpCamp/ymtfn04ye3ykxywakvke.jpg',
                  fileName: 'YelpCamp/ymtfn04ye3ykxywakvke'
                },
                {
                  url: 'https://res.cloudinary.com/dg7f4euwg/image/upload/v1663460126/YelpCamp/rznyxa25eu1hq0orzcof.jpg',
                  fileName: 'YelpCamp/rznyxa25eu1hq0orzcof'
                },
                {
                  url: 'https://res.cloudinary.com/dg7f4euwg/image/upload/v1663460128/YelpCamp/yctperh6otlmlahshxxb.jpg',
                  fileName: 'YelpCamp/yctperh6otlmlahshxxb'
                },
                {
                  url: 'https://res.cloudinary.com/dg7f4euwg/image/upload/v1663460129/YelpCamp/pkz1kcrmpo6rzycvbvso.jpg',
                  fileName: 'YelpCamp/pkz1kcrmpo6rzycvbvso'
                }
              ]
                        
            })
        await camp.save();
    }
}



seedDB()

// const Review = mongoose.model('Review', reviewSchema);