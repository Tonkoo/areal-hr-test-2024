const client = require('../db')

async function getEmployees() {
  try {
    const result = await client.query(
      "SELECT employees.id, employees.last_name, employees.first_name, employees.middle_name, TO_CHAR(employees.date_of_birth, 'yyyy-MM-dd') AS date_of_birth, employees.passport_series, employees.passport_number, regions.name AS region, citys.name AS city, employees.street, employees.house, employees.building, employees.apartment, departments.name AS department_name, positions.name AS position_name, recent_operations.salary, recent_operations.type_operation_id FROM employees JOIN regions ON employees.region_id = regions.id JOIN citys ON employees.city_id = citys.id JOIN ( SELECT personnel_operations.*, ROW_NUMBER() OVER (PARTITION BY employee_id ORDER BY id DESC) AS row_num FROM personnel_operations) AS recent_operations ON employees.id = recent_operations.employee_id AND recent_operations.row_num = 1 JOIN departments ON recent_operations.department_id = departments.id JOIN positions ON recent_operations.position_id = positions.id;",
    )
    return result.rows
  } catch (err) {
    console.error('Error fetching employees:', err)
    throw err
  }
}

async function addEmployee(
  last_name,
  first_name,
  middle_name,
  date_of_birth,
  passport_series,
  passport_number,
  region_id,
  city_id,
  street,
  house,
  building,
  apartment,
  department_id,
  position_id,
  salary,
) {
  try {
    await client.query('BEGIN')

    const employeeResult = await client.query(
      `INSERT INTO employees (last_name, first_name, middle_name, date_of_birth, passport_series, passport_number, region_id, city_id, street, house, building, apartment) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
      [
        last_name,
        first_name,
        middle_name,
        date_of_birth,
        passport_series,
        passport_number,
        region_id,
        city_id,
        street,
        house,
        building,
        apartment,
      ],
    )

    const employeeId = employeeResult.rows[0].id

    await client.query(
      `INSERT INTO personnel_operations (employee_id, type_operation_id, department_id, position_id, salary) 
       VALUES ($1, 1, $2, $3, $4)`,
      [employeeId, department_id, position_id, salary],
    )

    await client.query('COMMIT')
    return employeeId
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Error adding employee:', err)
    throw err
  }
}
async function updateEmployee(
  id,
  last_name,
  first_name,
  middle_name,
  date_of_birth,
  passport_series,
  passport_number,
  region_id,
  city_id,
  street,
  house,
  building,
  apartment,
  department_id,
  position_id,
  salary,
) {
  try {
    await client.query('BEGIN')

    await client.query(
      `UPDATE employees 
       SET last_name = $1, first_name = $2, middle_name = $3, 
           date_of_birth = $4, passport_series = $5, passport_number = $6, 
           region_id = $7, city_id = $8, street = $9, house = $10, 
           building = $11, apartment = $12
       WHERE id = $13`,
      [
        last_name,
        first_name,
        middle_name,
        date_of_birth,
        passport_series,
        passport_number,
        region_id,
        city_id,
        street,
        house,
        building,
        apartment,
        id,
      ],
    )

    const lastOperationData = await client.query(
      'SELECT * FROM personnel_operations WHERE employee_id = $1 ORDER BY id DESC LIMIT 1',
      [id],
    )
    const lastOperation = lastOperationData.rows[0]

    if (salary !== lastOperation.salary) {
      await client.query(
        `INSERT INTO personnel_operations (employee_id, type_operation_id, department_id, position_id, salary) 
         VALUES ($1, 3, $2, $3, $4)`,
        [id, department_id, position_id, salary],
      )
    }

    if (department_id !== lastOperation.department_id) {
      await client.query(
        `INSERT INTO personnel_operations (employee_id, type_operation_id, department_id, position_id, salary) 
         VALUES ($1, 4, $2, $3, $4)`,
        [id, department_id, position_id, salary],
      )
    }

    if (position_id !== lastOperation.position_id) {
      await client.query(
        `INSERT INTO personnel_operations (employee_id, type_operation_id, department_id, position_id, salary) 
         VALUES ($1, 5, $2, $3, $4)`,
        [id, department_id, position_id, salary],
      )
    }

    await client.query('COMMIT')
    return 'Employee data successfully updated'
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Error updating employee data:', err)
  }
}
async function deleteEmployee(id) {
  try {
    await client.query('BEGIN')

    const lastOperationData = await client.query(
      'SELECT * FROM personnel_operations WHERE employee_id = $1 ORDER BY id DESC LIMIT 1',
      [id],
    )
    const lastOperation = lastOperationData.rows[0]

    await client.query(
      `INSERT INTO personnel_operations (employee_id, type_operation_id, department_id, position_id, salary) 
       VALUES ($1, 2, $2, $3, $4)`,
      [
        id,
        lastOperation.department_id,
        lastOperation.position_id,
        lastOperation.salary,
      ],
    )

    await client.query('COMMIT')
    return 'Employee terminated successfully'
  } catch (err) {
    await client.query('ROLLBACK')
    throw new Error('Error when terminating the employee: ' + err.message)
  }
}

module.exports = {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
}
