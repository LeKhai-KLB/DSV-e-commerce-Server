import mongoose, { ConnectOptions } from 'mongoose'

function connect_mongoServer() {
    mongoose.connect(process.env.MONGO_URL as string, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    } as ConnectOptions)
        .then(() => {
            console.log('connected to DB')
        }).catch((err) => {
            console.log(err)
        })
}

export default connect_mongoServer