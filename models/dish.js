const mongoose = require('mongoose')

const Schema = mongoose.Schema

const DishSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },

    //MAKE THIS AN ENUM?
    category: {
        type: String,
        required: true
    },
    ingredients: [
        {
            type: String
            // type: Schema.Types.ObjectId,
            // ref: 'Ingredient'
        }
    ]
})

module.exports = mongoose.model('Dish', DishSchema)