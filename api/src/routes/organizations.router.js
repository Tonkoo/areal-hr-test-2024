const express = require('express')
const { StatusCodes } = require('http-status-codes')
const logger = require('../logger/logger')
const router = express.Router()
const {
  fetching,
  save,
  update,
  deleting,
  Internal,
  access,
} = require('./../errors/text-errors')
const {
  organizationSchema,
} = require('../controllers/organizations/dto/validation-organizations')
const {
  getOrganizations,
  addOrganization,
  updateOrganization,
  deleteOrganization,
} = require('../controllers/organizations/organizations.controller')
const {
  getHistorRecord,
} = require('./../controllers/history/history.controller')

router.get('/organizations', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const organizations = await getOrganizations()
      return res.json(organizations)
    } catch (err) {
      logger.error(`${fetching} organizations: ${err.message}`, {
        stack: err.stack,
      })
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: Internal })
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: access })
})

router.get('/organizations/history/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const { id } = req.params
      const historyOrganizations = await getHistorRecord(1, id)
      return res.json(historyOrganizations)
    } catch (err) {
      logger.error(`${fetching} history organizations: ${err.message}`, {
        stack: err.stack,
      })
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: Internal })
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: access })
})

router.post('/organizations', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const { error, value } = organizationSchema.validate(req.body, {
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

      const { name, comment } = value

      const newOrganization = await addOrganization(req, name, comment)

      return res.status(StatusCodes.CREATED).json(newOrganization)
    } catch (err) {
      logger.error(`${save} organization: ${err.message}`, {
        stack: err.stack,
      })
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: Internal })
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: access })
})

router.put('/organizations/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const { error, value } = organizationSchema.validate(req.body, {
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
      const { name, comment } = value

      const updatedOrganizations = await updateOrganization(
        req,
        id,
        name,
        comment,
      )
      return res.status(StatusCodes.CREATED).json(updatedOrganizations)
    } catch (err) {
      logger.error(`${update} organization: ${err.message}`, {
        stack: err.stack,
      })
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: Internal })
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: access })
})

router.delete('/organizations/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    const { id } = req.params
    try {
      const deltedOrganizations = await deleteOrganization(id)
      return res.status(StatusCodes.CREATED).json(deltedOrganizations)
    } catch (err) {
      logger.error(`${deleting} organization: ${err.message}`, {
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
