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
  try {
    const { employee_id } = req.params
    const files = await getFiles(employee_id)
    res.json(files)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'An error occurred while fetching files' })
  }
})

router.post('/files/:employee_id', upload.single('file'), async (req, res) => {
  const connection = await pool.connect()
  try {
    const { employee_id } = req.params
    const file = req.file
    const newFile = await addFile(req, employee_id, file, connection)
    res
      .status(201)
      .json({ message: 'File added successfully', fileId: newFile.id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'An error occurred while adding the file' })
  } finally {
    connection.release()
  }
})

router.delete('/files/:fileId', async (req, res) => {
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

    res.status(200).json({ message: 'File successfully deleted' })
  } catch (err) {
    console.error(err)
    await connection.query('ROLLBACK')
    res.status(500).json({ error: 'An error occurred while deleting the file' })
  } finally {
    connection.release()
  }
})

router.get('/files/download/:fileId', async (req, res) => {
  const { fileId } = req.params

  try {
    const file = await getFileById(fileId)
    if (!file) {
      return res.status(404).json({ error: 'File not found' })
    }

    res.download(file.path, file.name)
  } catch (err) {
    console.error('Error downloading file:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
