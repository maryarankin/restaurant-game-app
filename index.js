const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const app = express()

const mongoDbUrl = "mongodb://localhost:27017/restaurant-game";

mongoose.connect(mongoDbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", () => {
    console.log("database connected");
})

const Restaurant = require('./models/restaurant')

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/restaurants', (req, res) => {
    res.render('restaurants/index')
})

app.listen(3000, () => {
    console.log("serving on port 3000")
})