const express = require('express')
const router = express.Router()
const { getRegions } = require('../controllers/db_regions')

router.get('/regions', async (req, res) => {
  try {
    const regions = await getRegions()
    res.json(regions)
  } catch (err) {
    console.error('Error fetching regions:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
