'use strict';

import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
// import nodemailer from 'nodemailer'

export const generateJWT = (userHeader: any) => {
    return jwt.sign({
        userName: userHeader.userName,
        email: userHeader.email,
        isAdmin: userHeader.isAdmin,
        id: userHeader.id
    }, process.env.SECRET_KEY || '', { expiresIn: '30d'})
}

// export const emailTransporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.HOST_MAIL,
//         pass: process.env.MAIL_PASSWORD
//     },
//     tls: {
//         rejectUnauthorized: false
//     }
// })

// export const mailOptions = (userName, email, emailToken) => {
//     return {
//         from: `Aware shop ${'<'+process.env.HOST_MAIL}>`,
//         to: email,
//         subject: 'Verify your email',
//         html: `
//             <div style = "font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen' !important">
//                 <h2> ${userName}! Thanks for register on our site </h2>
//                 <h4> Please verify your email to continue...</h4>
//                 <div class = "awareVerifyBtn" style = "width:100px; padding: 5px 0px; color: white; background-color: #04AA6D; text-align: center; border-radius: 5px; cursor: pointer; font-weight: bold">
//                     Verify
//                 </div>
//             </div>
//             <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
//             <script type = "text/javascript">
//                 const verifyBtn = document.querySelector('.awareVerifyBtn')
//                 verifyBtn.onclick = handleVerify
                
//                 function handleVerify() {
//                     axios.post('${process.env.HOST}:${process.env.PORT}/api/user/verifyEmail' , {emailToken: ${emailToken}})
//                         .then((res) => {
//                             if(res.data.status === 200){
//                                 console.log('oke')
//                                 verifyBtn.innerText = "Verified"
//                                 verifyBtn.style.backgroundColor = '#888'
//                                 verifyBtn.onclick = null
//                             }
//                         })
//                         .catch()
//                 }
//             </script>
//         `
//     }
// }

export const authenToken = (req: Request, res: Response, next: NextFunction) => {

}

export const isUser = (req: Request, res: Response, next: NextFunction) => {

}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {

}