const mongoose = require('mongoose')
const Dish = require('./models/dish')
const Ingredient = require('./models/ingredient')

module.exports = {

    pizzaDishes: [
        {
            name: 'cheesePizza',
            stringName: 'cheese pizza',
            price: 9.00,
            quantity: 0,
            category: 'pizza-parlor',
        },
        {
            name: 'pepperoniPizza',
            stringName: 'pepperoni pizza',
            price: 9.50,
            quantity: 0,
            category: 'pizza-parlor'
        },
        {
            name: 'meatLoversPizza',
            stringName: 'meat lovers pizza',
            price: 10.00,
            quantity: 0,
            category: 'pizza-parlor'
        }
    ],

    iceCreamDishes: [
        {
            name: 'vanillaCone',
            stringName: 'vanilla cone',
            price: 2.00,
            quantity: 0,
            category: 'icecream-shop'
        },
        {
            name: 'chocolateCone',
            stringName: 'chocolate cone',
            price: 2.00,
            quantity: 0,
            category: 'icecream-shop'
        },
        {
            name: 'strawberryCone',
            stringName: 'strawberry cone',
            price: 2.00,
            quantity: 0,
            category: 'icecream-shop'
        },
    ],

    burgerDishes: [
        {
            name: 'hamburger',
            stringName: 'hamburger',
            price: 6.00,
            quantity: 0,
            category: 'burger-place'
        },
        {
            name: 'cheeseburger',
            stringName: 'cheeseburger',
            price: 6.50,
            quantity: 0,
            category: 'burger-place'
        },
        {
            name: 'baconCheeseburger',
            stringName: 'bacon cheeseburger',
            price: 7.00,
            quantity: 0,
            category: 'burger-place'
        }
    ]
}

