'use strict';

import express from 'express';
import cors from 'cors'
import mongoose, { ConnectOptions } from 'mongoose'
import * as dotenv from 'dotenv'
import * as http from 'http'

import generalRouter from './routers/generalRouter'
import productRouter from './routers/productRouter'
import userRouter from './routers/userRouter'
import orderRouter from './routers/orderRouter'

dotenv.config({path: '.env'})

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/general', generalRouter)
app.use('/api/product', productRouter)
app.use('/api/user', userRouter)
app.use('/api/order', orderRouter)

const server = new http.Server(app)

mongoose.connect(process.env.MONGO_URL as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true
} as ConnectOptions)
    .then(() => {
        console.log('connected to DB')
        server.listen(process.env.PORT as string, () => {
            console.log('listening on port ' + process.env.PORT)
        })
    })
    .catch((err) => {
        console.log(err)
    })