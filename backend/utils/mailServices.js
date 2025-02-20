const nodemailer = require('nodemailer')

const sendEmail = async (email, subject, content) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        })
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: subject,
            html: content
        }
        await transporter.sendMail(mailOptions)
        return (`Mail sent successfully`)
    } catch (error) {
        return (`Error in sendEmail ${error}`)
    }
}

module.exports = {
    sendEmail
}