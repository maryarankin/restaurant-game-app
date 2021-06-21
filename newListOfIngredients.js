const mongoose = require('mongoose')
const Ingredient = require('./models/ingredient')

module.exports = {
    pizzaIngredients: [
        {
            name: 'dough',
            stringName: 'pizza dough',
            price: 0.25,
            quantity: 0,
            dishes: [
                'cheesePizza',
                'pepperoniPizza',
                'meatLoversPizza'
            ],
            category: 'pizza-parlor'
        },
        {
            name: 'marinara',
            stringName: 'marinara sauce',
            price: 0.10,
            quantity: 0,
            dishes: [
                'cheesePizza',
                'pepperoniPizza',
                'meatLoversPizza'
            ],
            category: 'pizza-parlor'
        },
        {
            name: 'mozzarella',
            stringName: 'mozzarella cheese',
            price: 0.10,
            quantity: 0,
            dishes: [
                'cheesePizza',
                'pepperoniPizza',
                'meatLoversPizza'
            ],
            category: 'pizza-parlor'
        },
        {
            name: 'pepperoni',
            stringName: 'pepperoni',
            price: 0.05,
            quantity: 0,
            dishes: [
                'pepperoniPizza',
                'meatLoversPizza'
            ],
            category: 'pizza-parlor'
        },
        {
            name: 'sausage',
            stringName: 'sausage',
            price: 0.10,
            quantity: 0,
            dishes: [
                'meatLoversPizza'
            ],
            category: 'pizza-parlor'
        }
    ],
    iceCreamIngredients: [
        {
            name: 'cone',
            stringName: 'waffle cone',
            price: 0.25,
            quantity: 0,
            dishes: [
                'vanillaCone',
                'chocolateCone',
                'strawberryCone'
            ],
            category: 'icecream-shop'
        },
        {
            name: 'strawberry',
            stringName: 'scoop of strawberry ice cream',
            price: 0.25,
            quantity: 0,
            dishes: [
                'strawberryCone'
            ],
            category: 'icecream-shop'
        },
        {
            name: 'vanilla',
            stringName: 'scoop of vanilla ice cream',
            price: 0.25,
            quantity: 0,
            dishes: [
                'vanillaCone'
            ],
            category: 'icecream-shop'
        },
        {
            name: 'chocolate',
            stringName: 'scoop of chocolate ice cream',
            price: 0.25,
            quantity: 0,
            dishes: [
                'chocolateCone'
            ],
            category: 'icecream-shop'
        },
        {
            name: 'sprinkles',
            stringName: 'rainbow sprinkles',
            price: 0.05,
            quantity: 0,
            dishes: [
                'vanillaCone',
                'chocolateCone',
                'strawberryCone'
            ],
            category: 'icecream-shop'
        }
    ],
    burgerIngredients: [
        {
            name: 'bun',
            stringName: 'sesame bun',
            price: 0.10,
            quantity: 0,
            dishes: [
                'hamburger',
                'cheeseburger',
                'baconCheeseburger'
            ],
            category: 'burger-place'
        },
        {
            name: 'beef',
            stringName: 'beef patty',
            price: 0.50,
            quantity: 0,
            dishes: [
                'hamburger',
                'cheeseburger',
                'baconCheeseburger'
            ],
            category: 'burger-place'
        },
        {
            name: 'cheddar',
            stringName: 'slice of cheddar',
            price: 0.25,
            quantity: 0,
            dishes: [
                'cheeseburger',
                'baconCheeseburger'
            ],
            category: 'burger-place'
        },
        {
            name: 'lettuce',
            stringName: 'lettuce',
            price: 0.05,
            quantity: 0,
            dishes: [
                'hamburger',
                'cheeseburger',
                'baconCheeseburger'
            ],
            category: 'burger-place'
        },
        {
            name: 'tomato',
            stringName: 'slice of tomato',
            price: 0.05,
            quantity: 0,
            dishes: [
                'hamburger',
                'cheeseburger',
                'baconCheeseburger'
            ],
            category: 'burger-place'
        },
        {
            name: 'bacon',
            stringName: 'strip of bacon',
            price: 0.25,
            quantity: 0,
            dishes: [
                'baconCheeseburger'
            ],
            category: 'burger-place'
        }
    ]
}