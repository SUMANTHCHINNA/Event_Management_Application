const { geteventsByUserId, getEvent, registerevent, storeIp, newSuggest, updateDetails, adminMetrics, getUserRoleByToken, getSuggests, acceptEventAdd, rejectEventRemove, userBlock, getUsers, getUserById, getAllMySuggestions, fetchPastEvents, fetchFutureEvents, fetchRangeEvents, fetchTodayEvents, fetchAcceptedSuggestions, fetchRejectedSuggestions, fetchUserDetails, DeleteEventById, fetchAllUSersOfEvents } = require('../model/index')
const fs = require('fs')
const path = require('path')

const getAllEvents = async (req, res) => {
    try {
        let userId = req.user.userId
        let { ip, method, path } = req
        storeIp(userId, ip, method, path)
        const events = await geteventsByUserId() || []
        res.status(200).json({ status: true, message: events })
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

const getEventById = async (req, res) => {
    try {
        let userId = req.user.userId
        let { ip, method, path } = req
        storeIp(userId, ip, method, path)
        const event_id = req.params.id
        const s = await getEvent(event_id)
        res.status(201).json({ status: true, message: s })
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

const registerEvent = async (req, res) => {
    try {
        let userId = req.user.userId
        let { ip, method, path } = req
        storeIp(userId, ip, method, path)
        const event_id = req.params.id
        const name = req.user.username
        const email = req.user.email
        const registered = await registerevent(event_id, name, email, userId)
        res.status(201).json({ status: true, message: registered })
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

const getEventImage = async (req, res) => {
    try {
        let userId = req.user.userId
        let { ip, method, path } = req
        storeIp(userId, ip, method, path)
        const i = req.params.id
        res.sendFile(path.join(__dirname, '../images', i))
    }
    catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

const userSuggest = async (req, res) => {
    try {
        const { name, description, date, location, attendees, type } = req.body
        const user = req.user.userId
        let { ip, method, path } = req
        storeIp(user, ip, method, path)
        const imagePath = req.file ? `/images/${req.file.filename}` : null
        if (!name || !description || !date || !attendees || name.trim().length == 0 || description.trim().length == 0) {
            if (req.file) fs.unlinkSync(req.file.path)
            return res.status(400).json({ status: false, message: `please fill all fields` })
        }
        const addSuggestion = await newSuggest({ user, name, description, date, location, attendees, type, imagePath })
        res.status(201).json({ status: true, message: addSuggestion })
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

const updateProfile = async (req, res) => {
    try {
        const { username, email, password } = req.body
        let userId = req.user.userId
        let { ip, method, path } = req
        storeIp(userId, ip, method, path)
        const update = await updateDetails({ username, email, password, userId })
        res.status(201).json({ status: true, message: update })
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

const adminAnalytics = async (req, res) => {
    try {
        let userId = req.user.userId
        let { ip, method, path } = req
        storeIp(userId, ip, method, path)
        const data = await adminMetrics()
        res.status(201).json({ status: true, message: data })
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

const getPermissions = async (req, res) => {
    try {
        let userId = req.user.userId
        let { ip, method, path } = req
        storeIp(userId, ip, method, path)
        const token = req.headers.authorization.split(' ')[1]
        const userRole = await getUserRoleByToken(token)
        res.status(201).json({ status: true, message: userRole })
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

const getAllSuggest = async (req, res) => {
    try {
        let userId = req.user.userId
        let { ip, method, path } = req
        storeIp(userId, ip, method, path)
        const allSuggests = await getSuggests()
        res.status(201).json({ status: true, message: allSuggests })
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

const acceptSuggest = async (req, res) => {
    try {
        let userId = req.user.userId
        let { ip, method, path } = req
        storeIp(userId, ip, method, path)
        const id = req.params.id
        const oneSuggest = await getEvent(id)
        const acceptEvent = await acceptEventAdd(oneSuggest)
        res.status(201).json({ status: true, message: acceptEvent })
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

const rejectSuggest = async (req, res) => {
    try {
        let userId = req.user.userId
        let { ip, method, path } = req
        storeIp(userId, ip, method, path)
        const id = req.params.id
        const oneSuggest = await getEvent(id)
        const rejectEvent = await rejectEventRemove(oneSuggest)
        res.status(201).json({ status: true, message: rejectEvent })
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

const getOneSuggest = async (req, res) => {
    try {
        let userId = req.user.userId
        let { ip, method, path } = req
        storeIp(userId, ip, method, path)
        const id = req.params.id
        const suggest_event = await getEvent(id)
        res.status(201).json({ status: true, message: suggest_event })
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

const blockUser = async (req, res) => {
    try {
        let userId = req.user.userId
        let { ip, method, path } = req
        storeIp(userId, ip, method, path)
        const id = req.params.id
        const userDetails = await getUserById(id)
        const username = userDetails.username
        const mail = userDetails.email
        const block = await userBlock(id, username, mail)
        res.status(201).json({ status: true, message: block })
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

const getAllUsers = async (req, res) => {
    try {
        let userId = req.user.userId
        let { ip, method, path } = req
        storeIp(userId, ip, method, path)
        const getUser = await getUsers()
        res.status(201).json({ status: true, message: getUser })
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

const getMySuggestions = async (req, res) => {
    try {
        let userId = req.user.userId
        let { ip, method, path } = req
        storeIp(userId, ip, method, path)
        const getMySuggest = await getAllMySuggestions(userId)
        res.status(201).json({ status: true, message: getMySuggest })
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

const getPastEvents = async (req, res) => {
    try {
        let userId = req.user.userId
        let { ip, method, path } = req
        storeIp(userId, ip, method, path)
        const pastEvents = await fetchPastEvents()
        res.status(201).json({ status: true, message: pastEvents })
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

const getFutureEvents = async (req, res) => {
    try {
        let userId = req.user.userId
        let { ip, method, path } = req
        storeIp(userId, ip, method, path)
        const futureEvents = await fetchFutureEvents()
        res.status(201).json({ status: true, message: futureEvents })
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

const getRangeEvents = async (req, res) => {
    try {
        let userId = req.user.userId
        let { ip, method, path } = req
        storeIp(userId, ip, method, path)
        const { startDate, endDate } = req.body
        const rangeEvents = await fetchRangeEvents(startDate, endDate)
        res.status(201).json({ status: true, message: rangeEvents })
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

const getTodayEvent = async (req, res) => {
    try {
        let userId = req.user.userId
        let { ip, method, path } = req
        storeIp(userId, ip, method, path)
        const todayEvents = await fetchTodayEvents()
        res.status(201).json({ status: true, message: todayEvents })
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

const getAcceptedSuggestions = async (req, res) => {
    try {
        let userId = req.user.userId
        let { ip, method, path } = req
        storeIp(userId, ip, method, path)
        const getAcceptedOne = await fetchAcceptedSuggestions(userId)
        res.status(201).json({ status: true, message: getAcceptedOne })
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

const getRejectedSuggestions = async (req, res) => {
    try {
        let userId = req.user.userId
        let { ip, method, path } = req
        storeIp(userId, ip, method, path)
        const getRejectedOne = await fetchRejectedSuggestions(userId)
        res.status(201).json({ status: true, message: getRejectedOne })
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

const getUserDetails = async (req, res) => {
    try {
        let userId = req.user.userId
        let { ip, method, path } = req
        storeIp(userId, ip, method, path)
        const userDetails = await fetchUserDetails(userId)
        res.status(201).json({ status: true, message: userDetails })
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

const deleteEvent = async (req, res) => {
    try {
        let userId = req.user.userId
        let { ip, method, path } = req
        storeIp(userId, ip, method, path)
        const id = req.params.id
        const removeEvent = await DeleteEventById(id)
        res.status(201).json({ status: true, message: removeEvent })
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

const getEventRegisterDetails = async (req, res) => {
    try {
        const event_id = req.params.id
        const getAllUsersOfEvents = await fetchAllUSersOfEvents(event_id)
        res.status(201).json({ status: true, message: getAllUsersOfEvents })
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

module.exports = {
    getAllEvents,
    getEventById,
    registerEvent,
    getEventImage,
    userSuggest,
    updateProfile,
    adminAnalytics,
    getPermissions,
    getAllSuggest,
    acceptSuggest,
    rejectSuggest,
    getOneSuggest,
    blockUser,
    getAllUsers,
    getMySuggestions,
    getPastEvents,
    getFutureEvents,
    getRangeEvents,
    getTodayEvent,
    getAcceptedSuggestions,
    getRejectedSuggestions,
    getUserDetails,
    deleteEvent,
    getEventRegisterDetails
}