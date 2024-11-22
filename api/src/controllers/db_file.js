const client = require('../db')

async function getFiles(employee_id) {
  try {
    const result = await client.query(
      'SELECT passport_scan.id as file_id, passport_scan.name as file_name, passport_scan.path as filepath FROM passport_scan  JOIN employees ON passport_scan.employee_id = employees.id WHERE employee_id = $1',
      [employee_id],
    )
    return result.rows
  } catch (err) {
    console.error('Error fetching files:', err)
    throw err
  }
}
async function addFile(name, filePath, employee_id) {
  try {
    const result = await client.query(
      'INSERT INTO passport_scan (name, path, employee_id) VALUES ($1, $2, $3) RETURNING id',
      [name, filePath, employee_id],
    )
    return result.rows[0]
  } catch (err) {
    console.error('Error adding file:', err)
    throw err
  }
}
async function deleteFile(fileId) {
  try {
    const result = await client.query(
      'DELETE FROM passport_scan WHERE id = $1',
      [fileId],
    )
    return result.rowCount
  } catch (err) {
    console.error('Error deleting file:', err)
    throw err
  }
}

module.exports = {
  getFiles,
  addFile,
  deleteFile,
}
