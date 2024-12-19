const client = require('./../../services/db')
const logger = require('./../../logger/logger')
const { fetching } = require('./../../errors/text-errors')

async function getCity() {
  try {
    const result = await client.query('SELECT * FROM citys')
    return result.rows
  } catch (err) {
    logger.error(`${fetching} citys: ${err.message}`, {
      stack: err.stack,
    })
    throw err
  }
}

module.exports = {
  getCity,
}
