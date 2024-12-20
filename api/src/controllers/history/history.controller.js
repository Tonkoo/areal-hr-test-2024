const logger = require('./../../logger/logger')
const pool = require('./../../services/db')
const { save } = require('./../../errors/text-errors')
const { fetching } = require('./../../errors/text-errors')

async function getHistorRecord(object_operations_id, id) {
  const connection = await pool.connect()
  try {
    const result = await connection.query(
      `SELECT history_change.id, to_char(datetime_operations, 'YYYY-MM-DD HH24:MI:SS') as datetime_operations, (users.last_name || ' ' || LEFT(users.first_name, 1) || '. ' || left(users.middle_name, 1) || '.') as full_name, old_value, new_value FROM history_change join users on history_change.author = users.id where object_operations_id =$1 and record_id = $2 order by history_change.id`,
      [object_operations_id, id],
    )
    return result.rows
  } catch (err) {
    logger.error(`${fetching} history: ${err.message}`, {
      stack: err.stack,
    })
    throw err
  } finally {
    connection.release()
  }
}

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
  getHistorRecord,
}
