const { createEvent, deleteEventById, patchEvent, geteventsByUserId, getEvent, registerevent } = require('../model/index')
const fs = require('fs')
const path = require('path')

const addEvent = async (req, res) => {
    try {
        const { name, description, date, location, attendees } = req.body
        const imagePath = req.file ? `/images/${req.file.filename}` : null
        if (!name || !description || !date || !attendees || name.trim().length == 0 || description.trim().length == 0) {
            if (req.file) fs.unlinkSync(req.file.path)
            return res.status(400).json({ status: false, message: `please fill all fields` })
        }
        const create = await createEvent({ name, description, date, location, attendees, imagePath })
        res.status(201).json({ status: true, message: create })
    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path)
        res.status(500).json({ status: false, message: error.message })
    }
}

const deleteEvent = async (req, res) => {
    try {
        const event_id = req.params.id
        const deleted = await deleteEventById(event_id)
        res.status(201).json({ status: true, message: deleted })
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

const updateEvent = async (req, res) => {
    try {
        const event_id = req.params.id
        const { name, description, date, attendees } = req.body
        const imagePath = req.file ? req.file.path : undefined
        const updated = await patchEvent({ name, description, date, attendees, event_id, imagePath })
        res.status(201).json({ status: true, message: updated })
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

const getAllEvents = async (req, res) => {
    try {
        const events = await geteventsByUserId() || []
        res.status(200).json({ status: true, message: events })
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

const getEventById = async (req, res) => {
    try {
        const event_id = req.params.id
        const s = await getEvent(event_id)
        res.status(201).json({ status: true, message: s })
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

const registerEvent = async (req, res) => {
    try {
        const event_id = req.params.id
        const name = req.user.username
        const email = req.user.email
        const registered = await registerevent(event_id, name, email)
        res.status(201).json({ status: true, message: registered })
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

const getEventImage = async (req, res) => {
    try {
        const i = req.params.id
        res.sendFile(path.join(__dirname, '../images', i))
    }
    catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

module.exports = {
    addEvent,
    deleteEvent,
    updateEvent,
    getAllEvents,
    getEventById,
    registerEvent,
    getEventImage
}