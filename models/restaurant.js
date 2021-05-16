const mongoose = require('mongoose')

const Schema = mongoose.Schema

const RestaurantSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    menu: {
        type: [String],
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
    }
})

//in future, add owner

module.exports = mongoose.model('Restaurant', RestaurantSchema)