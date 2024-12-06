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

async function getHistoryUsers(id) {
  const connection = await pool.connect()
  try {
    const result = await connection.query(
      `SELECT history_change.id, to_char(datetime_operations, 'YYYY-MM-DD HH24:MI:SS') as datetime_operations, (users.last_name || ' ' || LEFT(users.first_name, 1) || '. ' || left(users.middle_name, 1) || '.') as full_name, old_value, new_value FROM history_change join users on history_change.author = users.id where object_operations_id =5 and record_id = $1`,
      [id],
    )
    return result.rows
  } catch (err) {
    console.error('Error fetching history users:', err)
    throw err
  } finally {
    connection.release()
  }
}

async function addHistory(record_id, oldValue, newValue, connection, req) {
  try {
    const currentDate = new Date()
    const datetime_operations = currentDate.toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    const author = req.user.id
    await connection.query(
      `INSERT INTO history_change (datetime_operations, author, object_operations_id, record_id, old_value, new_value) 
       VALUES ($1, $2, 5, $3, $4, $5)`,
      [datetime_operations, author, record_id, oldValue, newValue],
    )
  } catch (err) {
    console.error('Error saving history:', err)
  }
}

async function addUser(
  req,
  last_name,
  first_name,
  middle_name,
  login,
  password,
) {
  const connection = await pool.connect()
  try {
    await connection.query('BEGIN')
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
    })
    const result = await connection.query(
      `INSERT INTO users (last_name, first_name, middle_name, login, password, role_id) 
       VALUES ($1, $2, $3, $4, $5, 2) RETURNING *`,
      [last_name, first_name, middle_name, login, hashedPassword],
    )

    const Id = result.rows[0].id
    const newValue = `Фамилия: ${last_name}\nИмя: ${first_name}\nОтчество: ${middle_name}\nЛогин: ${login}`

    await addHistory(Id, '', newValue, connection, req)

    await connection.query('COMMIT')
    return result.rows[0]
  } catch (err) {
    await connection.query('ROLLBACK')
    console.error('Error saving user:', err)
    throw err
  } finally {
    connection.release()
  }
}

async function updateUser(
  req,
  id,
  last_name,
  first_name,
  middle_name,
  login,
  password,
  isResetPassword,
) {
  const connection = await pool.connect()
  try {
    let hashedPassword
    let query
    let values
    let newValue
    let oldValue
    await connection.query('BEGIN')
    const oldDataResult = await connection.query(
      'SELECT last_name, first_name, middle_name, login, role.name FROM users join role on users.role_id = role.id where users.id = $1',
      [id],
    )

    if (isResetPassword == 'true') {
      hashedPassword = await argon2.hash(password, {
        type: argon2.argon2id,
      })
      query = `UPDATE users 
       SET last_name = $1, first_name = $2,
       middle_name = $3, login = $4,
       password = $5
       WHERE id = $6 RETURNING *`
      values = [last_name, first_name, middle_name, login, hashedPassword, id]
      newValue = `Пароль: изменен`
    } else {
      query = `UPDATE users 
      SET last_name = $1, first_name = $2,
      middle_name = $3, login = $4
      WHERE id = $5 RETURNING *`
      values = [last_name, first_name, middle_name, login, id]
      oldValue = `Фамилия: ${oldDataResult.rows[0].last_name}\nИмя: ${oldDataResult.rows[0].first_name}\nОтчество: ${oldDataResult.rows[0].middle_name}\nЛогин: ${oldDataResult.rows[0].login}`
      newValue = `Фамилия: ${last_name}\nИмя: ${first_name}\nОтчество: ${middle_name}\nЛогин: ${login}`
    }

    const result = await connection.query(query, values)
    if (result.rows.length === 0) {
      return { error: 'User not found' }
    }

    await addHistory(id, oldValue, newValue, connection, req)

    await connection.query('COMMIT')
    return result.rows[0]
  } catch (err) {
    await connection.query('ROLLBACK')
    console.error('Error updating user:', err)
    throw err
  } finally {
    connection.release()
  }
}

async function deletedUser(id) {
  const connection = await pool.connect()
  try {
    await connection.query('BEGIN')
    const result = await connection.query(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [id],
    )

    if (result.rows.length === 0) {
      return { error: 'User not found' }
    }

    await connection.query(
      `DELETE FROM history_change WHERE record_id = $1 and object_operations_id = 5`,
      [id],
    )
    await connection.query('COMMIT')
    return result.rows[0]
  } catch (err) {
    await connection.query('ROLLBACK')
    console.error('Error deleting user:', err)
    throw err
  } finally {
    connection.release()
  }
}

async function updateRole(req, id) {
  const connection = await pool.connect()
  try {
    await connection.query('BEGIN')
    const oldDataResult = await connection.query(
      'SELECT role.name as role_name FROM users join role on users.role_id = role.id where users.id = $1',
      [id],
    )
    const result = await connection.query(
      'update users set role_id = 1 where id = $1 RETURNING *',
      [id],
    )

    const oldValue = `Роль: ${oldDataResult.rows[0].role_name}`
    const newValue = `Роль: Администратор`

    await addHistory(id, oldValue, newValue, connection, req)

    await connection.query('COMMIT')
    return result.rows[0]
  } catch (err) {
    await connection.query('ROLLBACK')
    console.error('Error updating user:', err)
  } finally {
    connection.release()
  }
}

module.exports = {
  getUsers,
  addUser,
  updateUser,
  deletedUser,
  updateRole,
  getHistoryUsers,
}
