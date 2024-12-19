const { RedisStore } = require('connect-redis')
const { createClient } = require('redis')
const logger = require('./../logger/logger')
const { connect } = require('../errors/text-errors')

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
})

redisClient
  .connect()
  .then(() => console.log('Connected to Redis'))
  .catch((err) => {
    logger.error(`${connect} redis ${err.message}`, {
      stack: err.stack,
    })
    process.exit(1)
  })

module.exports = {
  redisClient,
  RedisStore,
}
