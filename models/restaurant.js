const mongoose = require('mongoose')

const Schema = mongoose.Schema

const RestaurantSchema = new Schema({
    name: String,
    type: String,
    location: String,
    menu: [String],
    numEmployees: Number,
    profit: Number,
    rating: Number,
})

//in future, add owner

module.exports = mongoose.model('Restaurant', RestaurantSchema)