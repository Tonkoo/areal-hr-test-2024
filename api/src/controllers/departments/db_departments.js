const pool = require('../../db')

async function getDepartments() {
  const connection = await pool.connect()
  try {
    const result = await connection.query(
      'SELECT d.id AS department_id, d.name AS department_name, pd.name AS parent_department_name, pd.id as parent_id,d.comment AS department_comment, o.name AS organization_name, o.id as organization_id FROM departments AS d LEFT JOIN departments AS pd ON d.parent_id = pd.id LEFT JOIN organizations AS o ON d.organization_id = o.id ORDER BY o.name, d.id;',
    )
    return result.rows
  } catch (err) {
    console.error('Error fetching departments:', err)
    throw err
  } finally {
    connection.release()
  }
}

async function addDepartment(name, comment, parent_id, organization_id) {
  const connection = await pool.connect()
  try {
    let query
    let values

    if (parent_id) {
      query = `INSERT INTO departments (name, comment, parent_id, organization_id) 
               VALUES ($1, $2, $3, $4) RETURNING *`
      values = [name, comment, parent_id, organization_id]
    } else {
      query = `INSERT INTO departments (name, comment, organization_id) 
               VALUES ($1, $2, $3) RETURNING *`
      values = [name, comment, organization_id]
    }

    const result = await connection.query(query, values)
    return result.rows[0]
  } catch (err) {
    console.error('Error adding department:', err)
    throw err
  } finally {
    connection.release()
  }
}

async function updateDepartment(id, name, comment, parent_id, organization_id) {
  const connection = await pool.connect()
  try {
    let query
    let values

    if (parent_id) {
      query = `UPDATE departments 
               SET name = $1, comment = $2, parent_id = $3, organization_id = $4
               WHERE id = $5 RETURNING *`
      values = [name, comment, parent_id, organization_id, id]
    } else {
      query = `UPDATE departments 
               SET name = $1, comment = $2, parent_id = NULL, organization_id = $3
               WHERE id = $4 RETURNING *`
      values = [name, comment, organization_id, id]
    }
    await connection.query('BEGIN')
    const result = await connection.query(query, values)
    const updatedDepartment = result.rows[0]
    const updateSubDepartmentsQuery = `
      UPDATE departments
      SET organization_id = $1
      WHERE parent_id = $2
      RETURNING *`
    await connection.query(updateSubDepartmentsQuery, [organization_id, id])
    await connection.query('COMMIT')
    return updatedDepartment
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
    const result = await connection.query(
      'DELETE FROM departments WHERE id = $1 RETURNING *',
      [id],
    )
    return result.rows[0]
  } catch (err) {
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
}
