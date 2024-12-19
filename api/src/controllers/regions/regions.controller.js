const client = require('./../../services/db')
const logger = require('./../../logger/logger')
const { fetching } = require('./../../errors/text-errors')

async function getRegions() {
  try {
    const result = await client.query('SELECT * FROM regions')
    return result.rows
  } catch (err) {
    logger.error(`${fetching} regions: ${err.message}`, {
      stack: err.stack,
    })
    throw err
  }
}

module.exports = {
  getRegions,
}
