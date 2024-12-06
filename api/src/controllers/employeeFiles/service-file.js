const fs = require('fs').promises
const path = require('path')

const storagePath = '../files/'

async function saveFile(file, fileName) {
  //Todo добавить проверу на существование папки files и создание если ее нет
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
    console.error('Error deleting file from filesystem:', err)
    throw new Error('Could not delete file from filesystem')
  }
}

module.exports = {
  saveFile,
  deleteFileFromSystem,
}
