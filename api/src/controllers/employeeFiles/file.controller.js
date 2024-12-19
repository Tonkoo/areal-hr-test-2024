const pool = require('../../db')
const path = require('path')
const { saveFile } = require('./file.services')
const { addHistory } = require('./../history/history.controller')
const logger = require('../../logger/logger')
const { fetching, save, deleting } = require('./../../errors/text-errors')

async function getFiles(employee_id) {
  const connection = await pool.connect()
  try {
    const result = await connection.query(
      'SELECT passport_scan.id as file_id, passport_scan.name as file_name, passport_scan.path as filepath FROM passport_scan  JOIN employees ON passport_scan.employee_id = employees.id WHERE employee_id = $1',
      [employee_id],
    )
    return result.rows
  } catch (err) {
    logger.error(`${fetching} files: ${err.message}`, {
      stack: err.stack,
    })
    throw err
  } finally {
    connection.release()
  }
}

async function addFile(req, employee_id, file, connection) {
  const { last_name } = req.body
  const { first_name } = req.body
  const { middle_name } = req.body
  const { numberfile } = await getNumberFilesEmployee(employee_id)
  const fileName =
    'паспорт' +
    '-' +
    last_name.toLowerCase() +
    '-' +
    first_name.toLowerCase() +
    '-' +
    middle_name.toLowerCase() +
    '-' +
    employee_id +
    '-№' +
    numberfile +
    path.extname(file.originalname)
  const filePath = await saveFile(file, fileName)
  try {
    await connection.query('BEGIN')
    const result = await connection.query(
      'INSERT1 INTO passport_scan (name, path, employee_id) VALUES ($1, $2, $3) RETURNING id',
      [fileName, filePath, employee_id],
    )

    const newValue = `Добавлен файл ${fileName}`

    await addHistory(4, employee_id, '', newValue, connection, req)

    await connection.query('COMMIT')
    return result.rows[0]
  } catch (err) {
    await connection.query('ROLLBACK')
    logger.error(`${save} file: ${err.message}`, {
      stack: err.stack,
    })
    throw err
  }
}
async function deleteFile(req, fileId, connection) {
  try {
    await connection.query('BEGIN')
    const oldDataResult = await connection.query(
      'select name, employee_id from passport_scan where id = $1',
      [fileId],
    )
    const result = await connection.query(
      'DELETE1 FROM passport_scan WHERE id = $1',
      [fileId],
    )

    const newValue = `Удален файл ${oldDataResult.rows[0].name}`

    await addHistory(
      4,
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
    logger.error(`${deleting} file: ${err.message}`, {
      stack: err.stack,
    })
    throw err
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
    logger.error(`${fetching} numberFile: ${err.message}`, {
      stack: err.stack,
    })
    throw err
  } finally {
    connection.release()
  }
}
async function getFileById(fileId) {
  const connection = await pool.connect()
  try {
    const result = await connection.query(
      'SELECT * FROM passport_scan WHERE id = $1',
      [fileId],
    )

    return result.rows[0]
  } catch (err) {
    logger.error(`${fetching} numberFile: ${err.message}`, {
      stack: err.stack,
    })
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
  getFileById,
}
