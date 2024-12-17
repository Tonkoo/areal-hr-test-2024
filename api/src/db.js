require('dotenv').config({ path: '../.env' })
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

pool.on('connect', (client) => {
  client.query("SET datestyle TO 'ISO, DMY'")
})

module.exports = pool
