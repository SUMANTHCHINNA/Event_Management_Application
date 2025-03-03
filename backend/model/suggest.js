const mongoose = require("mongoose")
const SuggestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    attendees: {
        type: Number,
        default: 0
    },
    imagePath: {
        type: String,
        required: true
    }
}, { timeStamps: true })

module.exports = mongoose.model("Suggest", SuggestSchema)