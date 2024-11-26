const client = require('../../db')

async function getUsers() {
  try {
    const result = await client.query(
      'SELECT users.id, last_name, first_name, middle_name, login, password, role.name FROM users join role on users.role_id = role.id where role.id = 2',
    )
    return result.rows
  } catch (err) {
    console.error('Error fetching users:', err)
    throw err
  }
}

async function addUser(last_name, first_name, middle_name, login, password) {
  try {
    const result = await client.query(
      `INSERT INTO users (last_name, first_name, middle_name, login, password, role_id) 
       VALUES ($1, $2, $3, $4, $5, 2) RETURNING *`,
      [last_name, first_name, middle_name, login, password],
    )
    return result.rows[0]
  } catch (err) {
    console.error('Error saving user:', err)
    throw err
  }
}

async function updateUser(
  id,
  last_name,
  first_name,
  middle_name,
  login,
  password,
) {
  try {
    const result = await client.query(
      `UPDATE users 
       SET last_name = $1, first_name = $2,
       middle_name = $3, login = $4,
       password = $5
       WHERE id = $6 RETURNING *`,
      [last_name, first_name, middle_name, login, password, id],
    )
    if (result.rows.length === 0) {
      return { error: 'User not found' }
    }
    return result.rows[0]
  } catch (err) {
    console.error('Error updating user:', err)
    throw err
  }
}

async function deleteUser(id) {
  try {
    const result = await client.query(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [id],
    )

    if (result.rows.length === 0) {
      return { error: 'User not found' }
    }
    return result.rows[0]
  } catch (err) {
    console.error('Error deleting user:', err)
    throw err
  }
}

module.exports = {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
}
