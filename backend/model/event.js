const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    attendees: { type: Number, default: 0 },
    imagePath: { type: String }
}, { timestamps: true })

module.exports = mongoose.model("Event", eventSchema)
