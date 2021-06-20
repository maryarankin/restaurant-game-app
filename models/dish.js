const mongoose = require('mongoose')

const Schema = mongoose.Schema

const DishSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    //REMOVE THIS LATER?
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

    //MAKE THIS AN ENUM?
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
    ]
})

module.exports = mongoose.model('Dish', DishSchema)