const pool = require('../../db')

async function getDepartments() {
  const connection = await pool.connect()
  try {
    const result = await connection.query(
      'SELECT d.id AS department_id, d.name AS department_name, pd.name AS parent_department_name, pd.id as parent_id,d.comment AS department_comment, o.name AS organization_name, o.id as organization_id FROM departments AS d LEFT JOIN departments AS pd ON d.parent_id = pd.id LEFT JOIN organizations AS o ON d.organization_id = o.id;',
    )
    return result.rows
  } catch (err) {
    console.error('Error fetching departments:', err)
    throw err
  } finally {
    connection.release()
  }
}

async function getHistoryDepartments(id) {
  const connection = await pool.connect()
  try {
    const result = await connection.query(
      `SELECT history_change.id, to_char(datetime_operations, 'YYYY-MM-DD HH24:MI:SS') as datetime_operations, (users.last_name || ' ' || LEFT(users.first_name, 1) || '. ' || left(users.middle_name, 1) || '.') as full_name, old_value, new_value FROM history_change join users on history_change.author = users.id where object_operations_id =2 and record_id = $1`,
      [id],
    )
    return result.rows
  } catch (err) {
    console.error('Error fetching history departments:', err)
    throw err
  } finally {
    connection.release()
  }
}

async function addDepartment(req, name, comment, parent_id, organization_id) {
  const connection = await pool.connect()
  try {
    await connection.query('BEGIN')
    let query
    let values
    let newValue
    let parent
    let organization

    if (parent_id) {
      query = `INSERT INTO departments (name, comment, parent_id, organization_id) 
               VALUES ($1, $2, $3, $4) RETURNING *`
      values = [name, comment, parent_id, organization_id]
      parent = await connection.query(
        'select name from departments where id = $1',
        [parent_id],
      )
      organization = await connection.query(
        'select name from organizations where id = $1',
        [organization_id],
      )
      newValue = `Название: ${name}\nКомментарий: ${comment}\nРодитель: ${parent.rows[0].name}\nОрганизация: ${organization.rows[0].name}`
    } else {
      query = `INSERT INTO departments (name, comment, organization_id) 
               VALUES ($1, $2, $3) RETURNING *`
      values = [name, comment, organization_id]
      organization = await connection.query(
        'select name from organizations where id = $1',
        [organization_id],
      )
      newValue = `Название: ${name}\nКомментарий: ${comment}\nОрганизация: ${organization.rows[0].name}`
    }

    const result = await connection.query(query, values)

    const departmentId = result.rows[0].id
    const userId = req.user.id

    const currentDate = new Date()
    const formattedDateTime = currentDate.toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })

    await connection.query(
      `INSERT INTO history_change (datetime_operations, author, object_operations_id, record_id, new_value) 
       VALUES ($1, $2, 2, $3, $4)`,
      [formattedDateTime, userId, departmentId, newValue],
    )
    await connection.query('COMMIT')
    return result.rows[0]
  } catch (err) {
    await connection.query('ROLLBACK')
    console.error('Error adding department:', err)
    throw err
  } finally {
    connection.release()
  }
}

async function updateDepartment(
  req,
  id,
  name,
  comment,
  parent_id,
  organization_id,
) {
  const connection = await pool.connect()
  try {
    await connection.query('BEGIN')
    let query
    let values
    let parent
    let organization
    let newValue
    let oldValue
    const oldDataResult = await connection.query(
      'SELECT d.name AS department_name, pd.name AS parent_department_name,d.comment AS department_comment, o.name AS organization_name FROM departments AS d LEFT JOIN departments AS pd ON d.parent_id = pd.id LEFT JOIN organizations AS o ON d.organization_id = o.id where d.id = $1',
      [id],
    )

    if (parent_id) {
      query = `UPDATE departments 
               SET name = $1, comment = $2, parent_id = $3, organization_id = $4
               WHERE id = $5 RETURNING *`
      values = [name, comment, parent_id, organization_id, id]
      parent = await connection.query(
        'select name from departments where id = $1',
        [parent_id],
      )
      organization = await connection.query(
        'select name from organizations where id = $1',
        [organization_id],
      )
      oldValue = `Название: ${oldDataResult.rows[0].department_name}\nКомментарий: ${oldDataResult.rows[0].department_comment}\nРодитель: ${oldDataResult.rows[0].parent_department_name}\nОрганизация: ${oldDataResult.rows[0].organization_name}`
      newValue = `Название: ${name}\nКомментарий: ${comment}\nРодитель: ${parent.rows[0].name}\nОрганизация: ${organization.rows[0].name}`
    } else {
      query = `UPDATE departments 
               SET name = $1, comment = $2, parent_id = NULL, organization_id = $3
               WHERE id = $4 RETURNING *`
      values = [name, comment, organization_id, id]
      organization = await connection.query(
        'select name from organizations where id = $1',
        [organization_id],
      )
      oldValue = `Название: ${oldDataResult.rows[0].department_name}\nКомментарий: ${oldDataResult.rows[0].department_comment}\nОрганизация: ${oldDataResult.rows[0].organization_name}`
      newValue = `Название: ${name}\nКомментарий: ${comment}\nОрганизация: ${organization.rows[0].name}`
    }
    const result = await connection.query(query, values)

    await connection.query(
      `UPDATE departments
      SET organization_id = $1
      WHERE parent_id = $2
      RETURNING *`,
      [organization_id, id],
    )

    const userId = req.user.id

    const currentDate = new Date()
    const formattedDateTime = currentDate.toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })

    await connection.query(
      `INSERT INTO history_change (datetime_operations, author, object_operations_id, record_id, old_value, new_value) 
       VALUES ($1, $2, 2, $3, $4, $5)`,
      [formattedDateTime, userId, id, oldValue, newValue],
    )

    await connection.query('COMMIT')
    return result.rows[0]
  } catch (err) {
    await connection.query('ROLLBACK')
    console.error('Error updating department:', err)
    throw err
  } finally {
    connection.release()
  }
}

async function deleteDepartment(id) {
  const connection = await pool.connect()
  try {
    await connection.query('BEGIN')
    const result = await connection.query(
      'DELETE FROM departments WHERE id = $1 RETURNING *',
      [id],
    )

    await connection.query(
      `DELETE FROM history_change WHERE record_id = $1 and object_operations_id = 2`,
      [id],
    )

    await connection.query('COMMIT')
    return result.rows[0]
  } catch (err) {
    await connection.query('ROLLBACK')
    console.error('Error deleting department:', err)
    throw err
  } finally {
    connection.release()
  }
}

module.exports = {
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  getHistoryDepartments,
}
