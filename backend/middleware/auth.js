const jwt = require('jsonwebtoken')
const { getUserById } = require('../model/index')
const roles = require('../roles.json')
const { storeIp } = require('../model/index')

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
            const u_id = req.user.userId
            const role = req.user.role
            const method = req.method
            const path = req.path
            const ip = req.ip
            await storeIp(u_id, ip, method, path)
            const a = (roles[role][method])
            if (a === undefined) {
                return res.status(404).json({ status: false, message: `You are not authorized. Only admins have access` })
            }
            let c = false
            for (let i = 0; i < a.length; i++) {
                if (path.startsWith(a[i])) {
                    c = true
                    break
                }
            }
            if (c == false) {
                return res.status(403).json({ status: false, message: `You are not authorized. Only admins have access` })
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