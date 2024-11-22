const client = require('../db')

async function getPositions() {
  try {
    const result = await client.query(
      'SELECT positions.id, positions.name as position_name, departments.name as department_name, department_id FROM positions join departments on positions.department_id = departments.id',
    )
    return result.rows
  } catch (err) {
    console.error('Error fetching positions:', err)
    throw err
  }
}
async function addPosition(position_name, department_id) {
  try {
    const result = await client.query(
      `INSERT INTO positions (name, department_id) 
       VALUES ($1, $2) RETURNING *`,
      [position_name, department_id],
    )
    return result.rows[0]
  } catch (err) {
    console.error('Error saving position:', err)
    throw err
  }
}
async function updatePosition(id, position_name, department_id) {
  try {
    const result = await client.query(
      `UPDATE positions 
       SET name = $1, department_id = $2
       WHERE id = $3 RETURNING *`,
      [position_name, department_id, id],
    )
    if (result.rows.length === 0) {
      return { error: 'Position not found' }
    }
    return result.rows[0]
  } catch (err) {
    console.error('Error updating position:', err)
    throw err
  }
}
async function deletePosition(id) {
  try {
    const result = await client.query(
      'DELETE FROM positions WHERE id = $1 RETURNING *',
      [id],
    )

    if (result.rows.length === 0) {
      return { error: 'Position not found' }
    }
    return result.rows[0]
  } catch (err) {
    console.error('Error deleting position:', err)
    throw err
  }
}

module.exports = {
  getPositions,
  addPosition,
  updatePosition,
  deletePosition,
}
