const pool = require('../../db')
const argon2 = require('argon2')

async function getUsers() {
  const connection = await pool.connect()
  try {
    const result = await connection.query(
      'SELECT users.id, last_name, first_name, middle_name, login, password, role.name FROM users join role on users.role_id = role.id where role.id = 2',
    )
    return result.rows
  } catch (err) {
    console.error('Error fetching users:', err)
    throw err
  } finally {
    connection.release()
  }
}

async function addUser(last_name, first_name, middle_name, login, password) {
  const connection = await pool.connect()
  try {
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
    })
    const result = await connection.query(
      `INSERT INTO users (last_name, first_name, middle_name, login, password, role_id) 
       VALUES ($1, $2, $3, $4, $5, 2) RETURNING *`,
      [last_name, first_name, middle_name, login, hashedPassword],
    )
    return result.rows[0]
  } catch (err) {
    console.error('Error saving user:', err)
    throw err
  } finally {
    connection.release()
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
  const connection = await pool.connect()
  try {
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
    })
    const result = await connection.query(
      `UPDATE users 
       SET last_name = $1, first_name = $2,
       middle_name = $3, login = $4,
       password = $5
       WHERE id = $6 RETURNING *`,
      [last_name, first_name, middle_name, login, hashedPassword, id],
    )
    if (result.rows.length === 0) {
      return { error: 'User not found' }
    }
    return result.rows[0]
  } catch (err) {
    console.error('Error updating user:', err)
    throw err
  } finally {
    connection.release()
  }
}

async function deleteUser(id) {
  const connection = await pool.connect()
  try {
    const result = await connection.query(
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
  } finally {
    connection.release()
  }
}

module.exports = {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
}
