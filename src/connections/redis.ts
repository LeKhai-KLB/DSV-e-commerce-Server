import * as redis from "redis";

const redisClient = redis.createClient({
  url: process.env.REDIS_URL as string,
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
