const express = require('express')
const router = express.Router()
const { StatusCodes } = require('http-status-codes')
const logger = require('../logger/logger')
const {
  getUsers,
  addUser,
  updateUser,
  deletedUser,
  updateRole,
  getHistoryUsers,
} = require('../controllers/users/users.controller')
const {
  fetching,
  save,
  update,
  deleting,
  Internal,
  access,
} = require('./../errors/text-errors')
const {
  UsersSchema,
  AlternativeUsersSchema,
} = require('../controllers/users/dto/validation-users')

router.get('/users', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const users = await getUsers()
      return res.json(users)
    } catch (err) {
      logger.error(`${fetching} users: ${err.message}`, {
        stack: err.stack,
      })
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: Internal })
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: access })
})

router.get('/users/history/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const { id } = req.params
      const historyUsers = await getHistoryUsers(id)
      return res.json(historyUsers)
    } catch (err) {
      logger.error(`${fetching} history users: ${err.message}`, {
        stack: err.stack,
      })
      // console.error('Error fetching history users:', err)
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: Internal })
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: access })
})

router.post('/users', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const { error, value } = UsersSchema.validate(req.body, {
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
      const { last_name, first_name, middle_name, login, password } = value
      const newUser = await addUser(
        req,
        last_name,
        first_name,
        middle_name,
        login,
        password,
      )
      return res.status(StatusCodes.CREATED).json(newUser)
    } catch (err) {
      logger.error(`${save} user: ${err.message}`, {
        stack: err.stack,
      })
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: Internal })
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: access })
})

router.put('/users/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const isResetPassword = req.query.isResetPassword
      let validationSchema = UsersSchema
      if (isResetPassword == 'false') {
        validationSchema = AlternativeUsersSchema
      }

      const { error, value } = validationSchema.validate(req.body, {
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
      const { last_name, first_name, middle_name, login, password } = value

      const updatedUser = await updateUser(
        req,
        id,
        last_name,
        first_name,
        middle_name,
        login,
        password,
        isResetPassword,
      )
      return res.status(StatusCodes.CREATED).json(updatedUser)
    } catch (err) {
      logger.error(`${update} user: ${err.message}`, {
        stack: err.stack,
      })
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: Internal })
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: access })
})

router.delete('/users/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    const { id } = req.params

    try {
      const deltedUser = await deletedUser(id)
      return res.status(StatusCodes.CREATED).json(deltedUser)
    } catch (err) {
      logger.error(`${deleting} user: ${err.message}`, {
        stack: err.stack,
      })
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: Internal })
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: access })
})

router.put('/users/role/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    const { id } = req.params
    try {
      const updateRoleUser = await updateRole(req, id)
      return res.status(StatusCodes.CREATED).json(updateRoleUser)
    } catch (err) {
      logger.error(`${update} user: ${err.message}`, {
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
