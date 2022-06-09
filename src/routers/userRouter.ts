'use strict';

import express from 'express';
import { register, login, logout, setVerifiedEmail, resetPassword, reSendVerifyEmail, updateUserInfo, changePassword } from '../controllers/userController'
import { authenEmailToken } from '../utils/authServices'
import { authenToken } from '../utils/authServices';

const userRouter = express.Router();

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.post('/logout', logout)
userRouter.post('/verifyEmail', authenEmailToken, setVerifiedEmail)
userRouter.post('/resetPassword', resetPassword)
userRouter.post('/reSendVerifyEmail',authenToken, reSendVerifyEmail)
userRouter.post('/update', authenToken, updateUserInfo)
userRouter.post('/changePassword', authenToken, changePassword)

export default userRouter