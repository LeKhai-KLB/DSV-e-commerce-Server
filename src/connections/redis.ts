import * as redis from "redis"

const redisClient = redis.createClient()

function connect_redisServer() {
    redisClient.connect()
    .then(async() => {
        console.log('connected to redis server')
    })
    .catch((err: any) => {
        console.log(err)
    })
}

export default redisClient
export { connect_redisServer }