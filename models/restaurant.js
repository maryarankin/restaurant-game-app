const mongoose = require('mongoose')

const Schema = mongoose.Schema

const RestaurantSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    //change this to 'category':
    type: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    numEmployees: {
        type: Number,
        required: true
    },
    profit: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    dishes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Dish'
        }
    ]
})

module.exports = mongoose.model('Restaurant', RestaurantSchema)