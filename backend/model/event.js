const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    type: { type: String },
    location: { type: String, required: true },
    attendees: { type: Number, default: 0 },
    imagePath: { type: String },
    status: { type: String, enum: ["accepted", "pending", "rejected"], default: "pending" },
    Registations: { type: Number, default: 0 },
    seatsLeft: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
}, { timestamps: true })

module.exports = mongoose.model("Event", eventSchema)
