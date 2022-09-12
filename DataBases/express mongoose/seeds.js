const Product = require('./models/Product');

//mongoose
const mongoose = require('mongoose');

main()
    .then(()=> console.log("connection open"))
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/farmStand');
  
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
};


// const p = new Product({
//     name:'Ruby Grapefruit',
//     price: 1.99,
//     category: 'fruit'
// })
// p.save().then(p =>{
//     console.log(p)
// })
// .catch(e => console.log(e));

// const seedProducts = [{
//         name: 'Fairy Eggplant',
//         price: 1.00,
//         category: 'vegetable'
//     },
//     {
//         name: 'Organic Goddess Melon',
//         price: 4.99,
//         category: 'fruit'
//     },
//     {
//         name: 'Organic Mini Seedless WaterMelon',
//         price: 3.99,
//         category: 'fruit'
//     },
//     {
//         name: 'Organic Celery',
//         price: 1.50,
//         category: 'vegetable'
//     },
//     {
//         name: 'Chocolate Whole Milk',
//         price: 2.69,
//         category: 'dairy'
//     }
// ]

// Product.insertMany(seedProducts).then(res =>console.log(res))
// .catch(err => console.log(err));

Product.updateMany({},{stock: 10});