const express = require('express')
const router = express.Router()
const pool = require('../db')
const multer = require('multer')
const {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  getHistoryEmployees,
} = require('../controllers/employee/db-employee')
const { addFile } = require('../controllers/employeeFiles/db-file')
const employeeSchema = require('../controllers/employee/dto/validationd-employees')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.get('/employees', async (req, res) => {
  try {
    const employees = await getEmployees()
    res.json(employees)
  } catch (err) {
    console.error('Error fetching employees:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/employees/history/:id', async (req, res) => {
  try {
    const { id } = req.params
    const historyEmployees = await getHistoryEmployees(id)
    res.json(historyEmployees)
  } catch (err) {
    console.error('Error fetching history employees:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/employees', upload.array('files', 10), async (req, res) => {
  const connection = await pool.connect()
  try {
    const { error, value } = employeeSchema.validate(req.body, {
      abortEarly: false,
    })

    if (error) {
      const errorMessages = error.details.reduce((acc, detail) => {
        acc[detail.path[0]] = detail.message
        return acc
      }, {})
      return res.status(400).json({ errors: errorMessages })
    }

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
    } = value
    await connection.query('BEGIN')
    const employeeId = await addEmployee(
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
    )
    for (let file of req.files) {
      await addFile(req, employeeId, file, connection)
    }
    await connection.query('COMMIT')
    res
      .status(201)
      .json({ id: employeeId, message: 'Employee added successfully' })
  } catch (err) {
    await connection.query('ROLLBACK')
    console.error('Error adding employee:', err)
    res.status(500).json({ error: 'Internal server error' })
  } finally {
    connection.release()
  }
})

router.put('/employees/:id', async (req, res) => {
  try {
    const { error, value } = employeeSchema.validate(req.body, {
      abortEarly: false,
    })

    if (error) {
      const errorMessages = error.details.reduce((acc, detail) => {
        acc[detail.path[0]] = detail.message
        return acc
      }, {})
      return res.status(400).json({ errors: errorMessages })
    }

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
    } = value
    const message = await updateEmployee(
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
    const message = await deleteEmployee(req, id)
    res.json({ message })
  } catch (err) {
    console.error('Error when terminating the employee:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
