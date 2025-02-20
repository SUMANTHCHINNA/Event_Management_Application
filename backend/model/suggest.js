const mongoose = require("mongoose")
const SuggestSchema = new mongoose.Schema({
    data: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    username: {
        type: String,
        required: true
    }
}, { timeStamps: true })

module.exports = mongoose.model("Suggest", SuggestSchema)