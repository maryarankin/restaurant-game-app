const mongoose = require('mongoose')
const User = require('./models/user')

module.exports.randomEvents = async (req, user) => {
    let message = ''
    let messageType = ''
    if (user.month == 1 && user.day == 14) {
        message = 'you found 5 dollars on the ground'
        messageType = 'success'
        user.money += 5
        await user.save()
        req.flash(messageType, message)
    }
    if (user.month == 1 && user.day == 27) {
        message = 'someone stole $20 from the till when you weren\'t looking'
        messageType = 'error'
        user.money -= 20
        await user.save()
        req.flash(messageType, message)
    }
}