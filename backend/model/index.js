const user = require('./user.js')
const Ip = require('./ip.js')
const event = require('./event.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const cron = require("node-cron")
const dotenv = require('dotenv')
const suggest = require('../model/suggest.js')
const register = require('../model/registerStatus.js')
const { sendEmail } = require('../utils/mailServices.js')
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
        let hashedPassword = await bcrypt.hash(password, 10)
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

const createEvent = async ({ name, description, date, location, attendees, imagePath, type }) => {
    try {
        const newEvent = { name: name, description: description, date: date, location: location, attendees: attendees, imagePath: imagePath, type: type }
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
        const fetch = await event.findById({ _id: event_id }).lean()
        const count = await register.countDocuments({
            event: new mongoose.Types.ObjectId(event_id),
            status: "registered"
        })
        return { ...fetch, count }
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

const registerevent = async (event_id, username, email, userId) => {
    try {
        const details = await event.findById(event_id)
        if (!details) throw new Error("Event not found")
        const { name, date, location } = details
        let regidteredSubject = `Registration Confirmation for ${name}`
        let registeredContent = {
            html: `
            <div
                style="font-family: Arial, sans-serif; color: #333; padding: 25px; border: 2px solid #ddd; border-radius: 12px; max-width: 700px; margin: auto; background-color: #f9f9f9;">
                <h1 style="color: #007BFF; text-align: center;">Registration Confirmation</h1>
                <h3 style="color: #444;">Dear <strong>${username}</strong>,</h3>
                <p>We are pleased to confirm your registration for the upcoming event. Thank you for your interest, and we look forward to your participation.</p>
                <h2 style="color: #28A745; text-align: center;">${name}</h2>
                <p style="color: #222;"><strong>Event Date:</strong> ${date}</p>
                <p style="color: #222;"><strong>Event Location:</strong> ${location}</p>
                <p>This event is designed to provide an enriching experience, offering valuable insights, networking opportunities, and knowledge sharing from industry experts. We encourage you to take full advantage of this opportunity.</p>
                <h4 style="text-align: center; color: #007BFF;">We look forward to welcoming you at the event!</h4>
                <p style="text-align: center; color: #777;">If you have any questions, please do not hesitate to reach out to our support team at <a href="mailto:chinnasumanth123@gmail.com">chinnasumanth123@gmail.com</a>.</p>
                <p style="text-align: center; color: #777;">Thank you for your registration!</p>
            </div>
        `
        }
        let unRegidteredSubject = `Unregistration Confirmation for ${name}`
        let unRegisteredContent = {
            html: `
            <div
                style="font-family: Arial, sans-serif; color: #333; padding: 25px; border: 2px solid #ddd; border-radius: 12px; max-width: 700px; margin: auto; background-color: #f9f9f9;">
                <h1 style="color: #DC3545; text-align: center;">Unregistration Confirmation</h1>
                <h3 style="color: #444;">Dear <strong>${username}</strong>,</h3>
                <p>We regret to inform you that your registration for the event has been successfully <strong>canceled</strong>.</p>
                <h2 style="color: #DC3545; text-align: center;">${name}</h2>
                <p style="color: #222;"><strong>Event Date:</strong> ${date}</p>
                <p style="color: #222;"><strong>Event Location:</strong> ${location}</p>
                <p>If this cancellation was made in error or if you wish to re-register, please contact us at your earliest convenience.</p>
                <h4 style="text-align: center; color: #007BFF;">We hope to see you at a future event!</h4>
                <p style="text-align: center; color: #777;">For any inquiries, please reach out to our support team at <a href="mailto:chinnasumanth123@gmail.com">chinnasumanth123@gmail.com</a>.</p>
                <p style="text-align: center; color: #777;">Thank you for your understanding.</p>
            </div>
        `
        }
        const eventObjectId = new mongoose.Types.ObjectId(event_id)
        const userObjectId = new mongoose.Types.ObjectId(userId)
        let status = await register.findOne({
            event: eventObjectId,
            user: userObjectId,
        })
        if (status) {
            if (status.status === "registered") {
                await register.updateOne(
                    { event: eventObjectId, user: userObjectId },
                    { $set: { status: "unregistered" } })
                await sendEmail(email, unRegidteredSubject, unRegisteredContent.html)
                return `Event Un-Registered successfully. Mail sent to ${username}`
            }
            else {
                await register.updateOne(
                    { event: eventObjectId, user: userObjectId },
                    { $set: { status: "registered" } })
                await sendEmail(email, regidteredSubject, registeredContent.html)
                return `Event registered successfully. Mail sent to ${username}`
            }
        }
        else {
            await register.create({
                event: eventObjectId,
                user: userObjectId,
                status: "registered"
            })
            await sendEmail(email, regidteredSubject, registeredContent.html)
            return `Event registered successfully. Mail sent to ${username}`
        }
    } catch (error) {
        return `Error in registerevent: ${error.message}`
    }
}

const newSuggest = async (userId, data, username) => {
    try {
        await suggest.create({ user: userId, data: data, username: username })
        return `Suggestion sent successfully`
    } catch (error) {
        return `Error in newSuggest: ${error.message}`
    }
}

const sendOtp = async (otp, email, username) => {
    try {
        let otpSubject = `Your OTP for Verification`;
        let otpContent = {
            html: `
            <div
                style="font-family: Arial, sans-serif; color: #333; padding: 25px; border: 2px solid #ddd; border-radius: 12px; max-width: 700px; margin: auto; background-color: #f9f9f9;">
                <h1 style="color: #007BFF; text-align: center;">OTP Verification</h1>
                <h3 style="color: #444;">Dear <strong>${username}</strong>,</h3>
                <p>Thank you for your request. Your One-Time Password (OTP) for verification is:</p>
                <h2 style="color: #28A745; text-align: center;">${otp}</h2>
                <p style="color: #222;">Please enter this OTP in the application to complete your verification process.</p>
                <p style="color: #222;">This OTP is valid for <strong>5 minutes</strong>. Please do not share it with anyone.</p>
                <h4 style="text-align: center; color: #007BFF;">Important: Change Your Password</h4>
                <p style="color: #222;">After logging into the system, we recommend that you change your password to ensure the security of your account.</p>
                <p style="color: #222;">To change your password, navigate to the account settings section after logging in.</p>
                <h4 style="text-align: center; color: #007BFF;">Thank you for using our service!</h4>
                <p style="text-align: center; color: #777;">If you did not request this OTP, please ignore this email.</p>
                <p style="text-align: center; color: #777;">For any questions, feel free to reach out to our support team at <a href="mailto:chinnasumanth123@gmail.com">chinnasumanth123@gmail.com</a>.</p>
            </div>
        `
        }
        await sendEmail(email, otpSubject, otpContent.html)
        return `OTP sent successfully to user ${email}`
    } catch (error) {
        return `Error in sendOtp: ${error.message}`
    }
}

const updateDetails = async ({ username, email, password, userId }) => {
    try {
        let hashedPassword = await bcrypt.hash(password, 10)
        const updatedData = { username, email, password: hashedPassword }
        await user.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(userId) }, { $set: updatedData })
        return `Profile updated Successfully`
    } catch (error) {
        return `Error in updateDetails: ${error.message}`
    }
}

const adminMetrics = async () => {
    try {
        const usersCount = await user.countDocuments()
        const eventsCount = await event.countDocuments()
        const getallSuggest = await suggest.find()
        const registered = await register.countDocuments({ status: "registered" })
        const unregistered = await register.countDocuments({ status: "unregistered" })
        let overallRate = (registered - unregistered) / ((usersCount - 1))
        let averageRatePerEvent = (registered - unregistered) / eventsCount
        let final = {
            users_Count: usersCount - 1,
            event_Count: eventsCount,
            AllSuggestions: getallSuggest,
            overAllRate: overallRate.toFixed(2),
            averageRatePerEvent: averageRatePerEvent.toFixed(2)
        }
        return final
    } catch (error) {
        return `Error in adminMetrics: ${error.message}`
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
    newSuggest,
    sendOtp,
    updateDetails,
    adminMetrics

}