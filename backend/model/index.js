const userModal = require('./user.js')
const IpModal = require('./ip.js')
const eventModal = require('./event.js')
const registerModal = require('../model/registerStatus.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const cron = require("node-cron")
const dotenv = require('dotenv')
const { sendEmail } = require('../utils/mailServices.js')
const roles = require('../roles.json')
const { acceptEventMessage, rejectEventMessage, unregisterEventMessage, registerEventMessage, otpMessage, userBlockMessage } = require('../utils/message.js')
dotenv.config()

cron.schedule("55 11 * * *", async () => {
    try {
        await IpModal.deleteMany({});
        console.log("All IP addresses cleared.")
    } catch (error) {
        console.error("Error clearing IP addresses:", error)
    }
}, {
    timezone: "Asia/Kolkata"
})

const checkUserInDb = async (email) => {
    try {
        const check = await userModal.findOne({ email: email, status: "active" })
        return check
    } catch (error) {
        return (`Error in checkUserInDb ${error}`)
    }
}

const createUser = async ({ username, email, occupation, password, role }) => {
    try {
        let hashedPassword = await bcrypt.hash(password, 10)
        const newUser = { username, email, occupation, password: hashedPassword, role }
        const userCreated = await userModal.create(newUser)
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
        const userdetails = await userModal.findOne({ _id: new mongoose.Types.ObjectId(userId) })
        return userdetails
    } catch (error) {
        return (`Error in getUserById ${error}`)
    }
}

const geteventsByUserId = async () => {
    try {
        const events = await eventModal.find({ status: "accepted", isDeleted: false })
        return events
    } catch (error) {
        return (`Error in geteventsByUserId ${error}`)
    }
}

const getEvent = async (event_id) => {
    try {
        const fetch = await eventModal.findById({ _id: event_id }).lean()
        const count = await registerModal.countDocuments({
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
        await IpModal.create(newIp)
        return (`Ip stored successfully`)
    } catch (error) {
        return (`Error in storeIp ${error}`)
    }
}

const registerevent = async (event_id, username, email, userId) => {
    try {
        const details = await eventModal.findById(event_id)
        if (!details) throw new Error("Event not found")
        const { name, date, location, Registations, seatsLeft } = details
        const registerMailContent = await registerEventMessage(name, username, date, location)
        const unregisterMainContent = await unregisterEventMessage(name, username, date, location)
        const eventObjectId = new mongoose.Types.ObjectId(event_id)
        const userObjectId = new mongoose.Types.ObjectId(userId)

        if (seatsLeft != 0) {
            let status = await registerModal.findOne({
                event: eventObjectId,
                user: userObjectId,
            })
            if (status) {
                if (status.status === "registered") {
                    await registerModal.updateOne(
                        { event: eventObjectId, user: userObjectId },
                        { $set: { status: "unregistered" } })
                    await eventModal.findByIdAndUpdate(eventObjectId, { $set: { Registations: Registations - 1, seatsLeft: seatsLeft + 1 } })
                    sendEmail(email, unregisterMainContent.subject, unregisterMainContent.content.html)
                    return `Event Un-Registered successfully. Mail sent to ${username}`
                }
                else {
                    await registerModal.updateOne(
                        { event: eventObjectId, user: userObjectId },
                        { $set: { status: "registered" } })
                    await eventModal.findByIdAndUpdate(eventObjectId, { $set: { Registations: Registations + 1, seatsLeft: seatsLeft - 1 } })
                    sendEmail(email, registerMailContent.subject, registerMailContent.content.html)
                    return `Event registered successfully. Mail sent to ${username}`
                }
            }
            else {
                await registerModal.create({
                    event: eventObjectId,
                    user: userObjectId,
                    status: "registered"
                })
                await eventModal.findByIdAndUpdate(eventObjectId, { $set: { Registations: Registations + 1, seatsLeft: seatsLeft - 1 } })
                sendEmail(email, registerMailContent.subject, registerMailContent.content.html)
                return `Event registered successfully. Mail sent to ${username}`
            }
        }
        else {
            return `Registations are closed`
        }

    } catch (error) {
        return `Error in registerevent: ${error.message}`
    }
}

const newSuggest = async ({ user, name, description, date, location, attendees, type, imagePath }) => {
    try {
        const new_suggest = { user: new mongoose.Types.ObjectId(user), name, description, date, location, attendees, type, imagePath, seatsLeft: attendees }
        await eventModal.create(new_suggest)
        return `Suggest Sended Successfully`
    } catch (error) {
        return `Error in newSuggest: ${error.message}`
    }
}

const sendOtp = async (otp, email, username) => {
    try {
        const otpMailContent = await otpMessage(username, otp)
        sendEmail(email, otpMailContent.subject, otpMailContent.content.html)
        return `OTP sent successfully to user ${email}`
    } catch (error) {
        return `Error in sendOtp: ${error.message}`
    }
}

const updateDetails = async ({ username, email, password, userId }) => {
    try {
        let hashedPassword = await bcrypt.hash(password, 10)
        const updatedData = { username, email, password: hashedPassword }
        await userModal.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(userId) }, { $set: updatedData })
        return `Profile updated Successfully`
    } catch (error) {
        return `Error in updateDetails: ${error.message}`
    }
}


const adminMetrics = async () => {
    try {
        const [usersCount, eventsData, registrations] = await Promise.all([
            userModal.countDocuments(),
            eventModal.aggregate([
                {
                    $match: { isDeleted: false }
                },
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                }
            ]),
            registerModal.aggregate([
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                }
            ])
        ])
        let eventsCount = 0, pendingSuggestionsCount = 0
        eventsData.forEach(event => {
            if (event._id === "accepted") eventsCount = event.count
            if (event._id === "pending") pendingSuggestionsCount = event.count
        })
        let registered = 0, unregistered = 0;
        registrations.forEach(reg => {
            if (reg._id === "registered") registered = reg.count
            if (reg._id === "unregistered") unregistered = reg.count
        })
        const getallSuggest = await eventModal.find(
            { status: "pending", isDeleted: false },
            { _id: 1, name: 1, description: 1, date: 1 }
        )
        const totalUsers = Math.max(usersCount - 1, 1)
        const totalEvents = Math.max(eventsCount, 1)
        const totalRegistered = Math.max(registered, 1)

        let overallRate = `${((registered / totalUsers) * 100).toFixed(2)}%`
        let averageRegistrationsPerEvent = (registered / totalEvents)
        let eventUnregistrationRate = `${((unregistered / totalRegistered) * 100).toFixed(2)}%`

        return {
            users_Count: totalUsers,
            event_Count: totalEvents,
            AllSuggestions: getallSuggest,
            overAllRate: overallRate,
            averageRegistrationsPerEvent,
            eventUnregistrationRate,
            pendingSuggestions: pendingSuggestionsCount
        }
    } catch (error) {
        return `Error in adminMetrics: ${error.message}`
    }
}


const getUserRoleByToken = async (token) => {
    try {
        const id = await jwt.verify(token, process.env.KEY)
        const userDetails = await userModal.findById(new mongoose.Types.ObjectId(id.userId))
        const permissions = (roles[userDetails.role])
        return permissions
    } catch (error) {
        return `Error in getUserRoleByToken: ${error.message}`
    }
}

const getSuggests = async () => {
    try {
        const showSuggest = await eventModal.find({ status: "pending" })
        return showSuggest
    } catch (error) {
        return `Error in getSuggests: ${error.message}`
    }
}

const acceptEventAdd = async (new_event) => {
    try {
        const { _id, name, description, date, type, location, attendees, imagePath, status } = new_event
        let fetchUser = await getUserById(new_event.user)
        let founderEmail = fetchUser.email
        let founderName = fetchUser.username
        await eventModal.findByIdAndUpdate(_id, { $set: { status: "accepted" } })
        const acceptMailContent = await acceptEventMessage(founderName, name, description, date, type, location, attendees)
        sendEmail(founderEmail, acceptMailContent.subject, acceptMailContent.content.html)
        return `Suggested Event Added Successfully`
    } catch (error) {
        return `Error in acceptEventAdd: ${error.message}`
    }
}

const rejectEventRemove = async (remove_event) => {
    try {
        const { _id, name, description, date, type, location, attendees, imagePath, status } = remove_event
        let fetchUser = await getUserById(remove_event.user)
        let founderEmail = fetchUser.email
        let founderName = fetchUser.username
        await eventModal.findByIdAndUpdate(_id, { $set: { status: "rejected" } })
        const rejectMailContent = await rejectEventMessage(founderName, name, description, date, type, location, attendees)
        sendEmail(founderEmail, rejectMailContent.subject, rejectMailContent.content.html)
        return `Suggested Event Rejected Successfully`
    } catch (error) {
        return `Error in rejectEventRemove: ${error.message}`
    }
}

const userBlock = async (id, username, mail) => {
    try {
        const _id = new mongoose.Types.ObjectId(id)
        await userModal.findByIdAndUpdate(_id, { $set: { status: "in-active" } })
        const UserBlockMailContent = await userBlockMessage(username)
        await sendEmail(mail, UserBlockMailContent.subject, UserBlockMailContent.content.html)
        return `User had Blocked Successfully`
    } catch (error) {
        return `Error in userBlock: ${error.message}`
    }
}

const getUsers = async () => {
    try {
        const allUsers = await userModal.find({ status: "active", role: "user" })
        return allUsers
    } catch (error) {
        return `Error in getUsers: ${error.message}`
    }
}

const checkUserInDbByMail = async (email) => {
    try {
        const userDetails = await userModal.findOne({ email })
        return userDetails
    } catch (error) {
        return `Error in checkUserInDbByMail: ${error.message}`
    }
}

const getAllMySuggestions = async (userId) => {
    try {
        const fetchMySuggestions = await eventModal.find({ user: userId })
        return fetchMySuggestions
    } catch (error) {
        return `Error in checkUserInDbByMail: ${error.message}`
    }
}

const fetchPastEvents = async () => {
    try {
        const getPastEvents = await eventModal.find({ date: { $lt: new Date() }, status: "accepted", isDeleted: false })
        return getPastEvents
    } catch (error) {
        return `Error in fetchPastEvents: ${error.message}`
    }
}

const fetchFutureEvents = async () => {
    try {
        const getPastEvents = await eventModal.find({ date: { $gt: new Date() }, status: "accepted", isDeleted: false })
        return getPastEvents
    } catch (error) {
        return `Error in fetchFutureEvents: ${error.message}`
    }
}

const fetchRangeEvents = async (startDate, endDate) => {
    try {
        const getRangeEvents = await eventModal.find({ date: { $gte: startDate, $lte: endDate }, status: "accepted", isDeleted: false })
        return getRangeEvents
    } catch (error) {
        return `Error in fetchRangeEvents: ${error.message}`
    }
}

const fetchTodayEvents = async () => {
    try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date()
        tomorrow.setHours(23, 59, 59, 999)
        const getTodayEvents = await eventModal.find({
            date: { $gte: today, $lte: tomorrow }, status: "accepted", isDeleted: false
        })
        return getTodayEvents
    } catch (error) {
        return `Error in fetchTodayEvents: ${error.message}`
    }
}

const fetchAcceptedSuggestions = async (userId) => {
    try {
        const getAcceptedSuggestions = await eventModal.find({ user: new mongoose.Types.ObjectId(userId), status: "accepted", isDeleted: false })
        return getAcceptedSuggestions
    } catch (error) {
        return `Error in fetchAcceptedSuggestions: ${error.message}`
    }
}

const fetchRejectedSuggestions = async (userId) => {
    try {
        const getRejectedSuggestions = await eventModal.find({ user: new mongoose.Types.ObjectId(userId), status: "rejected", isDeleted: false })
        return getRejectedSuggestions
    } catch (error) {
        return `Error in fetchRejectedSuggestions: ${error.message}`
    }
}

const fetchUserDetails = async (userId) => {
    try {
        const userDetails = await userModal.findById(userId)
        return userDetails
    } catch (error) {
        return `Error in fetchUserDetails: ${error.message}`
    }
}

const DeleteEventById = async (id) => {
    try {
        await eventModal.findOneAndUpdate(id, { $set: { isDeleted: true } })
        return `Event deleted Successfully`
    } catch (error) {
        return `Error in DeleteEventById: ${error.message}`
    }
}

const fetchAllUSersOfEvents = async (event_id) => {
    try {
        const eventId = new mongoose.Types.ObjectId(event_id)
        const usersOfEvent = await registerModal.aggregate([
            {
                $match: {
                    event: eventId,
                    status: "registered"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails"
            },
            {
                $project: {
                    _id: 0,
                    "userDetails.username": 1,
                    "userDetails.email": 1,
                    "userDetails.occupation": 1
                }
            }
        ])
        return usersOfEvent
    } catch (error) {
        return `Error in fetchAllUSersOfEvents: ${error.message}`
    }
}

module.exports = {
    checkUserInDb,
    createUser,
    createToken,
    checkPassword,
    getUserById,
    geteventsByUserId,
    getEvent,
    storeIp,
    registerevent,
    newSuggest,
    sendOtp,
    updateDetails,
    adminMetrics,
    getUserRoleByToken,
    getSuggests,
    acceptEventAdd,
    rejectEventRemove,
    userBlock,
    getUsers,
    checkUserInDbByMail,
    getAllMySuggestions,
    fetchPastEvents,
    fetchFutureEvents,
    fetchRangeEvents,
    fetchTodayEvents,
    fetchAcceptedSuggestions,
    fetchRejectedSuggestions,
    fetchUserDetails,
    DeleteEventById,
    fetchAllUSersOfEvents

}