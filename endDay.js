const mongoose = require('mongoose')
const User = require('./models/user')
const Restaurant = require('./models/restaurant')
const Dish = require('./models/dish')
const Ingredient = require('./models/ingredient')

module.exports.endDay = async (req, res) => {
    const user = await User.findById(res.locals.currentUser._id).populate('restaurants')
    const restaurants = user.restaurants

    for (let r of restaurants) {

        if (r.location == 'city') {
            maxDishesSold = 10
        }
        else if (r.location == 'suburbs') {
            maxDishesSold = 7
        }
        else {
            maxDishesSold = 5
        }

        const dishes = await Dish.find({ restaurant: r })
        let preparedDishes = []

        for (let d of dishes) {
            for (let i = 0; i < d.quantity; i++) {
                preparedDishes.push(d)
            }
        }

        const sellDish = async (d) => {
            const ingredientIds = d.ingredients
            let dishIngredients = []
            for (let i = 0; i < ingredientIds.length; i++) {
                const dishI = await Ingredient.findById(ingredientIds[i])
                dishIngredients.push(dishI)
            }

            let ingredientCost = 0
            for (let i = 0; i < dishIngredients.length; i++) {
                ingredientCost += dishIngredients[i].price
            }

            d.numberSold++
            d.quantity--
            await d.save()
            return (d.price - ingredientCost)
        }

        let restaurantProfit = 0

        if (preparedDishes.length == 0) {
            restaurantProfit = 0
        }
        else if (preparedDishes.length <= maxDishesSold) {
            for (let d of preparedDishes) {
                let profit = await sellDish(d)
                restaurantProfit += profit
                user.money += d.price
            }
        }
        else {
            for (let i = 0; i < maxDishesSold; i++) {
                let index = Math.floor(Math.random() * preparedDishes.length)
                let toSell = preparedDishes[index]
                let profit = await sellDish(toSell)
                restaurantProfit += profit
                user.money += preparedDishes[index].price
                preparedDishes.splice(index, 1)
            }
            for (let i = 0; i < preparedDishes.length; i++) {
                const ingredientIds = preparedDishes[i].ingredients
                let dishIngredients = []
                for (let i = 0; i < ingredientIds.length; i++) {
                    const dishI = await Ingredient.findById(ingredientIds[i])
                    dishIngredients.push(dishI)
                }

                let ingredientCost = 0
                for (let i = 0; i < dishIngredients.length; i++) {
                    ingredientCost += dishIngredients[i].price
                }
                restaurantProfit -= ingredientCost

                preparedDishes[i].quantity = 0
                await preparedDishes[i].save()
            }
            req.flash('error', 'you made too many things and they didn\'t all sell :(')
        }

        r.profit += restaurantProfit

        if (r.profit >= 1000 && r.rating < 2) {
            r.rating = 2
            req.flash('event', `a local guide gave ${r.name} a 2-star review online. that\'s a start!`)
        }
        if (r.profit > 5000 && r.rating < 3) {
            r.rating = 3
            req.flash('event', `${r.name} has several 3-star reviews online. not bad!`)
        }
        if (r.profit > 10000 && r.rating < 4) {
            r.rating = 4
            req.flash('event', `a prominent food blogger gave ${r.name} a 4-star review. great job!`)
        }
        if (r.profit > 20000 && r.rating < 5) {
            r.rating = 5
            req.flash('event', `a famous food critic gave ${r.name} 5 stars! congratulations!`)
        }

        await r.save()
    }

    user.day++

    //paying employees
    if (user.day == 16 || user.day == 31) {
        for (let r of restaurants) {
            user.money -= (r.numEmployees * r.employeePay)
            r.profit -= (r.numEmployees * r.employeePay)
            await r.save()
        }
    }

    //if end of month
    if (user.day > 30) {
        //pay rent
        for (let r of restaurants) {
            //pro-rate if opened mid-month:
            if (r.monthOpened == user.month) {
                user.money -= ((r.rent * (31 - r.dayOpened)) / 30)  //31 b/c if opened first day of month, charge for whole month
                r.profit -= ((r.rent * (31 - r.dayOpened)) / 30)
                await r.save()
            }
            else {
                user.money -= r.rent
                r.profit -= r.rent
                await r.save()
            }
        }
        user.month++
        user.day = 1
    }

    //if negative dollar amount
    if (user.money < 0) {
        let assets = 0
        const ingredients = user.ingredients
        let userIngredients = []
        //find all of a user's ingredients
        for (let i of ingredients) {
            const ingredient = await Ingredient.findById(i)
            userIngredients.push(ingredient)
        }
        //add up price of each ingredient in stock until you have at least $2 surplus to continue to play on
        while (assets + user.money < 2 && userIngredients[0].quantity > 0) { //FIX THIS - could have quantity left in a different ingredient besides the first one
            for (let i = 0; i < userIngredients.length; i++) {
                if (assets + user.money < 2) {
                    if (userIngredients[i].quantity > 0) {
                        assets += userIngredients[i].price
                        userIngredients[i].quantity--
                    }
                    await userIngredients[i].save()
                }
            }
        }

        // for (let i of userIngredients) {
        //     if (assets + user.money < 2) {
        //         assets += (i.quantity * i.price)
        //         i.quantity = 0
        //         await i.save()
        //     }
        // }
        if (assets + user.money > 0) {
            user.money += assets
            await user.save()
            req.flash('error', 'you had to sell some of your ingredients to cover your expenses')
            res.redirect('/restaurants')
        }
        else {
            for (let r of restaurants) {
                const dishes = await Dish.find({ restaurant: r })
                for (let d of dishes) {
                    await Dish.deleteOne(d)
                }
                r.dishes = []
                await r.save()
                await Restaurant.deleteOne(r)
            }
            user.restaurants = []
            await user.save()
            res.render('gameOver')
        }
    }
    else {
        await user.save()
        if (user.day == 11) {
            req.flash('event', 'employee payday in 5 days')
        }
        if (user.day == 26) {
            req.flash('event', 'rent due in 5 days')
        }
        res.redirect('/restaurants')
    }
}

 
