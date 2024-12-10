const pool = require('../../db')

async function getPositions() {
  const connection = await pool.connect()
  try {
    const result = await pool.query(
      'SELECT positions.id, positions.name as position_name, departments.name as department_name, department_id FROM positions join departments on positions.department_id = departments.id',
    )
    return result.rows
  } catch (err) {
    console.error('Error fetching positions:', err)
    throw err
  } finally {
    connection.release()
  }
}

async function getHistoryPositions(id) {
  const connection = await pool.connect()
  try {
    const result = await connection.query(
      `SELECT history_change.id, to_char(datetime_operations, 'YYYY-MM-DD HH24:MI:SS') as datetime_operations, (users.last_name || ' ' || LEFT(users.first_name, 1) || '. ' || left(users.middle_name, 1) || '.') as full_name, old_value, new_value FROM history_change join users on history_change.author = users.id where object_operations_id =3 and record_id = $1`,
      [id],
    )
    return result.rows
  } catch (err) {
    console.error('Error fetching history positions:', err)
    throw err
  } finally {
    connection.release()
  }
}

async function addHistory(record_id, oldValue, newValue, connection, req) {
  try {
    const currentDate = new Date()
    const datetime_operations = currentDate.toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    const author = req.user.id
    await connection.query(
      `INSERT INTO history_change (datetime_operations, author, object_operations_id, record_id, old_value, new_value) 
       VALUES ($1, $2, 3, $3, $4, $5)`,
      [datetime_operations, author, record_id, oldValue, newValue],
    )
  } catch (err) {
    console.error('Error saving history:', err)
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

    await addHistory(positionId, '', newValue, connection, req)

    await connection.query('COMMIT')
    return result.rows[0]
  } catch (err) {
    await connection.query('ROLLBACK')
    console.error('Error saving position:', err)
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
    if (result.rows.length === 0) {
      return { error: 'Position not found' }
    }

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
    // const oldValue = `Название: ${oldDataResult.rows[0].positions_name}\nОтдел: ${oldDataResult.rows[0].departments_name}`
    // const newValue = `Название: ${name}\nОтдел: ${department.rows[0].name}`

    await addHistory(id, oldValue, newValue, connection, req)

    await connection.query('COMMIT')
    return result.rows[0]
  } catch (err) {
    await connection.query('ROLLBACK')
    console.error('Error updating position:', err)
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

    if (result.rows.length === 0) {
      return { error: 'Position not found' }
    }

    await connection.query(
      `DELETE FROM history_change WHERE record_id = $1 and object_operations_id = 3`,
      [id],
    )

    await connection.query('COMMIT')
    return result.rows[0]
  } catch (err) {
    await connection.query('ROLLBACK')
    console.error('Error deleting position:', err)
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
  getHistoryPositions,
}
