const pool = require('./../../services/db')
const { addHistory } = require('./../history/history.controller')
const logger = require('./../../logger/logger')
const {
  fetching,
  save,
  update,
  deleting,
} = require('./../../errors/text-errors')

async function getOrganizations() {
  const connection = await pool.connect()
  try {
    const result = await connection.query('SELECT * FROM organizations')
    return result.rows
  } catch (err) {
    logger.error(`${fetching} organizations: ${err.message}`, {
      stack: err.stack,
    })
    throw err
  } finally {
    connection.release()
  }
}

async function addOrganization(req, name, comment) {
  const connection = await pool.connect()
  try {
    await connection.query('BEGIN')
    const result = await connection.query(
      'INSERT INTO organizations (name, comment) VALUES ($1, $2) RETURNING id',
      [name, comment],
    )

    const organizationId = result.rows[0].id

    const newValue = `Название: ${name}\nКомментарий: ${comment}`

    await addHistory(1, organizationId, '', newValue, connection, req)

    await connection.query('COMMIT')
    return result.rows[0]
  } catch (err) {
    await connection.query('ROLLBACK')
    logger.error(`${save} organization: ${err.message}`, {
      stack: err.stack,
    })
    throw err
  } finally {
    connection.release()
  }
}
async function updateOrganization(req, id, name, comment) {
  const connection = await pool.connect()
  try {
    await connection.query('BEGIN')

    const oldDataResult = await connection.query(
      'SELECT name, comment FROM organizations WHERE id = $1',
      [id],
    )

    const result = await connection.query(
      'UPDATE organizations SET name = $1, comment = $2 WHERE id = $3',
      [name, comment, id],
    )
    let oldValue = ''
    let newValue = ''
    if (oldDataResult.rows[0].name != name) {
      oldValue += `Название: ${oldDataResult.rows[0].name}\n`
      newValue += `Название: ${name}\n`
    }
    if (oldDataResult.rows[0].comment != comment) {
      oldValue += `Комментарий: ${oldDataResult.rows[0].comment}\n`
      newValue += `Комментарий: ${comment}\n`
    }

    await addHistory(1, id, oldValue, newValue, connection, req)

    await connection.query('COMMIT')
    return result.rows[0]
  } catch (err) {
    await connection.query('ROLLBACK')
    logger.error(`${update} organization: ${err.message}`, {
      stack: err.stack,
    })
    throw err
  } finally {
    connection.release()
  }
}
async function deleteOrganization(id) {
  const connection = await pool.connect()
  try {
    await connection.query('BEGIN')
    const result = await connection.query(
      'DELETE FROM organizations WHERE id = $1',
      [id],
    )
    await connection.query(
      `DELETE FROM history_change WHERE record_id = $1 and object_operations_id = 1`,
      [id],
    )

    await connection.query('COMMIT')
    return result.rows[0]
  } catch (err) {
    await connection.query('ROLLBACK')
    logger.error(`${deleting} organization: ${err.message}`, {
      stack: err.stack,
    })
    throw err
  } finally {
    connection.release()
  }
}

module.exports = {
  getOrganizations,
  addOrganization,
  updateOrganization,
  deleteOrganization,
}
