const mongoose = require('mongoose')
const User = require('./models/user')

module.exports.randomEvents = async (req, res) => {
    const user = await User.findById(res.locals.currentUser._id)
    
    console.log('test')
    let message = ''
    let messageType = ''
    if (user.month == 1 && user.day == 14) {
        message = 'you found 5 dollars on the ground'
        messageType = 'success'
        user.money += 5
        await user.save()
        req.flash(messageType, message)
        console.log('test2')
    }
}