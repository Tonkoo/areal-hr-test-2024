const client = require('../../db')

async function getUsers() {
  try {
    const result = await client.query(
      'SELECT users.id, last_name, first_name, middle_name, login, password, role.name FROM users join role on users.role_id = role.id where role.id = 2',
    )
    return result.rows
  } catch (err) {
    console.error('Error fetching operations:', err)
    throw err
  }
}

module.exports = {
  getUsers,
}
