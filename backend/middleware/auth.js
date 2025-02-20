const jwt = require('jsonwebtoken')
const { getUserById } = require('../model/index')
const roles = require('../roles.json')
const dotenv = require('dotenv')
dotenv.config()

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[0] == "Bearer"
        if (token) {
            const token = req.headers.authorization.split(' ')[1]
            const id = await jwt.verify(token, process.env.KEY)
            const userId = (id.userId)
            const user = await getUserById(userId)
            if (!user) {
                res.status(401).json({ status: false, message: `Unauthorized Access` })
            }
            req.user = { username: user.username, email: user.email, userId: userId, role: user.role }
            const { method, path } = req
            const role = req.user.role
            const authorization = (roles[role][method])
            if (authorization === undefined) {
                return res.status(404).json({ status: false, message: `Unauthorized Access` })
            }
            let checkRole = false
            for (let i = 0; i < authorization.length; i++) {
                if (path.startsWith(authorization[i])) {
                    checkRole = true
                    break
                }
            }
            if (checkRole == false) {
                return res.status(403).json({ status: false, message: `Unauthorized Access` })
            }
            next()
        }
        else {
            return res.status(401).json({ status: false, message: `Unauthorized Access` })
        }
    } catch (error) {
        res.status(401).json({ status: false, message: error.message })
    }
}

module.exports = auth





// Total Events Created
// Total Registered Users