// PACKAGES 
const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')



// DATABASE CONNECTION
const mongoDbUrl = 'mongodb://localhost:27017/restaurant-game'

mongoose.connect(mongoDbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", () => {
    console.log("database connected");
})



// MONGOOSE MODELS
const Restaurant = require('./models/restaurant')



// VIEW ENGINE/EJS
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))



// POST REQUEST STUFF
app.use(express.urlencoded({ extended: true }))



// ROUTES
app.get('/', (req, res) => {
    res.render('home')
})

app.get('/restaurants', (req, res) => {
    res.render('restaurants/index')
})

app.get('/restaurants/new', (req, res) => {
    res.render('restaurants/new')
})

app.post('/restaurants', async (req, res) => {
    const restaurant = new Restaurant(req.body.restaurant)
    restaurant.numEmployees = 0
    restaurant.profit = 0
    restaurant.rating = 1
    await restaurant.save()
    res.redirect('/restaurants')
})



// EXPRESS PORT
app.listen(3000, () => {
    console.log("serving on port 3000")
})