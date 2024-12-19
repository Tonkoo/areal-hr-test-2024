const express = require('express')
const router = express.Router()
const { StatusCodes } = require('http-status-codes')
const logger = require('../logger/logger')
const { getRegions } = require('../controllers/regions/regions.controller')
const { fetching, Internal, access } = require('./../errors/text-errors')

router.get('/regions', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const regions = await getRegions()
      return res.json(regions)
    } catch (err) {
      logger.error(`${fetching} regions: ${err.message}`, {
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
