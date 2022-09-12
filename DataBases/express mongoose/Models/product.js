const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true,
        min: 0
    },
    category:{
        type: String,
        enum:['fruit','vegetable','dairy']
    },
    stock:{
        type: Number,
        default: 0,
        min: 0
    }
})

const  Product = mongoose.model('Product', productSchema);

module.exports = Product;