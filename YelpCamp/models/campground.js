const mongoose = require('mongoose');
const { campgroundSchema } = require('./JoiSchema');
const Review = require('./review');
const Schema = mongoose.Schema;
const User = require('./user')

const CampgroundSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    location:{
        type: String,
        required: true
    },
    image:{
        type: String,
    },
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
    
    
})

CampgroundSchema.post('findOneAndDelete', async (doc) => {
    if (doc)  {
        await Review.remove({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);