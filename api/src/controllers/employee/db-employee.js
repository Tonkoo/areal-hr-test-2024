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

async function getHistoryEmployees(id) {
  const connection = await pool.connect()
  try {
    const result = await connection.query(
      `SELECT history_change.id, to_char(datetime_operations, 'YYYY-MM-DD HH24:MI:SS') as datetime_operations, (users.last_name || ' ' || LEFT(users.first_name, 1) || '. ' || left(users.middle_name, 1) || '.') as full_name, old_value, new_value FROM history_change join users on history_change.author = users.id where object_operations_id =4 and record_id = $1`,
      [id],
    )
    return result.rows
  } catch (err) {
    console.error('Error fetching history positions:', err)
    throw err
  } finally {
    connection.release()
  }
}

async function addEmployee(
  req,
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

    const userId = req.user.id
    const region = await connection.query(
      'select name from regions where id=$1',
      [region_id],
    )
    const city = await connection.query('select name from citys where id=$1', [
      region_id,
    ])
    const department = await connection.query(
      'select name from departments where id=$1',
      [department_id],
    )
    const position = await connection.query(
      'select name from positions where id=$1',
      [department_id],
    )
    const formatteddate_of_birth = date_of_birth.toISOString().split('T')[0]
    const newValue = `Фамилия: ${last_name}\nИмя: ${first_name}\nОтчество: ${middle_name}\nДата рождения: ${formatteddate_of_birth}\nСерия: ${passport_series}\nНомер паспорта: ${passport_number}\nРегион: ${region.rows[0].name}\nГород: ${city.rows[0].name}\nУлица: ${street}\nДом: ${house}\nКорпус: ${building}\nКвартира: ${apartment}\nОтдел: ${department.rows[0].name}\nДолжность: ${position.rows[0].name}\nЗарплата: $${salary}.00\nСтатус: Работает`

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
       VALUES ($1, $2, 4, $3, $4)`,
      [formattedDateTime, userId, employeeId, newValue],
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
  req,
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

    const oldDataResult = await connection.query(
      "SELECT employees.last_name, employees.first_name, employees.middle_name, TO_CHAR(employees.date_of_birth, 'yyyy-MM-dd') AS date_of_birth, employees.passport_series, employees.passport_number,  regions.name AS region, citys.name AS city, employees.street, employees.house, employees.building, employees.apartment, departments.name AS department_name, positions.name AS position_name, employee_details.salary, employee_details.is_fired as fired FROM employees JOIN regions ON employees.region_id = regions.id JOIN citys ON employees.city_id = citys.id JOIN employee_details on employees.id = employee_details.id join departments on employee_details.department_id = departments.id join positions on employee_details.position_id = positions.id where employees.id = $1",
      [id],
    )

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

    const userId = req.user.id
    const region = await connection.query(
      'select name from regions where id=$1',
      [region_id],
    )
    const city = await connection.query('select name from citys where id=$1', [
      region_id,
    ])
    const department = await connection.query(
      'select name from departments where id=$1',
      [department_id],
    )
    const position = await connection.query(
      'select name from positions where id=$1',
      [department_id],
    )
    const formatteddate_of_birth = date_of_birth.toISOString().split('T')[0]

    const fired = oldDataResult.rows[0].fired ? 'Уволен' : 'Работает'

    const oldValue = `Фамилия: ${oldDataResult.rows[0].last_name}\nИмя: ${oldDataResult.rows[0].first_name}\nОтчество: ${oldDataResult.rows[0].middle_name}\nДата рождения: ${oldDataResult.rows[0].date_of_birth}\nСерия: ${oldDataResult.rows[0].passport_series}\nНомер паспорта: ${oldDataResult.rows[0].passport_number}\nРегион: ${oldDataResult.rows[0].region}\nГород: ${oldDataResult.rows[0].city}\nУлица: ${oldDataResult.rows[0].street}\nДом: ${oldDataResult.rows[0].house}\nКорпус: ${oldDataResult.rows[0].building}\nКвартира: ${oldDataResult.rows[0].apartment}\nОтдел: ${oldDataResult.rows[0].department_name}\nДолжность: ${oldDataResult.rows[0].position_name}\nЗарплата: ${oldDataResult.rows[0].salary}\nСтатус: ${fired}`

    const newValue = `Фамилия: ${last_name}\nИмя: ${first_name}\nОтчество: ${middle_name}\nДата рождения: ${formatteddate_of_birth}\nСерия: ${passport_series}\nНомер паспорта: ${passport_number}\nРегион: ${region.rows[0].name}\nГород: ${city.rows[0].name}\nУлица: ${street}\nДом: ${house}\nКорпус: ${building}\nКвартира: ${apartment}\nОтдел: ${department.rows[0].name}\nДолжность: ${position.rows[0].name}\nЗарплата: $${salary}.00\nСтатус: Работает`

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
      `INSERT INTO history_change (datetime_operations, author, object_operations_id, record_id, old_value ,new_value) 
       VALUES ($1, $2, 4, $3, $4, $5)`,
      [formattedDateTime, userId, id, oldValue, newValue],
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
async function deleteEmployee(req, id) {
  const connection = await pool.connect()
  try {
    await connection.query('BEGIN')

    const oldDataResult = await connection.query(
      'SELECT is_fired as fired FROM employee_details where id = $1',
      [id],
    )

    await connection.query(
      `update employee_details
        set is_fired = true
        where id = $1`,
      [id],
    )

    const userId = req.user.id

    const fired = oldDataResult.rows[0].fired ? 'Уволен' : 'Работает'

    const oldValue = `Статус: ${fired}`

    const newValue = `Статус: Уволен`

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
      `INSERT INTO history_change (datetime_operations, author, object_operations_id, record_id, old_value ,new_value) 
       VALUES ($1, $2, 4, $3, $4, $5)`,
      [formattedDateTime, userId, id, oldValue, newValue],
    )

    await connection.query('COMMIT')
    return 'Employee terminated successfully'
  } catch (err) {
    await connection.query('ROLLBACK')
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
  getHistoryEmployees,
}
