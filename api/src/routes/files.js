const express = require('express')
const router = express.Router()
const pool = require('../db')
const multer = require('multer')
const {
  getFiles,
  addFile,
  deleteFile,
  getFileById,
} = require('../controllers/employeeFiles/db-file')
const {
  deleteFileFromSystem,
} = require('../controllers/employeeFiles/service-file')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.get('/files/:employee_id', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const { employee_id } = req.params
      const files = await getFiles(employee_id)
      return res.json(files)
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ error: 'An error occurred while fetching files' })
    }
  }
  return res.status(401).json({ message: 'Неавторизованный доступ' })
})

router.post('/files/:employee_id', upload.single('file'), async (req, res) => {
  if (req.isAuthenticated()) {
    const connection = await pool.connect()
    try {
      const { employee_id } = req.params
      const file = req.file
      const newFile = await addFile(req, employee_id, file, connection)
      return res
        .status(201)
        .json({ message: 'File added successfully', fileId: newFile.id })
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ error: 'An error occurred while adding the file' })
    } finally {
      connection.release()
    }
  }
  return res.status(401).json({ message: 'Неавторизованный доступ' })
})

router.delete('/files/:fileId', async (req, res) => {
  if (req.isAuthenticated()) {
    const connection = await pool.connect()
    try {
      const { fileId } = req.params
      const { filepath } = req.query

      if (!filepath) {
        return res.status(400).json({ error: 'The file path is not specified' })
      }

      await connection.query('BEGIN')

      const deletedFiles = await deleteFile(req, fileId, connection)
      if (!deletedFiles) {
        await connection.query('ROLLBACK')
        return res.status(404).json({ error: 'File not found' })
      }
      await deleteFileFromSystem(filepath)

      await connection.query('COMMIT')

      return res.status(200).json({ message: 'File successfully deleted' })
    } catch (err) {
      console.error(err)
      await connection.query('ROLLBACK')
      return res
        .status(500)
        .json({ error: 'An error occurred while deleting the file' })
    } finally {
      connection.release()
    }
  }
  return res.status(401).json({ message: 'Неавторизованный доступ' })
})

router.get('/files/download/:fileId', async (req, res) => {
  if (req.isAuthenticated()) {
    const { fileId } = req.params
    try {
      const file = await getFileById(fileId)
      if (!file) {
        return res.status(404).json({ error: 'File not found' })
      }

      return res.download(file.path, file.name)
    } catch (err) {
      console.error('Error downloading file:', err)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
  return res.status(401).json({ message: 'Неавторизованный доступ' })
})

module.exports = router
