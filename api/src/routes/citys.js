const express = require('express')
const router = express.Router()
const { getCity } = require('../controllers/citys/db-city')

router.get('/citys', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const city = await getCity()
      return res.json(city)
    } catch (err) {
      console.error('Error fetching citys:', err)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
  return res.status(401).json({ message: 'Неавторизованный доступ' })
})

module.exports = router
