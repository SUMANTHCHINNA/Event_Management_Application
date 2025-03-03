const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const auth = require("../middleware/auth")
const { addEvent, deleteEvent, updateEvent, getAllEvents, getEventById, registerEvent, getEventImage, userSuggest, updateProfile, adminAnalytics, getPermissions } = require('../controller/event')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage })

router.get('/event/images/:id', getEventImage)

router.use(auth)

router.post('/event/add', upload.single('imagePath'), addEvent)
router.delete('/event/delete/:id', deleteEvent)
router.patch('/event/update/:id', upload.single('imagePath'), updateEvent)
router.get('/event/all', getAllEvents)
router.get('/event/solo/:id', getEventById)
router.post('/event/register/:id', registerEvent)
router.post('/event/suggest', upload.single('imagePath'), userSuggest)
router.patch('/user/updateProfile', updateProfile)
router.get('/admin/analytics', adminAnalytics)
router.get('/role', getPermissions)

module.exports = router
