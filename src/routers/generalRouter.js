'use strict';

import { addCategory } from '../controllers/generalController.js'
import express from 'express'

const generalRouter = express.Router()

generalRouter.post('/addCategory', addCategory)

export default generalRouter