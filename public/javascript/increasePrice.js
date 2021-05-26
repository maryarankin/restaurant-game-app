const mongoose = require('mongoose')
const Dish = require('../models/dish')

const priceButton = document.querySelector('#price')

priceButton.addEventListener('click', async () => {
    const dish = await Dish.findOne({ name: 'cheesePizza' })
    console.log(dish)
    //dish.price += 1
    //await dish.save()
})

