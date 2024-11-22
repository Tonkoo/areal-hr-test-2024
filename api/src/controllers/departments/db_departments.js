const client = require('../../db')

async function getDepartments() {
  try {
    const result = await client.query(
      'SELECT d.id AS department_id, d.name AS department_name, pd.name AS parent_department_name, d.comment AS department_comment, o.name AS organization_name FROM departments AS d LEFT JOIN departments AS pd ON d.parent_id = pd.id  LEFT JOIN organizations AS o ON d.organization_id = o.id ORDER BY o.name, d.id;',
    )
    return result.rows
  } catch (err) {
    console.error('Error fetching departments:', err)
    throw err
  }
}

async function addDepartment(name, comment, parent_id, organization_id) {
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

    const result = await client.query(query, values)
    return result.rows[0]
  } catch (err) {
    console.error('Error adding department:', err)
    throw err
  }
}

async function updateDepartment(id, name, comment, parent_id, organization_id) {
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

    const result = await client.query(query, values)
    const updatedDepartment = result.rows[0]
    const updateSubDepartmentsQuery = `
    UPDATE departments
    SET organization_id = $1
    WHERE parent_id = $2
    RETURNING *`
    await client.query(updateSubDepartmentsQuery, [organization_id, id])

    return updatedDepartment
  } catch (err) {
    console.error('Error updating department:', err)
    throw err
  }
}

async function deleteDepartment(id) {
  try {
    const result = await client.query(
      'DELETE FROM departments WHERE id = $1 RETURNING *',
      [id],
    )
    return result.rows[0]
  } catch (err) {
    console.error('Error deleting department:', err)
    throw err
  }
}

module.exports = {
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
}
