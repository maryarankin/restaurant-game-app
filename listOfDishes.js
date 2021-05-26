//should put this into database once at beginning
//run as 'node listOfDishes.js' in cmd prompt

const mongoose = require('mongoose')
const Dish = require('./models/dish')

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

const pizzaDishes = [
    {
        name: 'cheesePizza',
        stringName: 'cheese pizza',
        price: 9.00,
        category: 'pizza-parlor',
        ingredients: [
            'pizza dough',
            'marinara',
            'mozzarella'
        ]
    },
    {
        name: 'pepperoniPizza',
        stringName: 'pepperoni pizza',
        price: 9.50,
        category: 'pizza-parlor',
        ingredients: [
            'pizza dough',
            'marinara',
            'mozzarella',
            'pepperoni'
        ]
    },
    {
        name: 'meatLoversPizza',
        stringName: 'meat lovers pizza',
        price: 10.00,
        category: 'pizza-parlor',
        ingredients: [
            'dough',
            'marinara',
            'mozzarella',
            'pepperoni',
            'sausage'
        ]
    }
]

const createPizzas = async () => {
    for (let dish of pizzaDishes) {
        const pizza = new Dish({ ...dish })
        await pizza.save()
    }
}


const iceCreamDishes = [
    {
        name: 'vanillaCone',
        stringName: 'vanilla cone',
        price: 2.00,
        category: 'icecream-shop',
        ingredients: [
            'cone',
            'scoop of vanilla',
            'sprinkles'
        ]
    },
    {
        name: 'chocolateCone',
        stringName: 'chocolate cone',
        price: 2.00,
        category: 'icecream-shop',
        ingredients: [
            'cone',
            'scoop of chocolate',
            'sprinkles'
        ]
    },
    {
        name: 'strawberryCone',
        stringName: 'strawberry cone',
        price: 2.00,
        category: 'icecream-shop',
        ingredients: [
            'cone',
            'scoop of strawberry',
            'sprinkles'
        ]
    },
]

const createIceCream = async () => {
    for (let dish of iceCreamDishes) {
        const iceCream = new Dish({ ...dish })
        await iceCream.save()
    }
}


const burgerDishes = [
    {
        name: 'hamburger',
        stringName: 'hamburger',
        price: 6.00,
        category: 'burger-place',
        ingredients: [
            'bun',
            'beef patty',
            'lettuce',
            'tomato'
        ]
    },
    {
        name: 'cheeseburger',
        stringName: 'cheeseburger',
        price: 6.50,
        category: 'burger-place',
        ingredients: [
            'bun',
            'beef patty',
            'cheddar',
            'lettuce',
            'tomato'
        ]
    },
    {
        name: 'baconCheeseburger',
        stringName: 'bacon cheeseburger',
        price: 7.00,
        category: 'burger-place',
        ingredients: [
            'bun',
            'beef patty',
            'cheddar',
            'lettuce',
            'tomato',
            'bacon'
        ]
    }
]

const createBurgers = async () => {
    for (let dish of burgerDishes) {
        const burger = new Dish({ ...dish })
        await burger.save()
    }
}


const createAllDishes = async () => {
    await Dish.deleteMany({})
    await createPizzas()
    await createIceCream()
    await createBurgers()
}

createAllDishes().then(() => {
    mongoose.connection.close()
})