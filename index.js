// PACKAGES 
const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')



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
const User = require('./models/user')



// VIEW ENGINE/EJS
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))



// POST/PUT REQUEST STUFF
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))



// SESSION
const sessionConfig = {
    //store - add once deploy to use mongo atlas instead of locally 
    name: 'session', //instead of default name (connect.sid) - this helps with security b/c hacker might otherwise try to take all connect.sid cookies
    secret: 'testsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true, //wait until deployed
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))



// AUTHENTICATION
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    next()
})



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
    const user = await User.findById(res.locals.currentUser._id)
    const restaurant = new Restaurant(req.body.restaurant)
    restaurant.numEmployees = 0
    restaurant.profit = 0
    restaurant.rating = 1
    user.restaurants.push(restaurant)
    await restaurant.save()
    await user.save()
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

app.get('/register', (req, res) => {
    res.render('users/register')
})

app.post('/register', async (req, res, next) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        //login user immediately:
        req.login(registeredUser, err => {
            if (err) return next(err)
            res.redirect('/restaurants')
        })
    } catch (e) {
        res.redirect('register')
    }
})

app.get('/login', (req, res) => {
    res.render('users/login')
})

app.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    const redirectUrl = req.session.returnTo || '/restaurants'
    delete req.session.returnTo
    res.redirect(redirectUrl)
})

app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/restaurants')
})



// EXPRESS PORT
app.listen(3000, () => {
    console.log("serving on port 3000")
})