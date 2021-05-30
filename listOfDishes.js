//should put this into database once at beginning
//run as 'node listOfDishes.js' in cmd prompt

const mongoose = require('mongoose')
const Dish = require('./models/dish')
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

const pizzaDishes = [
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
]

const createPizzas = async () => {
    for (let dish of pizzaDishes) {
        const pizza = new Dish({ ...dish })
        const ingredients = await Ingredient.find({ dishes: pizza.name })
        for (let i of ingredients) {
            pizza.ingredients.push(i)
        }
        await pizza.save()
    }
}

const iceCreamDishes = [
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
]

const createIceCream = async () => {
    for (let dish of iceCreamDishes) {
        const iceCream = new Dish({ ...dish })
        const ingredients = await Ingredient.find({ dishes: iceCream.name })
        for (let i of ingredients) {
            iceCream.ingredients.push(i)
        }
        await iceCream.save()
    }
}


const burgerDishes = [
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

const createBurgers = async () => {
    for (let dish of burgerDishes) {
        const burger = new Dish({ ...dish })
        const ingredients = await Ingredient.find({ dishes: burger.name })
        for (let i of ingredients) {
            burger.ingredients.push(i)
        }
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