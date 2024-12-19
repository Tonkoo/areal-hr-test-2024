const express = require('express')
const router = express.Router()
const pool = require('../db')
const { StatusCodes } = require('http-status-codes')
const logger = require('../logger/logger')
const multer = require('multer')
const {
  fetching,
  save,
  update,
  dismiss,
  Internal,
  access,
} = require('./../errors/text-errors')
const {
  getEmployees,
  addEmployee,
  updateEmployee,
  dismissEmployee,
  getHistoryEmployees,
} = require('../controllers/employee/employee.controller')
const { addFile } = require('../controllers/employeeFiles/file.controller')
const employeeSchema = require('../controllers/employee/dto/validationd-employees')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.get('/employees', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const employees = await getEmployees()
      return res.json(employees)
    } catch (err) {
      logger.error(`${fetching} employees: ${err.message}`, {
        stack: err.stack,
      })
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: Internal })
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: access })
})

router.get('/employees/history/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const { id } = req.params
      const historyEmployees = await getHistoryEmployees(id)
      return res.json(historyEmployees)
    } catch (err) {
      logger.error(`${fetching} history employees: ${err.message}`, {
        stack: err.stack,
      })
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: Internal })
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: access })
})

router.post('/employees', upload.array('files', 10), async (req, res) => {
  if (req.isAuthenticated()) {
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
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ errors: errorMessages })
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
      return res
        .status(StatusCodes.CREATED)
        .json({ id: employeeId, message: 'Employee added successfully' })
    } catch (err) {
      await connection.query('ROLLBACK')
      logger.error(`${save} employee: ${err.message}`, {
        stack: err.stack,
      })
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: Internal })
    } finally {
      connection.release()
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: access })
})

router.put('/employees/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const { error, value } = employeeSchema.validate(req.body, {
        abortEarly: false,
      })

      if (error) {
        const errorMessages = error.details.reduce((acc, detail) => {
          acc[detail.path[0]] = detail.message
          return acc
        }, {})
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ errors: errorMessages })
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
      return res.json({ message })
    } catch (err) {
      logger.error(`${update} employee: ${err.message}`, {
        stack: err.stack,
      })
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: Internal })
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: access })
})

router.post('/employees/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    const { id } = req.params
    try {
      const message = await dismissEmployee(req, id)
      return res.json({ message })
    } catch (err) {
      logger.error(`${dismiss} organization: ${err.message}`, {
        stack: err.stack,
      })
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: Internal })
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: access })
})

module.exports = router
