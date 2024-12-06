const pool = require('../../db')

async function getOrganizations() {
  const connection = await pool.connect()
  try {
    const result = await connection.query('SELECT * FROM organizations')
    return result.rows
  } catch (err) {
    console.error('Error fetching organizations:', err)
    throw err
  } finally {
    connection.release()
  }
}

async function getHistoryOrganizations(id) {
  const connection = await pool.connect()
  try {
    const result = await connection.query(
      `SELECT history_change.id, to_char(datetime_operations, 'YYYY-MM-DD HH24:MI:SS') as datetime_operations, (users.last_name || ' ' || LEFT(users.first_name, 1) || '. ' || left(users.middle_name, 1) || '.') as full_name, old_value, new_value FROM history_change join users on history_change.author = users.id where object_operations_id =1 and record_id = $1`,
      [id],
    )
    return result.rows
  } catch (err) {
    console.error('Error fetching history organizations:', err)
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
       VALUES ($1, $2, 1, $3, $4, $5)`,
      [datetime_operations, author, record_id, oldValue, newValue],
    )
  } catch (err) {
    console.error('Error saving history:', err)
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

    await addHistory(organizationId, '', newValue, connection, req)

    await connection.query('COMMIT')
    return result.rows[0]
  } catch (err) {
    await connection.query('ROLLBACK')
    console.error('Error saving organization:', err)
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

    const oldValue = `Название: ${oldDataResult.rows[0].name}\nКомментарий: ${oldDataResult.rows[0].comment}`
    const newValue = `Название: ${name}\nКомментарий: ${comment}`

    await addHistory(id, oldValue, newValue, connection, req)

    await connection.query('COMMIT')
    return result.rows[0]
  } catch (err) {
    await connection.query('ROLLBACK')
    console.error('Error updating organization:', err)
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
    console.error('Error deleting organization:', err)
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
  getHistoryOrganizations,
}
