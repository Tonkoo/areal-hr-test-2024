const express = require('express')
const router = express.Router()
const {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employee/db_employee')

router.get('/employees', async (req, res) => {
  try {
    const employees = await getEmployees()
    res.json(employees)
  } catch (err) {
    console.error('Error fetching employees:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/employees', async (req, res) => {
  const {
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
  } = req.body

  if (
    !last_name ||
    !first_name ||
    !middle_name ||
    !date_of_birth ||
    !passport_series ||
    !passport_number ||
    !region_id ||
    !city_id ||
    !street ||
    !house ||
    !building ||
    !apartment ||
    !department_id ||
    !position_id ||
    !salary
  ) {
    return res.status(400).json({ error: 'All fields must be filled' })
  }

  try {
    const employeeId = await addEmployee(
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
    )
    res
      .status(201)
      .json({ id: employeeId, message: 'Employee added successfully' })
  } catch (err) {
    console.error('Error adding employee:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.put('/employees/:id', async (req, res) => {
  const { id } = req.params
  const {
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
  } = req.body

  try {
    const message = await updateEmployee(
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
    )
    res.json({ message })
  } catch (err) {
    console.error('Error updating employee data:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/employees/:id', async (req, res) => {
  const { id } = req.params

  try {
    const message = await deleteEmployee(id)
    res.json({ message })
  } catch (err) {
    console.error('Error when terminating the employee:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
