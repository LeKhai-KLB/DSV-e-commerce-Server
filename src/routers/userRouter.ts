'use strict';

import express from 'express';
import { register, login, verifyEmail } from '../controllers/userController'

const userRouter = express.Router();

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.post('/verifyEmail', verifyEmail)

export default userRouter