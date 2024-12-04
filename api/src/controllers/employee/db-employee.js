const pool = require('../../db')

async function getEmployees() {
  const connection = await pool.connect()
  try {
    const result = await connection.query(
      "SELECT employees.id, employees.last_name, employees.first_name, employees.middle_name, TO_CHAR(employees.date_of_birth, 'yyyy-MM-dd') AS date_of_birth, employees.passport_series, employees.passport_number, regions.id as region_id, regions.name AS region, citys.id as city_id, citys.name AS city, employees.street, employees.house, employees.building, employees.apartment, departments.id as department_id, departments.name AS department_name, positions.id as position_id, positions.name AS position_name, employee_details.salary, employee_details.is_fired as fired FROM employees JOIN regions ON employees.region_id = regions.id JOIN citys ON employees.city_id = citys.id JOIN employee_details on employees.id = employee_details.id join departments on employee_details.department_id = departments.id join positions on employee_details.position_id = positions.id",
    )
    return result.rows
  } catch (err) {
    console.error('Error fetching employees:', err)
    throw err
  } finally {
    connection.release()
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
  const connection = await pool.connect()
  try {
    await connection.query('BEGIN')

    const employeeResult = await connection.query(
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

    await connection.query(
      `INSERT INTO employee_details (id, department_id, position_id, salary, is_fired) 
       VALUES ($1, $2, $3, $4, false)`,
      [employeeId, department_id, position_id, salary],
    )

    await connection.query('COMMIT')
    return employeeId
  } catch (err) {
    await connection.query('ROLLBACK')
    console.error('Error adding employee:', err)
    throw err
  } finally {
    connection.release()
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
  const connection = await pool.connect()
  try {
    await connection.query('BEGIN')

    await connection.query(
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

    await connection.query(
      `UPDATE employee_details 
        SET department_id = $1, 
        position_id = $2, 
        salary = $3 
       WHERE id = $4`,
      [department_id, position_id, salary, id],
    )

    await connection.query('COMMIT')
    return 'Employee data successfully updated'
  } catch (err) {
    await connection.query('ROLLBACK')
    console.error('Error updating employee data:', err)
  } finally {
    connection.release()
  }
}
async function deleteEmployee(id) {
  const connection = await pool.connect()
  try {
    await connection.query(
      `update employee_details
        set is_fired = true
        where id = $1`,
      [id],
    )

    return 'Employee terminated successfully'
  } catch (err) {
    throw new Error('Error when terminating the employee: ' + err.message)
  } finally {
    connection.release()
  }
}

module.exports = {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
}
