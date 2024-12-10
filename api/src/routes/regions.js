const express = require('express')
const router = express.Router()
const { getRegions } = require('../controllers/regions/db-regions')

router.get('/regions', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const regions = await getRegions()
      return res.json(regions)
    } catch (err) {
      console.error('Error fetching regions:', err)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
  return res.status(401).json({ message: 'Неавторизованный доступ' })
})

module.exports = router
