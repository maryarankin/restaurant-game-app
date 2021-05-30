const mongoose = require('mongoose')

const Schema = mongoose.Schema

const IngredientSchema = new Schema({
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
    //change this to be the actual dishes themselves?:
    dishes: [
        {
            type: String,
            required: true
        }
    ],
    category: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Ingredient', IngredientSchema)