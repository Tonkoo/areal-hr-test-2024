const logger = require('./../../logger/logger')
const { save } = require('./../../errors/text-errors')

async function addHistory(
  object_operations_id,
  record_id,
  oldValue,
  newValue,
  connection,
  req,
) {
  try {
    const datetime_operations = new Date()
    const author = req.user.id
    await connection.query(
      `INSERT INTO history_change (datetime_operations, author, object_operations_id, record_id, old_value, new_value) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        datetime_operations,
        author,
        object_operations_id,
        record_id,
        oldValue,
        newValue,
      ],
    )
  } catch (err) {
    logger.error(`${save} history: ${err.message}`, {
      stack: err.stack,
    })
    throw err
  }
}

module.exports = {
  addHistory,
}
