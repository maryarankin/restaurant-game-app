// USING .ENV IN DEVELOPMENT ENVIRONMENT
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}



// PACKAGES 
const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const MongoStore = require('connect-mongo')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const { isLoggedIn, isOwner } = require('./middleware')
const { endDay } = require('./endDay')
const { randomEvents } = require('./randomEvents')



// DATABASE CONNECTION
const mongoDbUrl = process.env.DB_URL || 'mongodb://localhost:27017/restaurant-game'

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



// MONGOOSE MODELS
const Restaurant = require('./models/restaurant')
const User = require('./models/user')
const Dish = require('./models/dish')
const Ingredient = require('./models/ingredient')



// DISHES & INGREDIENTS DATA
const dishesData = require('./newListOfDishes')
const ingredientsData = require('./newListOfIngredients')
const user = require('./models/user')
const { use } = require('passport')
const restaurant = require('./models/restaurant')



// VIEW ENGINE/EJS
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))



// POST/PUT REQUEST STUFF
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))



// STATIC DIRECTORY
app.use(express.static(path.join(__dirname, 'public')))



// SECURITY
app.use(mongoSanitize())
app.use(helmet())

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://cdn.jsdelivr.net",
]
const styleSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://cdn.jsdelivr.net"
]

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'"],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'"],
        },
    })
)



// MONGO STORE
const secret = process.env.SECRET

const store = MongoStore.create({
    mongoUrl: mongoDbUrl,
    secret,
    ttl: 14 * 24 * 60 * 60
})

store.on("error", function (e) {
    console.log("session store error", e)
})



// SESSION
const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());



// AUTHENTICATION
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.event = req.flash('event')
    next()
})



// ROUTES
app.get('/home', (req, res) => {
    res.render('home')
})

app.get('/start', isLoggedIn, (req, res) => {
    res.render('start')
})

//DO .POPULATE INSTEAD:
app.get('/restaurants', isLoggedIn, async (req, res) => {
    const user = await User.findById(res.locals.currentUser._id)
    const userRestaurants = user.restaurants
    const restaurants = []
    for (let i = 0; i < userRestaurants.length; i++) {
        const restaurant = await Restaurant.findById(userRestaurants[i])
        restaurants.push(restaurant)
    }

    res.render('restaurants/index', { restaurants })
})

app.get('/restaurants/new', isLoggedIn, async (req, res) => {
    const user = await User.findById(res.locals.currentUser._id)
    const restaurantTypes = user.restauranttypes
    if (restaurantTypes.length > 0) {
        res.render('restaurants/new', { user })
    }
    else {
        res.render('start')
    }
})

app.post('/restaurants', isLoggedIn, async (req, res) => {
    const user = await User.findById(res.locals.currentUser._id).populate('ingredients')
    const restaurant = new Restaurant(req.body.restaurant)
    const type = user.restauranttypes[0] //CHANGE THIS ONCE THEY UNLOCK MORE RESTAURANT TYPES
    restaurant.type = type
    restaurant.monthOpened = user.month
    restaurant.dayOpened = user.day
    if (restaurant.location == 'city') {
        restaurant.rent = 150
        restaurant.employeePay = 45
    }
    else if (restaurant.location == 'suburbs') {
        restaurant.rent = 100
        restaurant.employeePay = 30
    }
    else {
        restaurant.rent = 50
        restaurant.employeePay = 15
    }
    restaurant.numEmployees = 1
    restaurant.profit = 0
    restaurant.rating = 1
    //create new instances of the dishes each time creating new restaurant so each can have their own prices:
    let dishType = null
    if (restaurant.type == 'pizza-parlor') {
        dishType = dishesData.pizzaDishes
    }
    else if (restaurant.type == 'burger-place') {
        dishType = dishesData.burgerDishes
    }
    else {
        dishType = dishesData.iceCreamDishes
    }

    for (let dish of dishType) {
        const newDish = new Dish({ ...dish })
        const ingredients = user.ingredients
        for (let i of ingredients) {
            if (i.dishes.includes(dish.name)) {
                newDish.ingredients.push(i)
            }
        }
        newDish.restaurant = restaurant
        newDish.numberSold = 0
        await newDish.save()
        restaurant.dishes.push(newDish)
    }

    await restaurant.save()
    user.restaurants.push(restaurant)
    await user.save()
    req.flash('success', 'created a new restaurant')
    res.redirect('/restaurants')
})

app.get('/restaurants/:id', isLoggedIn, async (req, res) => {
    const user = await User.findById(res.locals.currentUser._id).populate('ingredients')
    const { id } = req.params
    if (user.restaurants.includes(id)) {
        const restaurant = await Restaurant.findById(id).populate('dishes')
        const dishes = await Dish.find({ restaurant: restaurant })  //change this so don't have to both populate AND find dishes - was working the other day but now isn't
        const ingredients = user.ingredients
        for (let i = 0; i < ingredients.length; i++) {
            if (ingredients[i].category !== restaurant.type) {
                ingredients.splice(i)
            }
        }
        res.render('restaurants/show', { restaurant, dishes, ingredients, user })
    }
    else {
        const errorMsg = 'restaurant does not exist'
        res.render('error', { errorMsg })
    }
})

app.get('/restaurants/:id/edit', isLoggedIn, async (req, res) => {
    const user = await User.findById(res.locals.currentUser._id)
    const { id } = req.params
    if (user.restaurants.includes(id)) {
        const restaurant = await Restaurant.findById(id)
        res.render('restaurants/edit', { restaurant })
    }
    else {
        const errorMsg = 'restaurant does not exist'
        res.render('error', { errorMsg })
    }
})

app.put('/restaurants/:id', isLoggedIn, async (req, res) => {
    const user = await User.findById(res.locals.currentUser._id)
    const { id } = req.params
    if (user.restaurants.includes(id)) {
        const restaurant = await Restaurant.findById(id)
        const restaurantName = req.body.restaurant.name
        restaurant.name = restaurantName
        await restaurant.save()
        res.redirect(`/restaurants/${restaurant._id}`)
    }
    else {
        const errorMsg = 'restaurant does not exist'
        res.render('error', { errorMsg })
    }
})

app.delete('/restaurants/:id', isLoggedIn, async (req, res) => {
    const user = await User.findById(res.locals.currentUser._id)
    const { id } = req.params
    if (user.restaurants.includes(id)) {
        await Restaurant.findByIdAndDelete(id)
        user.restaurants.pull({ _id: id })
        await user.save()
        res.redirect('/restaurants')
    }
    else {
        const errorMsg = 'restaurant does not exist'
        res.render('error', { errorMsg })
    }
})

app.get('/:restaurantId/employees', isLoggedIn, async (req, res) => {
    const { restaurantId } = req.params
    const restaurant = await Restaurant.findById(restaurantId)
    res.render('employee', { restaurant })
})

app.get('/register', (req, res) => {
    res.render('users/register')
})

app.post('/register', async (req, res, next) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        user.money = 0
        user.month = 1
        user.day = 1
        const registeredUser = await User.register(user, password)
        //log in user immediately:
        req.login(registeredUser, err => {
            if (err) return next(err)
            req.flash('success', 'account created')
            res.redirect('/start')
        })
    } catch (e) {
        req.flash('error', 'could not create account')
        res.redirect('/register')
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

app.post('/choose/:type', isLoggedIn, async (req, res) => {
    const { type } = req.params
    const user = await User.findById(res.locals.currentUser._id)
    if (user.restauranttypes[0] == null) {
        user.restauranttypes.push(type)

        let ingredients = null
        if (type == 'pizza-parlor') {
            ingredients = ingredientsData.pizzaIngredients
        }
        else if (type == 'burger-place') {
            ingredients = ingredientsData.burgerIngredients
        }
        else {
            ingredients = ingredientsData.iceCreamIngredients
        }

        for (let i of ingredients) {
            const newIngredient = new Ingredient({ ...i })
            newIngredient.quantity = 1
            await newIngredient.save()
            user.ingredients.push(newIngredient)
        }

        await user.save()
        res.redirect('/welcome')
    }
    else {
        const errorMsg = 'you have already picked a restaurant type'
        res.render('error', { errorMsg })
    }
})

//to view instructions later in the game if desired:
app.get('/welcome', isLoggedIn, async (req, res) => {
    const user = await User.findById(res.locals.currentUser._id)
    res.render('welcome', { user })
})

app.get('/welcome/createnew', isLoggedIn, async (req, res) => {
    const user = await User.findById(res.locals.currentUser._id)
    res.render('restaurants/new', { user })
})

app.get('/:restaurantId/menu/:dishId', isLoggedIn, async (req, res) => {
    const { restaurantId, dishId } = req.params
    const dish = await Dish.findById(dishId).populate('ingredients')  //when did with .find it wouldn't print dish.name, only dish
    const restaurant = await Restaurant.findById(restaurantId)
    res.render('dishes/show', { dish, restaurant })
})

app.put('/:restaurantId/buyall/:dishId', isLoggedIn, async (req, res) => {
    const user = await User.findById(res.locals.currentUser._id)
    const { restaurantId, dishId } = req.params
    const dish = await Dish.findById(dishId).populate('ingredients')
    const ingredients = dish.ingredients
    let totalIngredientPrice = 0
    for (let i of ingredients) {
        totalIngredientPrice += i.price
    }
    if (user.money >= totalIngredientPrice) {
        for (let i of ingredients) {
            i.quantity++
            user.money -= i.price
            await i.save()
        }
        await user.save()
    }
    res.redirect(`/${restaurantId}/menu/${dishId}`)
})

app.put('/:restaurantId/menu/:id', isLoggedIn, async (req, res) => {
    const { restaurantId, id } = req.params
    const dish = await Dish.findById(id)
    dish.price = req.body.dish.price
    await dish.save()
    res.redirect(`/${restaurantId}/menu/${id}`)
})

app.put('/ingredients/:restaurantId/:name', isLoggedIn, async (req, res) => {
    const user = await User.findById(res.locals.currentUser._id).populate('ingredients')
    const { restaurantId, name } = req.params
    const ingredients = user.ingredients
    let ingredient = null
    for (let i = 0; i < ingredients.length; i++) {
        if (ingredients[i].name == name) {
            ingredient = ingredients[i]
        }
    }

    //change in case decimal precision isn't perfect
    if (user.money >= ingredient.price) {
        ingredient.quantity++
        user.money -= ingredient.price
        await ingredient.save()
        await user.save()
    }
    res.redirect(`/restaurants/${restaurantId}`)
})

app.put('/:restaurantId/hire', isLoggedIn, async (req, res) => {
    const { restaurantId } = req.params
    const restaurant = await Restaurant.findById(restaurantId)
    restaurant.numEmployees++
    await restaurant.save()
    res.redirect(`/restaurants/${restaurant._id}`)
})

app.put('/:restaurantId/employees/hire', isLoggedIn, async (req, res) => {
    const { restaurantId } = req.params
    const restaurant = await Restaurant.findById(restaurantId)
    restaurant.numEmployees++
    await restaurant.save()
    res.redirect(`/${restaurant._id}/employees`)
})

app.put('/:restaurantId/employees/fire', isLoggedIn, async (req, res) => {
    const { restaurantId } = req.params
    const restaurant = await Restaurant.findById(restaurantId)
    restaurant.numEmployees--
    await restaurant.save()
    res.redirect(`/${restaurant._id}/employees`)
})

app.put('/endday', isLoggedIn, async (req, res) => {
    await randomEvents(req, res)
    await endDay(req, res)
})

app.put('/:restaurantId/cook/:dishId', isLoggedIn, async (req, res) => {
    const { restaurantId, dishId } = req.params

    const restaurant = await Restaurant.findById(restaurantId).populate('dishes')
    const restaurantDishes = restaurant.dishes

    let totalDishNum = 0
    for (let dish of restaurantDishes) {
        totalDishNum += dish.quantity
    }
    let metWorkLimit = false
    if ((restaurant.numEmployees * 5) <= totalDishNum) {
        metWorkLimit = true
    }

    const dish = await Dish.findById(dishId).populate('ingredients')
    const ingredients = dish.ingredients
    let haveAllIngredients = true
    for (let i of ingredients) {
        if (i.quantity == 0) {
            haveAllIngredients = false
            break
        }
    }

    if (haveAllIngredients && !metWorkLimit) {
        for (let i of ingredients) {
            i.quantity--
            await i.save()
        }
        dish.quantity++
        await dish.save()
        res.redirect(`/restaurants/${restaurantId}`)
    }
    else if (!haveAllIngredients) { 
        req.flash('error', 'need to buy ingredients')
        res.redirect(`/restaurants/${restaurantId}`)
    }
    else {
        req.flash('error', 'employees cannot make any more food. hire more employees')
        res.redirect(`/restaurants/${restaurantId}`)
    }
})

app.get('/startover', isLoggedIn, async (req, res) => {
    //also delete ingredients for game over & recreate them when making a new restaurant?
    const user = await User.findById(res.locals.currentUser._id).populate('ingredients')
    user.money = 0
    user.month = 1
    user.day = 1
    const ingredients = user.ingredients
    for (let i of ingredients) {
        i.quantity++
        await i.save()
    }
    await user.save()
    res.render('startOver')
})

app.all('*', (req, res) => {
    const errorMsg = 'page not found'
    res.render('error', { errorMsg })
})

// EXPRESS PORT
app.listen(3000, () => {
    console.log('serving on port 3000')
})