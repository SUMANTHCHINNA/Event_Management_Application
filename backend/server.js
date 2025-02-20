const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const userRouter = require('./routes/user')
const eventRouter = require('./routes/event')
const dotenv = require('dotenv')
dotenv.config()

app.use(express.json())

app.use("/images", express.static(path.join(__dirname, "images")))

app.use(userRouter)
app.use(eventRouter)

const port = process.env.PORT

mongoose.connect(process.env.MONGO_DB_URL)
    .then(() => {
        app.listen(port, () => {
            console.log(`The server running on port ${port}`)
        })
    })
    .catch((error) => {
        console.log(`The DB not connected ${error}`)
    })
