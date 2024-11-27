const express = require('express')
const router = express.Router()
const {
  getUsers,
  addUser,
  updateUser,
  deletedUser,
  updateRole,
} = require('../controllers/users/db_users')
const {
  UsersSchema,
  AlternativeUsersSchema,
} = require('../controllers/users/dto/validationUsers')

router.get('/users', async (req, res) => {
  try {
    const users = await getUsers()
    res.json(users)
  } catch (err) {
    console.error('Error fetching users:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/users', async (req, res) => {
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
      last_name,
      first_name,
      middle_name,
      login,
      password,
    )
    res.status(201).json(newUser)
  } catch (err) {
    console.error('Error adding user:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.put('/users/:id', async (req, res) => {
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
      id,
      last_name,
      first_name,
      middle_name,
      login,
      password,
      isResetPassword,
    )
    res.status(201).json(updatedUser)
  } catch (err) {
    console.error('Error updating user:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.delete('/users/:id', async (req, res) => {
  const { id } = req.params

  try {
    const deltedUser = await deletedUser(id)
    res.status(201).json(deltedUser)
  } catch (err) {
    console.error('Error deleting user:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.put('/users/role/:id', async (req, res) => {
  const { id } = req.params
  try {
    const updateRoleUser = await updateRole(id)
    res.status(201).json(updateRoleUser)
  } catch (err) {
    console.error('Error update role user:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
