const express = require('express')
const passport = require('../auth/passport')
const router = express.Router()

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err)
    if (!user) return res.status(401).json({ message: info.message })
    req.logIn(user, (err) => {
      if (err) return next(err)
      return res.status(200).json({ message: 'Успешный вход', user })
    })
  })(req, res, next)
})

module.exports = router
