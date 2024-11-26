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
async function addFile(name, filePath, employee_id) {
  const connection = await pool.connect()
  try {
    const result = await connection.query(
      'INSERT INTO passport_scan (name, path, employee_id) VALUES ($1, $2, $3) RETURNING id',
      [name, filePath, employee_id],
    )
    return result.rows[0]
  } catch (err) {
    console.error('Error adding file:', err)
    throw err
  } finally {
    connection.release()
  }
}
async function deleteFile(fileId) {
  const connection = await pool.connect()
  try {
    const result = await connection.query(
      'DELETE FROM passport_scan WHERE id = $1',
      [fileId],
    )
    return result.rowCount
  } catch (err) {
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
