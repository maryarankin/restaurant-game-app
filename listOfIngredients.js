const mongoose = require('mongoose')
const Ingredient = require('./models/ingredient')

const mongoDbUrl = 'mongodb://localhost:27017/restaurant-game'

mongoose.connect(mongoDbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', () => {
    console.log('database connected');
})

const pizzaIngredients = [
    {
        name: 'dough',
        stringName: 'pizza dough',
        price: 0.25,
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
        dishes: [
            'meatLoversPizza'
        ],
        category: 'pizza-parlor'
    },
]

const createPizzaIngredients = async () => {
    for (let i of pizzaIngredients) {
        const pizzaIngredient = new Ingredient({ ...i })
        await pizzaIngredient.save()
    }
}

const iceCreamIngredients = [
    {
        name: 'cone',
        stringName: 'waffle cone',
        price: 0.25,
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
        dishes: [
            'strawberryCone'
        ],
        category: 'icecream-shop'
    },
    {
        name: 'vanilla',
        stringName: 'scoop of vanilla ice cream',
        price: 0.25,
        dishes: [
            'vanillaCone'
        ],
        category: 'icecream-shop'
    },
    {
        name: 'chocolate',
        stringName: 'scoop of chocolate ice cream',
        price: 0.25,
        dishes: [
            'chocolateCone'
        ],
        category: 'icecream-shop'
    },
    {
        name: 'sprinkles',
        stringName: 'rainbow sprinkles',
        price: 0.05,
        dishes: [
            'vanillaCone',
            'chocolateCone',
            'strawberryCone'
        ],
        category: 'icecream-shop'
    },
]

const createIceCreamIngredients = async () => {
    for (let i of iceCreamIngredients) {
        const iceCreamIngredient = new Ingredient({ ...i })
        await iceCreamIngredient.save()
    }
}

const burgerIngredients = [
    {
        name: 'bun',
        stringName: 'sesame bun',
        price: 0.10,
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
        dishes: [
            'baconCheeseburger'
        ],
        category: 'burger-place'
    },
]

const createBurgerIngredients = async () => {
    for (let i of burgerIngredients) {
        const burgerIngredient = new Ingredient({ ...i })
        await burgerIngredient.save()
    }
}

const createAllIngredients = async () => {
    await Ingredient.deleteMany({})
    await createPizzaIngredients()
    await createIceCreamIngredients()
    await createBurgerIngredients()
}

createAllIngredients().then(() => {
    mongoose.connection.close()
})