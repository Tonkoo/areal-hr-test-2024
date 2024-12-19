require('dotenv').config({ path: '../.env' })
const express = require('express')
const session = require('express-session')
const passport = require('./auth/passport')
const organizationsRoutes = require('./routes/organizations.router')
const departmentsRoutes = require('./routes/departments.router')
const positionsRoutes = require('./routes/positions.router')
const employeesRoutes = require('./routes/employees.router')
const regionsRoutes = require('./routes/regions.router')
const citysRoutes = require('./routes/citys.router')
const filesRoutes = require('./routes/files.router')
const usersRoutes = require('./routes/users.router')
const authRoutes = require('./routes/authorization.router')
const cors = require('cors')

const app = express()
const port = process.env.PORT

app.use(
  cors({
    origin: process.env.APP_URL,
    credentials: true,
  }),
)
app.use(express.json())
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'Lax',
    },
  }),
)
app.use(passport.initialize())
app.use(passport.session())
app.use('/api', organizationsRoutes)
app.use('/api', departmentsRoutes)
app.use('/api', positionsRoutes)
app.use('/api', employeesRoutes)
app.use('/api', regionsRoutes)
app.use('/api', citysRoutes)
app.use('/api', filesRoutes)
app.use('/api', usersRoutes)
app.use('/api', authRoutes)

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
