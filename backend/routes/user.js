const express = require('express')
const router = express.Router()
const { register, login, verifyOTP, generateOTP } = require('../controller/user')

router.post('/user/register', register)
router.post('/user/login', login)
router.post('/user/verifyOTP', verifyOTP)
router.post('/user/generateOTP', generateOTP)

module.exports = router
