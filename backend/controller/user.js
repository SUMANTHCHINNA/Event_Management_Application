const { checkUserInDb, createUser, createToken, checkPassword, storeIp, sendOtp } = require('../model/index')
const isValid = (...fields) => {
    return fields.every(field => field === null || field?.trim())
}
let otps = {}

const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body
        if (!isValid(username, email, password)) {
            return res.status(400).json({ status: false, message: "Fill all fields" })
        }
        const userExixts = await checkUserInDb(email)
        if (userExixts) {
            return res.status(400).json({ status: false, message: `User already exists, Please login` })
        }
        const user = await createUser({ username, email, password, role });
        const token = await createToken(user._id)
        await storeIp(user._id, req.ip, req.method, req.path)
        return res.status(201).json({ status: true, message: "User Registered Successfully", token })
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!isValid(email, password)) {
            return res.status(400).json({ status: false, message: "Fill all fields" })
        }
        const user = await checkUserInDb(email)
        if (!user) {
            return res.status(400).json({ status: false, message: `User not registered, Please register` })
        }
        if (!(await checkPassword(password, user.password))) {
            return res.status(400).json({ status: false, message: `Incorrect Password` })
        }
        const token = await createToken(user._id)
        await storeIp(user._id, req.ip, req.method, req.path)
        return res.status(200).json({ status: true, message: "Login Successful", token })
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body
        if (!email || email.trim().length === 0) {
            res.status(400).json({ status: false, message: `Please enter email ID` })
        }
        const user = await checkUserInDb(email)
        if (user) {
            if (otps[email] && otps[email] === otp) {
                const token = await createToken(user._id)
                await storeIp(user._id, req.ip, req.method, req.path)
                return res.status(200).json({ status: true, message: "Login Successful", token })
            }
            else {
                return res.status(401).json({ status: false, message: "Invalid OTP" })
            }
        }
        else {
            return res.status(401).json({ status: false, message: `User not found please register` })
        }
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}

const generateOTP = async (req, res) => {
    try {
        const { email } = req.body
        if (!email && email.trim().length === 0) {
            res.status(400).json({ status: false, message: `Please enter email ID` })
        }
        const user = await checkUserInDb(email)
        if (user) {
            let otpValue = Math.floor(Math.random() * 9000) + 1000
            otps[email] = otpValue
            await sendOtp(otps[email], email, user.username)
            setTimeout(() => {
                delete otps[email]
                console.log(`OTP for ${email} has been reset.`)
            }, 300000)
            return res.status(201).json({ status: true, message: sendOtp })
        }
        else {
            return res.status(401).json({ status: false, message: `User not found please register` })
        }
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}

module.exports = {
    register,
    login,
    verifyOTP,
    generateOTP
}