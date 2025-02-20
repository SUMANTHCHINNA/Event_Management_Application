// let otps = {}

// const generateOTP = (email) => {
//     let otpValue = Math.floor(Math.random() * 9000) + 1000
//     otps[email] = otpValue
//     console.log(`Generated OTP for ${email}: ${otpValue}`)

//     setTimeout(() => {
//         delete otps[email]
//         console.log(`OTP for ${email} has been reset.`)
//     }, 60000);
// }

// generateOTP("sumanth@gmail.com")
// generateOTP("john.doe@example.com")
// generateOTP("alice@example.com")

// console.log("Current OTPs:", otps)



















let otps = {}
const generateOTP = (email) => {
    let otpValue = Math.floor(Math.random() * 9000) + 1000
    otps[email] = otpValue
    console.log(`Generated OTP for ${email}: ${otpValue}`)
    setTimeout(() => {
        delete otps[email]
        console.log(`OTP for ${email} has been reset.`)
    }, 60000);
}

generateOTP("sumanth@gmail.com")
generateOTP("john.doe@example.com")
generateOTP("alice@example.com")

console.log("Current OTPs:", otps)
generateOTP("bob@example.com")