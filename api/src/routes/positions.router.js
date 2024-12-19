const express = require('express')
const router = express.Router()
const { StatusCodes } = require('http-status-codes')
const logger = require('../logger/logger')
const positionSchema = require('../controllers/positions/dto/validation-positions')
const {
  fetching,
  save,
  update,
  deleting,
  Internal,
  access,
} = require('./../errors/text-errors')
const {
  getPositions,
  addPosition,
  updatePosition,
  deletePosition,
} = require('../controllers/positions/positions.controller')
const {
  getHistorRecord,
} = require('./../controllers/history/history.controller')

router.get('/positions', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const positions = await getPositions()
      return res.json(positions)
    } catch (err) {
      logger.error(`${fetching} positions: ${err.message}`, {
        stack: err.stack,
      })
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: Internal })
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: access })
})

router.get('/positions/history/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const { id } = req.params
      const historyPositions = await getHistorRecord(3, id)
      return res.json(historyPositions)
    } catch (err) {
      logger.error(`${fetching} history positions: ${err.message}`, {
        stack: err.stack,
      })
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: Internal })
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: access })
})

router.post('/positions', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const { error, value } = positionSchema.validate(req.body, {
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
      const { name, department_id } = value
      const newPosition = await addPosition(req, name, department_id)
      return res.status(StatusCodes.CREATED).json(newPosition)
    } catch (err) {
      logger.error(`${save} position: ${err.message}`, {
        stack: err.stack,
      })
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: Internal })
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: access })
})

router.put('/positions/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const { error, value } = positionSchema.validate(req.body, {
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
      const { name, department_id } = value
      const updatedPosition = await updatePosition(req, id, name, department_id)
      return res.status(StatusCodes.CREATED).json(updatedPosition)
    } catch (err) {
      logger.error(`${update} position: ${err.message}`, {
        stack: err.stack,
      })
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: Internal })
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: access })
})

router.delete('/positions/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    const { id } = req.params

    try {
      const deltedPosition = await deletePosition(id)
      return res.status(StatusCodes.CREATED).json(deltedPosition)
    } catch (err) {
      logger.error(`${deleting} position: ${err.message}`, {
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
