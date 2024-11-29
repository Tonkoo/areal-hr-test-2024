const pool = require('../../db')

async function getUserByLogin(login) {
  const connection = await pool.connect()
  try {
    const query = `
    SELECT 
      users.id, last_name, first_name, middle_name, 
      password, role.name AS role_name
    FROM users 
    JOIN role  ON users.role_id = role.id
    WHERE login = $1
  `
    const result = await pool.query(query, [login])
    return result.rows[0]
  } catch (err) {
    console.error('Error fetching users:', err)
    throw err
  } finally {
    connection.release()
  }
}
async function getUserById(id) {
  const connection = await pool.connect()
  try {
    const query = `
    SELECT 
      users.id, last_name, first_name, middle_name, role.name AS role_name
    FROM users
    JOIN role ON users.role_id = role.id
    WHERE users.id = $1
  `
    const result = await pool.query(query, [id])
    return result.rows[0]
  } catch (err) {
    console.error('Error fetching users:', err)
    throw err
  } finally {
    connection.release()
  }
}

module.exports = { getUserByLogin, getUserById }
