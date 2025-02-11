const user = require('./user.js')
const Ip = require('./ip.js')
const event = require('./event.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const mongoose = require('mongoose')
const cron = require("node-cron")
const dotenv = require('dotenv')
dotenv.config()

cron.schedule("55 11 * * *", async () => {
    try {
        await Ip.deleteMany({});
        console.log("All IP addresses cleared.")
    } catch (error) {
        console.error("Error clearing IP addresses:", error)
    }
}, {
    timezone: "Asia/Kolkata"
})

const checkUserInDb = async (email) => {
    try {
        const check = await user.findOne({ email })
        return check
    } catch (error) {
        return (`Error in checkUserInDb ${error}`)
    }
}

const createUser = async ({ username, email, password, role }) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = { username, email, password: hashedPassword, role }
        const userCreated = await user.create(newUser)
        return userCreated
    } catch (error) {
        return (`Error in createUser ${error}`)
    }
}

const createToken = async (userId) => {
    try {
        return await jwt.sign({ userId }, process.env.KEY)
    } catch (error) {
        return (`Error in createToken ${error}`)
    }
}

const checkPassword = async (newPassword, oldPassword) => {
    try {
        return await bcrypt.compare(newPassword, oldPassword);
    } catch (error) {
        return (`Error in checkPassword ${error}`)
    }
}

const getUserById = async (userId) => {
    try {
        const userdetails = await user.findOne({ _id: new mongoose.Types.ObjectId(userId) })
        return userdetails
    } catch (error) {
        return (`Error in getUserById ${error}`)
    }
}

const createEvent = async ({ name, description, date, location, attendees, imagePath }) => {
    try {
        const newEvent = { name: name, description: description, date: date, location: location, attendees: attendees, imagePath: imagePath }
        await event.create(newEvent)
        return `Event added Successfully`
    } catch (error) {
        return (`Error in createEvent ${error}`)
    }
}

const deleteEventById = async (event_id) => {
    try {
        await event.findOneAndDelete({ _id: event_id })
        return `Event deleted Successfully`
    } catch (error) {
        return (`Error in deleteEventById ${error}`)
    }
}

const patchEvent = async ({ name, description, date, attendees, event_id, imagePath }) => {
    try {
        const updatedEvent = { name, description, date, attendees, imagePath }
        await event.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(event_id) }, { $set: updatedEvent })
        return `Event updated Successfully`
    } catch (error) {
        return (`Error in patchEvent ${error}`)
    }
}

const geteventsByUserId = async () => {
    try {
        const events = await event.find()
        return events
    } catch (error) {
        return (`Error in geteventsByUserId ${error}`)
    }
}

const getEvent = async (event_id) => {
    try {
        const fetch = await event.findById({ _id: event_id })
        return fetch
    } catch (error) {
        return (`Error in getEvent ${error}`)
    }
}

const storeIp = async (userId, ip, method, path) => {
    try {
        const newIp = { user: new mongoose.Types.ObjectId(userId), ip, method, path }
        await Ip.create(newIp)
        return (`Ip stored successfully`)
    } catch (error) {
        return (`Error in storeIp ${error}`)
    }
}

const registerevent = async (event_id, username, email) => {
    try {
        const details = await event.findById({ _id: event_id });
        const { name, date, imagePath, location } = details
        await sendEmail(email, username, name, date, imagePath, location)
        return (`Event registered successfully Mail sent to ${name}`)
    } catch (error) {
        return (`Error in registerevent: ${error}`)
    }
}

const sendEmail = async (email, username, name, date, imagePath, location) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        })
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: `Registration Confirmation for ${name}`,
            html: `
                 <div
        style="font-family: Arial, sans-serif; color: #333; padding: 25px; border: 2px solid #ddd; border-radius: 12px; max-width: 700px; margin: auto; background-color: #f9f9f9;">
        <h1 style="color: #007BFF; text-align: center;">🎉 Registration Confirmation 🎉</h1>
        <h3 style="color: #444;">Dear <strong>${username}</strong>,</h3>
        <h4>We are pleased to inform you that your registration for the upcoming event has been successfully confirmed.
            We appreciate your interest and look forward to your participation.</h4>
        <h2 style="color: #28A745; text-align: center;">${name}</h2>
        <h4 style="color: #222;"><strong>📅 Event Date:</strong> ${date}
        </h4>
        <h4 style="color: #222;"><strong>📍 Event Location:</strong> ${location}
        </h4>
        <h4>This event is designed to provide an enriching and engaging experience, offering you valuable insights,
            networking opportunities, and knowledge sharing from industry experts. We encourage you to take full
            advantage of this opportunity.</h4>
        <h4 style="text-align: center; color: #007BFF;">✨ We look forward to seeing you at the event! ✨</h4>
        <h5 style="text-align: center; color: #777;">If you have any questions, please do not hesitate to reach out to
            our support team at [sumo1324@gmail.com].</h5>
        <h5 style="text-align: center; color: #777;">Thank you for your registration! 🎉</h5>
    </div>
            `
        }
        const info = await transporter.sendMail(mailOptions)
        return (`Event registered successfully Mail sent to ${username}`)
    } catch (error) {
        return (`Error in sendEmail ${error}`)
    }
}



module.exports = {
    checkUserInDb,
    createUser,
    createToken,
    checkPassword,
    getUserById,
    createEvent,
    deleteEventById,
    patchEvent,
    geteventsByUserId,
    getEvent,
    storeIp,
    registerevent,

}