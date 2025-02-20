const mongoose = require('mongoose')

const RegisterStatusSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    },
    event: {
        type: mongoose.Schema.Types.ObjectId, ref: "Event"
    },
    status: {
        type: String,
        requited: true,
        enum: ["registered", "unregistered"],
        default: "unregistered"
    }
})

module.exports = mongoose.model("Register", RegisterStatusSchema)
