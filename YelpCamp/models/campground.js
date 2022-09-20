//requires
const { string } = require('joi');
const mongoose = require('mongoose');
const { campgroundSchema } = require('./JoiSchema');
const Review = require('./review');
const Schema = mongoose.Schema;
const User = require('./user')

//virtuals
const ImageSchema = new Schema({
    url: String,
    fileName: String
})
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_400');
})
const opts = { toJSON: { virtuals: true}};

const CampgroundSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    geometry:{
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates:{
            type: [Number],
            required: true
        }
    },
    location:{
        type: String
    },
    images:[ImageSchema],
    price:{
        type: Number,
        min: 0,
        required: true
    },
    description:{
        type: String

    },
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
    
    
},opts)

CampgroundSchema.post('findOneAndDelete', async (doc) => {
    if (doc)  {
        await Review.remove({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
CampgroundSchema.virtual('properties.popUpMarkup').get(function() {
    return `
    <img src="${this.images[0].url}" class="img-fluid">
    <a href="/campgrounds/${this.id}" class="fw-bold text-decoration-none badge bg-primary text-wrap">${this.title}</a>`
})
module.exports = mongoose.model('Campground', CampgroundSchema);