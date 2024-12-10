const express = require('express')
const router = express.Router()
const {
  getUsers,
  addUser,
  updateUser,
  deletedUser,
  updateRole,
  getHistoryUsers,
} = require('../controllers/users/db-users')
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
      console.error('Error fetching users:', err)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
  return res.status(401).json({ message: 'Неавторизованный доступ' })
})

router.get('/users/history/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const { id } = req.params
      const historyUsers = await getHistoryUsers(id)
      return res.json(historyUsers)
    } catch (err) {
      console.error('Error fetching history users:', err)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
  return res.status(401).json({ message: 'Неавторизованный доступ' })
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
        return res.status(400).json({ errors: errorMessages })
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
      return res.status(201).json(newUser)
    } catch (err) {
      console.error('Error adding user:', err)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
  return res.status(401).json({ message: 'Неавторизованный доступ' })
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
        return res.status(400).json({ errors: errorMessages })
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
      return res.status(201).json(updatedUser)
    } catch (err) {
      console.error('Error updating user:', err)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
  return res.status(401).json({ message: 'Неавторизованный доступ' })
})

router.delete('/users/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    const { id } = req.params

    try {
      const deltedUser = await deletedUser(id)
      return res.status(201).json(deltedUser)
    } catch (err) {
      console.error('Error deleting user:', err)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
  return res.status(401).json({ message: 'Неавторизованный доступ' })
})

router.put('/users/role/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    const { id } = req.params
    try {
      const updateRoleUser = await updateRole(req, id)
      return res.status(201).json(updateRoleUser)
    } catch (err) {
      console.error('Error update role user:', err)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
  return res.status(401).json({ message: 'Неавторизованный доступ' })
})

module.exports = router
