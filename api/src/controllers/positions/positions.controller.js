const pool = require('./../../services/db')
const { addHistory } = require('./../history/history.controller')
const logger = require('./../../logger/logger')
const {
  fetching,
  save,
  update,
  deleting,
} = require('./../../errors/text-errors')

async function getPositions() {
  const connection = await pool.connect()
  try {
    const result = await pool.query(
      'SELECT positions.id, positions.name as position_name, departments.name as department_name, department_id FROM positions join departments on positions.department_id = departments.id',
    )
    return result.rows
  } catch (err) {
    logger.error(`${fetching} positions: ${err.message}`, {
      stack: err.stack,
    })
    throw err
  } finally {
    connection.release()
  }
}

async function addPosition(req, name, department_id) {
  const connection = await pool.connect()
  try {
    await connection.query('BEGIN')
    const result = await connection.query(
      `INSERT INTO positions (name, department_id) 
       VALUES ($1, $2) RETURNING *`,
      [name, department_id],
    )

    const positionId = result.rows[0].id
    const department = await connection.query(
      'select name from departments where id=$1',
      [department_id],
    )
    const newValue = `Название: ${name}\nОтдел: ${department.rows[0].name}`

    await addHistory(3, positionId, '', newValue, connection, req)

    await connection.query('COMMIT')
    return result.rows[0]
  } catch (err) {
    await connection.query('ROLLBACK')
    logger.error(`${save} position: ${err.message}`, {
      stack: err.stack,
    })
    throw err
  } finally {
    connection.release()
  }
}
async function updatePosition(req, id, name, department_id) {
  const connection = await pool.connect()
  try {
    await connection.query('BEGIN')

    const oldDataResult = await connection.query(
      'SELECT positions.name as positions_name, departments.name as departments_name FROM positions join departments on positions.department_id = departments.id WHERE positions.id = $1',
      [id],
    )

    const result = await connection.query(
      `UPDATE positions 
       SET name = $1, department_id = $2
       WHERE id = $3 RETURNING *`,
      [name, department_id, id],
    )
    const department = await connection.query(
      'select name from departments where id=$1',
      [department_id],
    )
    let oldValue = ''
    let newValue = ''
    if (oldDataResult.rows[0].positions_name != name) {
      oldValue += `Название: ${oldDataResult.rows[0].positions_name}\n`
      newValue += `Название: ${name}\n`
    }
    if (oldDataResult.rows[0].departments_name != department.rows[0].name) {
      oldValue += `Отдел: ${oldDataResult.rows[0].departments_name}\n`
      newValue += `Отдел: ${department.rows[0].name}\n`
    }

    await addHistory(3, id, oldValue, newValue, connection, req)

    await connection.query('COMMIT')
    return result.rows[0]
  } catch (err) {
    await connection.query('ROLLBACK')
    logger.error(`${update} position: ${err.message}`, {
      stack: err.stack,
    })
    throw err
  } finally {
    connection.release()
  }
}
async function deletePosition(id) {
  const connection = await pool.connect()
  try {
    await connection.query('BEGIN')
    const result = await connection.query(
      'DELETE FROM positions WHERE id = $1 RETURNING *',
      [id],
    )

    await connection.query(
      `DELETE FROM history_change WHERE record_id = $1 and object_operations_id = 3`,
      [id],
    )

    await connection.query('COMMIT')
    return result.rows[0]
  } catch (err) {
    await connection.query('ROLLBACK')
    logger.error(`${deleting} position: ${err.message}`, {
      stack: err.stack,
    })
    throw err
  } finally {
    connection.release()
  }
}

module.exports = {
  getPositions,
  addPosition,
  updatePosition,
  deletePosition,
}
