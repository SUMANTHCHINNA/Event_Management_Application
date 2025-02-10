const user = require('./user.js')
const Ip = require('./ip.js')
const event = require('./event.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const checkUserInDb = async (email) => {
    try {
        const r = await user.findOne({ email })
        return r
    } catch (error) {
        return (`Error in checkUserInDb ${error}`)
    }
}

const createUser = async ({ username, email, password, role }) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = { username, email, password: hashedPassword, role }
        const r = await user.create(newUser)
        return r
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
        const r = await user.findOne({ _id: new mongoose.Types.ObjectId(userId) })
        return r
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
        const r = await event.find()
        return r
    } catch (error) {
        return (`Error in geteventsByUserId ${error}`)
    }
}

const getEvent = async (event_id) => {
    try {
        const f = await event.findById({ _id: event_id })
        return f
    } catch (error) {
        return (`Error in getEvent ${error}`)
    }
}

const storeIp = async (u_id, ip, method, path) => {
    try {
        const newIp = { user: new mongoose.Types.ObjectId(u_id), ip, method, path }
        await Ip.create(newIp)
        return (`Ip stored successfully`)
    } catch (error) {
        return (`Error in storeIp ${error}`)
    }
}

const registerevent = async (event_id, name, email) => {
    try {
        const details = await event.findById({ _id: event_id });
        const e_n = details.name
        const e_d = details.date
        const e_i = details.imagePath
        const u_n = name
        const u_e = email
        const e_l = details.location
        await sendEmail(u_e, u_n, e_n, e_d, e_i, e_l)
        return (`Event registered successfully Mail sent to ${u_n}`)
    } catch (error) {
        return (`Error in registerevent: ${error}`)
    }
}

const sendEmail = async (u_e, u_n, e_n, e_d, e_i, e_l) => {
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
            to: u_e,
            subject: `Registration Confirmation for ${e_n}`,
            html: `
                 <div
        style="font-family: Arial, sans-serif; color: #333; padding: 25px; border: 2px solid #ddd; border-radius: 12px; max-width: 700px; margin: auto; background-color: #f9f9f9;">
        <h1 style="color: #007BFF; text-align: center;">🎉 Registration Confirmation 🎉</h1>
        <h3 style="color: #444;">Dear <strong>${u_n}</strong>,</h3>
        <h4>We are pleased to inform you that your registration for the upcoming event has been successfully confirmed.
            We appreciate your interest and look forward to your participation.</h4>
        <h2 style="color: #28A745; text-align: center;">${e_n}</h2>
        <h4 style="color: #222;"><strong>📅 Event Date:</strong> ${e_d}
        </h4>
        <h4 style="color: #222;"><strong>📍 Event Location:</strong> ${e_l}
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
        return (`Event registered successfully Mail sent to ${u_n}`)
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
    registerevent
}