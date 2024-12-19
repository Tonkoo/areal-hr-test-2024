const express = require('express')
const router = express.Router()
const { StatusCodes } = require('http-status-codes')
const logger = require('../logger/logger')
const {
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  getHistoryDepartments,
} = require('../controllers/departments/departments.controller')
const {
  fetching,
  save,
  update,
  deleting,
  Internal,
  access,
} = require('./../errors/text-errors')
const departmentSchema = require('../controllers/departments/dto/validationd-departments')

router.get('/departments', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const departments = await getDepartments()
      return res.json(departments)
    } catch (err) {
      logger.error(`${fetching} departments: ${err.message}`, {
        stack: err.stack,
      })
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: Internal })
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: access })
})

router.get('/departments/history/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const { id } = req.params
      const historyDepartments = await getHistoryDepartments(id)
      return res.json(historyDepartments)
    } catch (err) {
      logger.error(`${fetching} history departments: ${err.message}`, {
        stack: err.stack,
      })
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: Internal })
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: access })
})

router.post('/departments', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const { error, value } = departmentSchema.validate(req.body, {
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

      const { name, comment, parent_id, organization_id } = value
      const newDepartment = await addDepartment(
        req,
        name,
        comment,
        parent_id,
        organization_id,
      )
      return res.status(StatusCodes.CREATED).json(newDepartment)
    } catch (err) {
      logger.error(`${save} department: ${err.message}`, {
        stack: err.stack,
      })
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: Internal })
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: access })
})

router.put('/departments/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const { error, value } = departmentSchema.validate(req.body, {
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
      const { name, comment, parent_id, organization_id } = value

      const updatedDepartment = await updateDepartment(
        req,
        id,
        name,
        comment,
        parent_id,
        organization_id,
      )
      return res.status(StatusCodes.CREATED).json(updatedDepartment)
    } catch (err) {
      logger.error(`${update} department: ${err.message}`, {
        stack: err.stack,
      })
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: Internal })
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: access })
})

router.delete('/departments/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    const { id } = req.params
    try {
      const deletedDepartment = await deleteDepartment(id)
      return res.status(StatusCodes.CREATED).json(deletedDepartment)
    } catch (err) {
      logger.error(`${deleting} department: ${err.message}`, {
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
