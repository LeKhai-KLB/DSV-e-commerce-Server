'use strict';
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose';
import * as dotenv from 'dotenv'
import * as http from 'http'

import Brand from './src/models/Brand.js'

'use strict';

import productRouter from './src/routers/productRouter.js'
import generalRouter from './src/routers/generalRouter.js'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

app.use('/api/product', productRouter)
app.use('/api/general', generalRouter)

const server = http.Server(app)

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('connected to DB')
        server.listen(process.env.PORT || 5000, () => {
            console.log('listening on port ' + process.env.PORT)
        })
    })
    .catch((err) => {
        console.log(err)
    })