// PACKAGES 
const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')



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



// POST/PUT REQUEST STUFF
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))



// ROUTES
app.get('/', (req, res) => {
    res.render('home')
})

app.get('/restaurants', async (req, res) => {
    const restaurants = await Restaurant.find({})
    res.render('restaurants/index', { restaurants })
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

app.get('/restaurants/:id', async (req, res) => {
    const { id } = req.params
    const restaurant = await Restaurant.findById(id)
    res.render('restaurants/show', { restaurant })
})

app.get('/restaurants/:id/edit', async (req, res) => {
    const { id } = req.params
    const restaurant = await Restaurant.findById(id)
    res.render('restaurants/edit', { restaurant })
})

app.put('/restaurants/:id', async (req, res) => {
    const { id } = req.params
    const restaurant = await Restaurant.findById(id)
    const restaurantName = req.body.restaurant.name
    restaurant.name = restaurantName
    await restaurant.save()
    res.redirect(`/restaurants/${restaurant._id}`)
})



// EXPRESS PORT
app.listen(3000, () => {
    console.log("serving on port 3000")
})