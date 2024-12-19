const express = require('express')
const router = express.Router()
const { StatusCodes } = require('http-status-codes')
const logger = require('../logger/logger')
const { getCity } = require('../controllers/citys/city.controller')
const { fetching, Internal, access } = require('./../errors/text-errors')

router.get('/citys', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const city = await getCity()
      return res.json(city)
    } catch (err) {
      logger.error(`${fetching} citys: ${err.message}`, {
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
