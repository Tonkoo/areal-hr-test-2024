const pool = require('../../db')

async function getOrganizations() {
  const connection = await pool.connect()
  try {
    const result = await connection.query('SELECT * FROM organizations')
    return result.rows
  } catch (err) {
    console.error('Error fetching organizations:', err)
    throw err
  } finally {
    connection.release()
  }
}
async function addOrganization(name, comment) {
  const connection = await pool.connect()
  try {
    const result = await connection.query(
      'INSERT INTO organizations (name, comment) VALUES ($1, $2) RETURNING id',
      [name, comment],
    )
    return result.rows[0]
  } catch (err) {
    console.error('Error saving organization:', err)
    throw err
  } finally {
    connection.release()
  }
}
async function updateOrganization(id, name, comment) {
  const connection = await pool.connect()
  try {
    const result = await connection.query(
      'UPDATE organizations SET name = $1, comment = $2 WHERE id = $3',
      [name, comment, id],
    )
    return result.rows[0]
  } catch (err) {
    console.error('Error updating organization:', err)
    throw err
  } finally {
    connection.release()
  }
}
async function deleteOrganization(id) {
  const connection = await pool.connect()
  try {
    const result = await connection.query(
      'DELETE FROM organizations WHERE id = $1',
      [id],
    )
    return result.rows[0]
  } catch (err) {
    console.error('Error deleting organization:', err)
    throw err
  } finally {
    connection.release()
  }
}

module.exports = {
  getOrganizations,
  addOrganization,
  updateOrganization,
  deleteOrganization,
}
