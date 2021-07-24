const mongoose = require('mongoose')

const Schema = mongoose.Schema

const DishSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    stringName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant'
    },
    ingredients: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Ingredient'
        }
    ],
    numberSold: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Dish', DishSchema)