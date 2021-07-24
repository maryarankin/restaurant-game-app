const mongoose = require('mongoose')
const User = require('./models/user')

module.exports.randomEvents = async (user, req) => {
    let message = ''
    let messageType = ''
    if (user.month == 1 && user.day == 14) {
        message = 'you found 5 dollars on the ground'
        messageType ='success'
        user.money += 5
        await user.save()
        req.flash(messageType, message)
    }
}