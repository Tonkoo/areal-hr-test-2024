const express = require('express')
const router = express.Router()
const pool = require('./../services/db')
const multer = require('multer')
const { StatusCodes } = require('http-status-codes')
const logger = require('../logger/logger')
const {
  getFiles,
  addFile,
  deleteFile,
  getFileById,
} = require('../controllers/employeeFiles/file.controller')
const {
  fetching,
  save,
  deleting,
  Internal,
  access,
  download,
} = require('./../errors/text-errors')
const {
  deleteFileFromSystem,
} = require('../controllers/employeeFiles/file.services')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.get('/files/:employee_id', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const { employee_id } = req.params
      const files = await getFiles(employee_id)
      return res.json(files)
    } catch (err) {
      logger.error(`${fetching} files: ${err.message}`, {
        stack: err.stack,
      })
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: Internal })
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: access })
})

router.post('/files/:employee_id', upload.single('file'), async (req, res) => {
  if (req.isAuthenticated()) {
    const connection = await pool.connect()
    try {
      const { employee_id } = req.params
      const file = req.file
      const newFile = await addFile(req, employee_id, file, connection)
      return res
        .status(StatusCodes.CREATED)
        .json({ message: 'File added successfully', fileId: newFile.id })
    } catch (err) {
      logger.error(`${save} file: ${err.message}`, {
        stack: err.stack,
      })
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: Internal })
    } finally {
      connection.release()
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: access })
})

router.delete('/files/:fileId', async (req, res) => {
  if (req.isAuthenticated()) {
    const connection = await pool.connect()
    try {
      const { fileId } = req.params
      const { filepath } = req.query
      await connection.query('BEGIN')

      await deleteFile(req, fileId, connection)
      await deleteFileFromSystem(filepath)

      await connection.query('COMMIT')

      return res
        .status(StatusCodes.OK)
        .json({ message: 'File successfully deleted' })
    } catch (err) {
      logger.error(`${deleting} file: ${err.message}`, {
        stack: err.stack,
      })
      await connection.query('ROLLBACK')
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: Internal })
    } finally {
      connection.release()
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: access })
})

router.get('/files/download/:fileId', async (req, res) => {
  if (req.isAuthenticated()) {
    const { fileId } = req.params
    try {
      const file = await getFileById(fileId)
      return res.download(file.path, file.name)
    } catch (err) {
      logger.error(`${download} ${err.message}`, {
        stack: err.stack,
      })
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: Internal })
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: access })
})

module.exports = router
