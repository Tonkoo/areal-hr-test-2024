const pool = require('../../db')
const { addHistory } = require('./../history/history.controller')
const logger = require('./../../logger/logger')
const {
  fetching,
  save,
  update,
  deleting,
} = require('./../../errors/text-errors')

async function getDepartments() {
  const connection = await pool.connect()
  try {
    const result = await connection.query(
      'SELECT d.id AS department_id, d.name AS department_name, pd.name AS parent_department_name, pd.id as parent_id,d.comment AS department_comment, o.name AS organization_name, o.id as organization_id FROM departments AS d LEFT JOIN departments AS pd ON d.parent_id = pd.id LEFT JOIN organizations AS o ON d.organization_id = o.id;',
    )
    return result.rows
  } catch (err) {
    logger.error(`${fetching} departments: ${err.message}`, {
      stack: err.stack,
    })
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
    logger.error(`${fetching} history departments: ${err.message}`, {
      stack: err.stack,
    })
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
    const organization = await connection.query(
      'select name from organizations where id = $1',
      [organization_id],
    )

    if (parent_id) {
      query = `INSERT INTO departments (name, comment, parent_id, organization_id) 
               VALUES ($1, $2, $3, $4) RETURNING *`
      values = [name, comment, parent_id, organization_id]
      parent = await connection.query(
        'select name from departments where id = $1',
        [parent_id],
      )
      newValue = `Название: ${name}\nКомментарий: ${comment}\nРодитель: ${parent.rows[0].name}\nОрганизация: ${organization.rows[0].name}`
    } else {
      query = `INSERT INTO departments (name, comment, organization_id) 
               VALUES ($1, $2, $3) RETURNING *`
      values = [name, comment, organization_id]
      newValue = `Название: ${name}\nКомментарий: ${comment}\nОрганизация: ${organization.rows[0].name}`
    }

    const result = await connection.query(query, values)

    const departmentId = result.rows[0].id

    await addHistory(2, departmentId, '', newValue, connection, req)

    await connection.query('COMMIT')
    return result.rows[0]
  } catch (err) {
    await connection.query('ROLLBACK')
    logger.error(`${save} department: ${err.message}`, {
      stack: err.stack,
    })
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
    let newValue = ''
    let oldValue = ''
    const oldDataResult = await connection.query(
      'SELECT d.name AS department_name, pd.name AS parent_department_name,d.comment AS department_comment, o.name AS organization_name FROM departments AS d LEFT JOIN departments AS pd ON d.parent_id = pd.id LEFT JOIN organizations AS o ON d.organization_id = o.id where d.id = $1',
      [id],
    )
    const organization = await connection.query(
      'select name from organizations where id = $1',
      [organization_id],
    )

    if (oldDataResult.rows[0].department_name != name) {
      oldValue += `Название: ${oldDataResult.rows[0].department_name}\n`
      newValue += `Название: ${name}\n`
    }
    if (oldDataResult.rows[0].department_comment != comment) {
      oldValue += `Комментарий: ${oldDataResult.rows[0].department_comment}\n`
      newValue += `Комментарий: ${comment}\n`
    }

    if (parent_id) {
      query = `UPDATE departments 
               SET name = $1, comment = $2, parent_id = $3, organization_id = $4
               WHERE id = $5 RETURNING *`
      values = [name, comment, parent_id, organization_id, id]
      parent = await connection.query(
        'select name from departments where id = $1',
        [parent_id],
      )
      if (oldDataResult.rows[0].parent_department_name != parent.rows[0].name) {
        oldValue += `Родитель: ${oldDataResult.rows[0].parent_department_name}\n`
        newValue += `Родитель: ${parent.rows[0].name}\n`
      }
    } else {
      query = `UPDATE departments 
               SET name = $1, comment = $2, parent_id = NULL, organization_id = $3
               WHERE id = $4 RETURNING *`
      values = [name, comment, organization_id, id]
    }
    if (oldDataResult.rows[0].organization_name != organization.rows[0].name) {
      oldValue += `Организация: ${oldDataResult.rows[0].organization_name}\n`
      newValue += `Организация: ${organization.rows[0].name}\n`
    }
    const result = await connection.query(query, values)

    await connection.query(
      `UPDATE departments
      SET organization_id = $1
      WHERE parent_id = $2
      RETURNING *`,
      [organization_id, id],
    )

    await addHistory(2, id, oldValue, newValue, connection, req)

    await connection.query('COMMIT')
    return result.rows[0]
  } catch (err) {
    await connection.query('ROLLBACK')
    logger.error(`${update} department: ${err.message}`, {
      stack: err.stack,
    })
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
    logger.error(`${deleting} department: ${err.message}`, {
      stack: err.stack,
    })
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
