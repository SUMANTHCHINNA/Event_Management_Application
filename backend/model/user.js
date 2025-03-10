const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    occupation: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'guest'],
        default: 'user',
        required: true
    },
    status: {
        type: String,
        enum: ["active", 'in-active'],
        default: "active"
    }
}, { timestamps: true })

module.exports = mongoose.model("User", UserSchema)