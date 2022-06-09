import mailgun from 'mailgun-js'
import mail_templates from './templates'

const mailgunTransport = mailgun({
    apiKey: 'a85e79f7eee62cf8c1051bce67719fae-27a562f9-dbfe26f6',   
    domain: 'sandbox92a97454208b485baedb50cbb8088c4c.mailgun.org',
})

const sendVerifyMail = async (userName:string, mail:string, token: string) => {

    const url = process.env.MAIL_VERIFY_URL || ''
    
    const data = {
        from: `Aware shop ${'<'+process.env.MAIL_HOST_ADDRESS}>`,
        to: mail,
        subject: 'Verify your email',
        html: mail_templates.verify(userName, url + token)
    }

    return new Promise ((resolve, reject) => {
        mailgunTransport.messages().send(data, function (err:any, body:any) {
            if(err)
                return reject(err)
            else 
                return resolve('success')
        })
    })
}

const sendResetPasswordMail = async (mail:string, newPassword:string) => {
    const data = {
        from: `Aware shop ${'<'+process.env.MAIL_HOST_ADDRESS}>`,
        to: mail,
        subject: 'Reset your password',
        html: mail_templates.resetPassword(newPassword)
    }

    return new Promise ((resolve, reject) => {
        mailgunTransport.messages().send(data, function (err:any, body:any) {
            if(err)
                return reject(err)
            else 
                return resolve('success')
        })
    })
}

const mailServices = {
    sendVerifyMail: sendVerifyMail,
    sendResetPasswordMail: sendResetPasswordMail
}

export default mailServices

