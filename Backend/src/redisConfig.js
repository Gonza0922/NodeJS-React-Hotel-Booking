import redis from "redis";

const { NODE_ENV, REDIS_HOST, DOCKER_REDIS_HOST } = process.env;
const nodeEnv = NODE_ENV && NODE_ENV.trim().toLowerCase();
let host = REDIS_HOST;

if (nodeEnv === "production") host = DOCKER_REDIS_HOST;

const redisClient = redis.createClient({
  socket: {
    host,
    port: 6379,
  },
});

redisClient
  .connect()
  .then(() => {
    console.log(`Connected to Redis successfully with host ${host}`);
  })
  .catch((err) => {
    console.error("Failed to connect to Redis:", err);
  });

export default redisClient;
