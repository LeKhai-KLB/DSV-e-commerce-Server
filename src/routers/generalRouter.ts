'use strict';

import { addCategory, testAuthorizationToken_user, testAuthorizationToken_admin } from '../controllers/generalController'
import express from 'express'
import { authenToken } from '../utils/authServices';

const generalRouter = express.Router()

generalRouter.post('/addCategory', addCategory)
generalRouter.get('/testAuthorizationToken_user', authenToken, testAuthorizationToken_user)
generalRouter.get('/testAuthorizationToken_admin', authenToken, testAuthorizationToken_admin)

export default generalRouter