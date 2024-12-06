const pool = require('../../db')

async function getFiles(employee_id) {
  const connection = await pool.connect()
  try {
    const result = await connection.query(
      'SELECT passport_scan.id as file_id, passport_scan.name as file_name, passport_scan.path as filepath FROM passport_scan  JOIN employees ON passport_scan.employee_id = employees.id WHERE employee_id = $1',
      [employee_id],
    )
    return result.rows
  } catch (err) {
    console.error('Error fetching files:', err)
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
       VALUES ($1, $2, 4, $3, $4, $5)`,
      [datetime_operations, author, record_id, oldValue, newValue],
    )
  } catch (err) {
    console.error('Error saving history:', err)
  }
}

async function addFile(req, name, filePath, employee_id) {
  const connection = await pool.connect()
  try {
    await connection.query('BEGIN')
    const result = await connection.query(
      'INSERT INTO passport_scan (name, path, employee_id) VALUES ($1, $2, $3) RETURNING id',
      [name, filePath, employee_id],
    )

    const newValue = `Добавлен файл ${name}`

    await addHistory(employee_id, '', newValue, connection, req)

    await connection.query('COMMIT')
    return result.rows[0]
  } catch (err) {
    await connection.query('ROLLBACK')
    console.error('Error adding file:', err)
    throw err
  } finally {
    connection.release()
  }
}
async function deleteFile(req, fileId) {
  const connection = await pool.connect()
  try {
    await connection.query('BEGIN')
    const oldDataResult = await connection.query(
      'select name, employee_id from passport_scan where id = $1',
      [fileId],
    )
    const result = await connection.query(
      'DELETE FROM passport_scan WHERE id = $1',
      [fileId],
    )

    const newValue = `Удален файл ${oldDataResult.rows[0].name}`

    await addHistory(
      oldDataResult.rows[0].employee_id,
      '',
      newValue,
      connection,
      req,
    )

    await connection.query('COMMIT')
    return result.rowCount
  } catch (err) {
    await connection.query('ROLLBACK')
    console.error('Error deleting file:', err)
    throw err
  } finally {
    connection.release()
  }
}
async function getNumberFilesEmployee(employee_id) {
  const connection = await pool.connect()
  try {
    const result = await connection.query(
      'SELECT (COUNT(passport_scan.id)+1) as numberFile FROM passport_scan  JOIN employees ON passport_scan.employee_id = employees.id WHERE employee_id = $1',
      [employee_id],
    )

    return result.rows[0]
  } catch (err) {
    console.error('Error fetching numberFile:', err)
    throw err
  } finally {
    connection.release()
  }
}

module.exports = {
  getFiles,
  addFile,
  deleteFile,
  getNumberFilesEmployee,
}
