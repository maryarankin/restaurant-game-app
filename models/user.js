const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    restauranttypes: [
        {
            type: String
        }
    ],
    restaurants: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Restaurant'
        }
    ],
    money: {
        type: Number,
    }
})

//note: need to add fxnality to delete restaurants if user is deleted

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)