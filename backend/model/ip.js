const mongoose = require('mongoose')

const ipSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ip: { type: String, required: true },
    method: { type: String, required: true },
    path: { type: String, required: true }
}, { timestamps: true })


module.exports = mongoose.model('Ip', ipSchema)
