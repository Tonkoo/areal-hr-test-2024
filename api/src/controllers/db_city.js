const client = require('../db')

async function getCity() {
  try {
    const result = await client.query('SELECT * FROM citys')
    return result.rows
  } catch (err) {
    console.error('Error fetching regions:', err)
    throw err
  }
}

module.exports = {
  getCity,
}
