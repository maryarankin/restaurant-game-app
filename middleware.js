module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        return res.redirect('/login')
    }
    next()
}

module.exports.isOwner = (req, res, next) => {
    const { id } = req.params
    if (res.locals.currentUser.restaurants.includes(id)) {
        return Restaurant.findById(id)
    }
    next()
}