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


//NOTE: SHOULD ALL THE DISHES EXIST INITIALLY WHEN A USER IS CREATED?
//B/C DON'T WANT A DIFFERENT VERSION OF PIZZA EACH TIME A PIZZA PARLOR IS CREATED
//ALSO DON'T WANT A DIFFERENT VERSION OF PIZZA FOR EACH USER'S ACCOUNT