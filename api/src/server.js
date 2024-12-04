require('dotenv').config({ path: '../.env' })
const express = require('express')
const session = require('express-session')
const passport = require('./auth/passport')
const organizationsRoutes = require('./routes/organizations')
const departmentsRoutes = require('./routes/departments')
const positionsRoutes = require('./routes/positions')
const employeesRoutes = require('./routes/employees')
const regionsRoutes = require('./routes/regions')
const citysRoutes = require('./routes/citys')
const filesRoutes = require('./routes/files')
const usersRoutes = require('./routes/users')
const authRoutes = require('./routes/authorization')
const cors = require('cors')

const app = express()
const port = process.env.PORT

app.use(
  cors({
    origin: 'http://localhost:5173',
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
