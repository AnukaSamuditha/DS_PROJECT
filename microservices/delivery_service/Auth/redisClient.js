const redis = require('redis');
require('dotenv').config();
const PORT = process.env.REDIS_PORT;

const REDIS_HOST = 'redis';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const redisClient = redis.createClient({
    socket: {
        host: REDIS_HOST,
        port: REDIS_PORT,
        reconnectStrategy: retries => Math.min(retries * 50, 500)
    },
    
});

redisClient.on('connect', () => console.log('Connecting to Redis...'));
redisClient.on('ready', () => console.log('Redis is ready to use'));
redisClient.on('error', err => console.error('Redis Error:', err.message));
redisClient.on('end', () => console.log('Redis connection closed'));


const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log('Successfully connected to Redis');
    } catch (error) {
        console.error('Redis connection failed:', error.message);
    }
};


process.on('SIGINT', async () => {
    try {
        await redisClient.quit();
        console.log('Redis client closed');
        process.exit(0);
    } catch (error) {
        console.error('Error closing Redis:', error.message);
        process.exit(1);
    }
});


module.exports = { redisClient, connectRedis };