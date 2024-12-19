const fs = require('fs').promises
const path = require('path')
const logger = require('./../../logger/logger')

const storagePath = '../files/'

async function saveFile(file, fileName) {
  const filePath = path.join(
    storagePath,
    fileName + path.extname(file.originalname),
  )

  try {
    await fs.access(storagePath)
  } catch {
    await fs.mkdir(storagePath, { recursive: true })
  }

  await fs.writeFile(filePath, file.buffer)
  return filePath
}

async function deleteFileFromSystem(filepath) {
  try {
    await fs.unlink(filepath)
    return true
  } catch (err) {
    logger.error(`Error deleting file from filesystem: ${err.message}`, {
      stack: err.stack,
    })
    throw err
  }
}

module.exports = {
  saveFile,
  deleteFileFromSystem,
}
