const client = require('../../db')

async function getOrganizations() {
  try {
    const result = await client.query('SELECT * FROM organizations')
    return result.rows
  } catch (err) {
    console.error('Error fetching organizations:', err)
    throw err
  }
}
async function addOrganization(name, comment) {
  try {
    const result = await client.query(
      'INSERT INTO organizations (name, comment) VALUES ($1, $2) RETURNING id',
      [name, comment],
    )
    return result.rows[0]
  } catch (err) {
    console.error('Error saving organization:', err)
    throw err
  }
}
async function updateOrganization(id, name, comment) {
  try {
    const result = await client.query(
      'UPDATE organizations SET name = $1, comment = $2 WHERE id = $3',
      [name, comment, id],
    )
    return result.rows[0]
  } catch (err) {
    console.error('Error updating organization:', err)
    throw err
  }
}
async function deleteOrganization(id) {
  try {
    const result = await client.query(
      'DELETE FROM organizations WHERE id = $1',
      [id],
    )
    return result.rows[0]
  } catch (err) {
    console.error('Error deleting organization:', err)
    throw err
  }
}

module.exports = {
  getOrganizations,
  addOrganization,
  updateOrganization,
  deleteOrganization,
}
