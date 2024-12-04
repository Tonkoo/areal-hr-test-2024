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

router.get('/user-role', (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ roleName: req.user.roleName })
  }
  res.status(401).json({ message: 'Неавторизованный доступ' })
})

router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Ошибка при выходе' })
    }
    res.status(200).json({ message: 'Выход выполнен успешно' })
  })
})

module.exports = router
