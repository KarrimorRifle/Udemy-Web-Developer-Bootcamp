const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user')

const reviewSchema = new Schema({
    body: String,
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    rating: {
        type: Number,
        min: 0,
        max: 5
    }
})

module.exports = mongoose.model("Review", reviewSchema)