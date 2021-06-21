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
const { isLoggedIn, isOwner } = require('./middleware')



// DATABASE CONNECTION
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



// MONGOOSE MODELS
const Restaurant = require('./models/restaurant')
const User = require('./models/user')
const Dish = require('./models/dish')
const Ingredient = require('./models/ingredient')



// DISHES & INGREDIENTS DATA
const dishesData = require('./newListOfDishes')
const ingredientsData = require('./newListOfIngredients')



// VIEW ENGINE/EJS
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))



// POST/PUT REQUEST STUFF
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))



// STATIC DIRECTORY
app.use(express.static(path.join(__dirname, 'public')))



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

app.get('/restaurants/new', isLoggedIn, (req, res) => {
    res.render('restaurants/new')
})

app.post('/restaurants', isLoggedIn, async (req, res) => {
    const user = await User.findById(res.locals.currentUser._id).populate('ingredients')
    const restaurant = new Restaurant(req.body.restaurant)
    const type = user.restauranttypes[0] //CHANGE THIS ONCE THEY UNLOCK MORE RESTAURANT TYPES
    restaurant.type = type
    restaurant.numEmployees = 0
    restaurant.profit = 0
    restaurant.rating = 1
    //create new instances of the dishes each time creating new restaurant so each can have their own prices
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
        await newDish.save()
        restaurant.dishes.push(newDish)
    }

    // const dishes = await Dish.find({ category: restaurant.type })
    // //change this syntax:
    // for (let dish of dishes) {
    //     restaurant.dishes.push(dish)
    // }
    await restaurant.save()
    user.restaurants.push(restaurant)
    await user.save()
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
        res.render('restaurants/show', { restaurant, dishes, ingredients })
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

app.get('/register', (req, res) => {
    res.render('users/register')
})

app.post('/register', async (req, res, next) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        user.money = 0
        user.day = 1
        const registeredUser = await User.register(user, password)
        //log in user immediately:
        req.login(registeredUser, err => {
            if (err) return next(err)
            res.redirect('/start')
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
        res.render('restaurants/new')
    }
    else {
        const errorMsg = 'you have already picked a restaurant type'
        res.render('error', { errorMsg })
    }
})

app.get('/menu/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params
    const dish = await Dish.findById(id).populate('ingredients')  //when did with .find it wouldn't print dish.name, only dish
    res.render('dishes/show', { dish })
})

app.put('/menu/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params
    const dish = await Dish.findById(id)
    dish.price = req.body.dish.price
    await dish.save()
    res.redirect(`/menu/${id}`)
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

app.put('/endday', isLoggedIn, async (req, res) => {
    const user = await User.findById(res.locals.currentUser._id).populate('restaurants')
    const restaurants = user.restaurants
    for (let r of restaurants) {
        let restaurantProfit = 0
        const dishes = await Dish.find({ restaurant: r })
        for (let d of dishes) {
            const ingredientIds = d.ingredients
            let dishIngredients = []
            for (let i = 0; i < ingredientIds.length; i++) {
                const dishI = await Ingredient.findById(ingredientIds[i])
                dishIngredients.push(dishI)
            }

            let ingredientCost = 0
            for (let i = 0; i < dishIngredients.length; i++) {
                ingredientCost += (dishIngredients[i].price * d.quantity)
            }

            restaurantProfit += (d.quantity * d.price) - ingredientCost
            user.money += (d.quantity * d.price)
            d.quantity = 0
            await d.save()
        }
        r.profit += restaurantProfit
        await r.save()
    }
    user.day++
    await user.save()
    res.redirect('/restaurants')
})

app.put('/:restaurantId/cook/:dishId', isLoggedIn, async (req, res) => {
    const { restaurantId, dishId } = req.params
    const dish = await Dish.findById(dishId).populate('ingredients')
    const ingredients = dish.ingredients
    let haveAllIngredients = true
    for (let i of ingredients) {
        if (i.quantity == 0) {
            haveAllIngredients = false
            break
        }
    }
    if (haveAllIngredients) {
        for (let i of ingredients) {
            i.quantity--
            await i.save()
        }
        dish.quantity++
        await dish.save()
        res.redirect(`/restaurants/${restaurantId}`)
    }
    else { //CHANGE THIS TO A FLASH MESSAGE LATER
        const errorMsg = 'need to buy ingredients'
        res.render('error', { errorMsg })
    }
})

// EXPRESS PORT
app.listen(3000, () => {
    console.log('serving on port 3000')
})