import express from 'express';
import cors from 'cors'
import * as http from 'http'
import generalRouter from '../routers/generalRouter'
import productRouter from '../routers/productRouter'
import userRouter from '../routers/userRouter'
import orderRouter from '../routers/orderRouter'
import * as socket from 'socket.io'
import {ServerOptions} from 'socket.io'

function start_httpServer() {
    const app = express()
    app.use(cors())
    app.use(express.json())
    app.use('/api/general', generalRouter)
    app.use('/api/product', productRouter)
    app.use('/api/user', userRouter)
    app.use('/api/order', orderRouter)

    const server = new http.Server(app)
    const io = new socket.Server(server, {
        cors: {
            origin: '*',
            credentials: true
        }
    })

    try {
        server.listen(process.env.PORT as string, 
            () => console.log('listening on port ' + process.env.PORT)
        )

        io.on('connection', (socket:any) => {
    
            socket.on('checkout', (data:any) => {
                io.emit('new-order-added', data)
            })

            socket.on('disconnect', () => {
                console.log('disconnect')
            })
        })
    }
    catch (err:any) {
        console.log(err)
    }
}

export default start_httpServer