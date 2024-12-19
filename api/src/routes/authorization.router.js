const express = require('express')
const passport = require('../auth/passport')
const router = express.Router()
const { StatusCodes } = require('http-status-codes')
const { Internal, access } = require('./../errors/text-errors')

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err)
    if (!user)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: info.message })
    req.logIn(user, (err) => {
      if (err) return next(err)
      return res.status(StatusCodes.OK).json({ message: 'Успешный вход', user })
    })
  })(req, res, next)
})

router.get('/user-role', (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({
      session: req.isAuthenticated(),
      roleName: req.user.roleName,
    })
  } else {
    return res.json({
      session: req.isAuthenticated(),
    })
  }
})

router.get('/user-fullname', (req, res) => {
  if (req.isAuthenticated()) {
    const fullname =
      req.user.lastName + ' ' + req.user.firstName + ' ' + req.user.middleName

    return res.json({ fullname })
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: access })
})

router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: Internal })
    }
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Выход выполнен успешно' })
  })
})

module.exports = router
