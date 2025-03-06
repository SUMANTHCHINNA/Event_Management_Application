const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const auth = require("../middleware/auth")
const { getAllEvents, getEventById, registerEvent, getEventImage, userSuggest, updateProfile, adminAnalytics, getPermissions, getAllSuggest, acceptSuggest, rejectSuggest, getOneSuggest, blockUser, getAllUsers, getMySuggestions, getPastEvents, getFutureEvents, getRangeEvents, getTodayEvent, getAcceptedSuggestions, getRejectedSuggestions, getUserDetails, deleteEvent, getEventRegisterDetails } = require('../controller/event')

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

router.delete('/event/:id', deleteEvent)
router.get('/event/all', getAllEvents)
router.get('/event/solo/:id', getEventById)
router.post('/event/register/:id', registerEvent)
router.post('/event/suggest', upload.single('imagePath'), userSuggest)
router.get('/event/suggest/all', getAllSuggest)
router.get('/event/suggest/one/:id', getOneSuggest)
router.get('/event/suggest/accept/:id', acceptSuggest)
router.get('/event/suggest/reject/:id', rejectSuggest)
router.get('/event/mySuggestions', getMySuggestions)
router.get('/event/mySuggestions/accepted', getAcceptedSuggestions)
router.get('/event/mySuggestions/rejected', getRejectedSuggestions)
router.patch('/user/updateProfile', updateProfile)
router.get('/admin/analytics', adminAnalytics)
router.get('/role', getPermissions)
router.post('/user/block/:id', blockUser)
router.get('/users', getAllUsers)
router.get('/event/pastEvents', getPastEvents)
router.get('/event/futureEvents', getFutureEvents)
router.get('/event/range', getRangeEvents)
router.get('/event/today', getTodayEvent)
router.get('/user/details', getUserDetails)
router.get('/event/registers/:id', getEventRegisterDetails)

module.exports = router
