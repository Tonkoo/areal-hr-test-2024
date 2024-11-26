const express = require('express')
const router = express.Router()
const { getUsers } = require('../controllers/users/db_users')

router.get('/users', async (req, res) => {
  try {
    const users = await getUsers()
    res.json(users)
  } catch (err) {
    console.error('Error fetching users:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
