import * as redis from "redis";

const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST as string,
    port: Number(process.env.REDIS_PORT) || 6379,
  },
});

function connect_redisServer() {
  redisClient
    .connect()
    .then(async () => {
      console.log("connected to redis server");
    })
    .catch((err: any) => {
      console.log(err);
    });
}

export default redisClient;
export { connect_redisServer };
