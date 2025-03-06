const acceptEventMessage = (founderName, name, description, date, type, location, attendees) => {
    try {
        let subject = `Confirmation: Your Event Has Been Successfully Added`
        let content = {
            html: `
            <div>
                <h3>Dear ${founderName},</h3>
                <p>We are pleased to inform you that your event has been successfully added to our platform. Thank you for your valuable contribution.</p>
                <h2>Event Details:</h2>
                <ul>
                    <li><strong>Event Name:</strong> ${name}</li>
                    <li><strong>Description:</strong> ${description}</li>
                    <li><strong>Date:</strong> ${new Date(date).toLocaleString()}</li>
                    <li><strong>Event Type:</strong> ${type}</li>
                    <li><strong>Location:</strong> ${location}</li>
                    <li><strong>Expected Attendees:</strong> ${attendees}</li>
                </ul>
                    <p>We appreciate your initiative in organizing this event and look forward to its success. If you require any assistance or modifications, please do not hesitate to reach out.</p>
                    <h4>Best Regards,</h4>
                    <p>Support Team</p>
                    <p>For any inquiries, please contact us at
                    <a href="mailto:chinnasumanth123@gmail.com">chinnasumanth123@gmail.com</a>.
                    </p>
                </div>
                `
        }
        let mail = { subject: subject, content: content }
        return mail
    } catch (error) {
        console.error(`Error in acceptEventMessage :${error}`)
    }
}

const rejectEventMessage = async (founderName, name, description, date, type, location, attendees) => {
    try {
        let subject = `Update: Your Event Submission Has Been Rejected`
        let content = {
            html: `
                <div>
                    <h3>Dear ${founderName},</h3>
                    <p>We regret to inform you that your event submission has been reviewed and was not approved for listing on our platform.</p>
                    <h2>Event Details:</h2>
                    <ul>
                        <li><strong>Event Name:</strong> ${name}</li>
                        <li><strong>Description:</strong> ${description}</li>
                        <li><strong>Date:</strong> ${new Date(date).toLocaleString()}</li>
                        <li><strong>Event Type:</strong> ${type}</li>
                        <li><strong>Location:</strong> ${location}</li>
                        <li><strong>Expected Attendees:</strong> ${attendees}</li>
                    </ul>
                    <h4>Reason for Rejection:</h4>
                    <p>Unfortunately, your event does not meet our platform guidelines or contains incomplete details. We apologize for any inconvenience this may cause.</p>
                    <p>If you believe this was an error or would like to make modifications and resubmit your event, please contact our support team.</p>
                    <h4>Best Regards,</h4>
                    <p>Support Team</p>
                    <p>For any inquiries, please reach out to us at
                    <a href="mailto:chinnasumanth123@gmail.com">chinnasumanth123@gmail.com</a>.
                    </p>
                </div>
            `
        }
        let mail = { subject: subject, content: content }
        return mail
    } catch (error) {
        console.error(`Error in rejectEventMessage :${error}`)
    }
}

const registerEventMessage = async (name, username, date, location) => {
    try {
        let subject = `Registration Confirmation for ${name}`
        let content = {
            html: `
            <div>
                <h1>Registration Confirmation</h1>
                <h3>Dear <strong>${username}</strong>,</h3>
                <p>We are pleased to confirm your registration for the upcoming event. Thank you for your interest, and we look forward to your participation.</p>
                <h2>${name}</h2>
                <p><strong>Event Date:</strong> ${date}</p>
                <p><strong>Event Location:</strong> ${location}</p>
                <p>This event is designed to provide an enriching experience, offering valuable insights, networking opportunities, and knowledge sharing from industry experts. We encourage you to take full advantage of this opportunity.</p>
                <h4>We look forward to welcoming you at the event!</h4>
                <p>If you have any questions, please reach out to our support team at <a href="mailto:chinnasumanth123@gmail.com">chinnasumanth123@gmail.com</a>.</p>
                <p>Thank you for your registration!</p>
            </div>
        `
        }
        let mail = { subject: subject, content: content }
        return mail
    } catch (error) {
        console.error(`Error in registerEventMessage :${error}`)
    }
}

const unregisterEventMessage = async (name, username, date, location) => {
    try {
        let subject = `Unregistration Confirmation for ${name}`
        let content = {
            html: `
            <div>
                <h1>Unregistration Confirmation</h1>
                <h3>Dear <strong>${username}</strong>,</h3>
                <p>We regret to inform you that your registration for the event has been successfully <strong>canceled</strong>.</p>
                <h2>${name}</h2>
                <p><strong>Event Date:</strong> ${date}</p>
                <p><strong>Event Location:</strong> ${location}</p>
                <p>If this cancellation was made in error or if you wish to re-register, please contact us at your earliest convenience.</p>
                <h4>We hope to see you at a future event!</h4>
                <p>For any inquiries, please reach out to our support team at <a href="mailto:chinnasumanth123@gmail.com">chinnasumanth123@gmail.com</a>.</p>
                <p>Thank you for your understanding.</p>
            </div>
        `
        }
        let mail = { subject: subject, content: content }
        return mail
    } catch (error) {
        console.error(`Error in unregisterEventMessage :${error}`)

    }
}

const otpMessage = async (username, otp) => {
    try {
        let subject = `Your OTP for Verification`;
        let content = {
            html: `
            <div>
                <h1>OTP Verification</h1>
                <h3>Dear <strong>${username}</strong>,</h3>
                <p>Thank you for your request. Your One-Time Password (OTP) for verification is:</p>
                <h2><b>${otp}</b></h2>
                <p>Please enter this OTP in the application to complete your verification process.</p>
                <p>This OTP is valid for <strong>5 minutes</strong>. Please do not share it with anyone.</p>
                <h4>Important: Change Your Password</h4>
                <p>After logging into the system, we recommend that you change your password to ensure the security of your account.</p>
                <p>To change your password, navigate to the account settings section after logging in.</p>
                <h4>Thank you for using our service!</h4>
                <p>If you did not request this OTP, please ignore this email.</p>
                <p>For any questions, feel free to reach out to our support team at <a href="mailto:chinnasumanth123@gmail.com">chinnasumanth123@gmail.com</a>.</p>
            </div>
        `
        }
        let mail = { subject: subject, content: content }
        return mail

    } catch (error) {
        console.error(`Error in otpMessage :${error}`)
    }
}

const userBlockMessage = async (username) => {
    try {
        let subject = `Account Blocked: Important Notification`
        let content = {
            html: `
                <div>
                    <h1>Account Blocked</h1>
                    <h3>Dear <strong>${username}</strong>,</h3>
                    <p>We regret to inform you that your account has been permanently blocked by the admin due to a violation of our platform policies.</p>

                    <h2>Account Details:</h2>
                    <ul>
                        <li><strong>Username:</strong> ${username}</li>
                        <li><strong>Account Status:</strong> Blocked</li>
                        <li><strong>Reason:</strong> "Violation of Terms and Conditions"</li>
                    </ul>

                    <p>As a result, you will no longer be able to access or use our platform.</p>

                    <h4>Important Notice:</h4>
                    <p>This decision is final, and your access cannot be restored.</p>

                    <h4>For Further Inquiries:</h4>
                    <p>If you have any questions, you can contact our support team at <a href="mailto:chinnasumanth123@gmail.com">chinnasumanth123@gmail.com</a>.</p>

                    <h4>Best Regards,</h4>
                    <p>Support Team</p>
                </div>
            `
        }
        let mail = { subject: subject, content: content }
        return mail
    } catch (error) {
        console.error(`Error in userBlockMessage :${error}`)
    }
}

module.exports = {
    acceptEventMessage,
    rejectEventMessage,
    registerEventMessage,
    unregisterEventMessage,
    otpMessage,
    userBlockMessage

}