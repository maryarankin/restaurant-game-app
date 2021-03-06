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
    rent: {
        type: Number,
        required: true
    },
    numEmployees: {
        type: Number,
        required: true
    },
    employeePay: {
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
    ],
    monthOpened: {
        type: Number,
        required: true
    },
    dayOpened: {
        type: Number,
        required: true
    }
})

//add size functionality - make expandable

module.exports = mongoose.model('Restaurant', RestaurantSchema)