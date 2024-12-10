require('dotenv').config({ path: '../.env' })
const argon2 = require('argon2')
exports.up = async (pgm) => {
  const login = process.env.LOGIN_ADMIN
  const password = await argon2.hash(process.env.PASSWORD_ADMIN, {
    type: argon2.argon2id,
  })

  await pgm.sql(
    `
    UPDATE users
    SET login = '${login}',
    password = '${password}'
    WHERE id = 1;
    `,
  )
}

exports.down = (pgm) => {
  pgm.sql(`
    UPDATE users
    SET login = 'admin',
    password = '$argon2id$v=19$m=65536,t=3,p=4$VTd4f/vjxT9XAoeK/2esvw$HRByWkcUOSZngLF7N1Ps6l8WiAzuKsGSKmH0/kMJGYA'
    WHERE id = 1;
  `)
}
