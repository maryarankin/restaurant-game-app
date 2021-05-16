const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
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

app.get('/', (req, res) => {
    res.send('hi')
})

app.listen(3000, () => {
    console.log("serving on port 3000")
})