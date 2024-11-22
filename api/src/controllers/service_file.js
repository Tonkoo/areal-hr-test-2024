const fs = require('fs').promises
const path = require('path')

const storagePath = '../uploads/'

async function saveFile(file) {
  const filePath = path.join(
    storagePath,
    Date.now() + path.extname(file.originalname),
  )
  await fs.writeFile(filePath, file.buffer)
  return filePath
}

async function deleteFileFromSystem(filepath) {
  try {
    await fs.unlink(filepath)
    return true
  } catch (err) {
    console.error('Error deleting file from filesystem:', err)
    throw new Error('Could not delete file from filesystem')
  }
}

module.exports = {
  saveFile,
  deleteFileFromSystem,
}
