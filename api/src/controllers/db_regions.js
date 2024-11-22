const client = require('../db')

async function getRegions() {
  try {
    const result = await client.query('SELECT * FROM regions')
    return result.rows
  } catch (err) {
    console.error('Error fetching regions:', err)
    throw err
  }
}

module.exports = {
  getRegions,
}
