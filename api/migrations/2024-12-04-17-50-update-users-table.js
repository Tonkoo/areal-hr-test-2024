exports.up = (pgm) => {
  pgm.sql(`
    UPDATE users
    SET password = '$argon2id$v=19$m=65536,t=3,p=4$VTd4f/vjxT9XAoeK/2esvw$HRByWkcUOSZngLF7N1Ps6l8WiAzuKsGSKmH0/kMJGYA'
    WHERE id = 1;
  `)
  pgm.sql(`
    UPDATE users
    SET password = '$argon2id$v=19$m=65536,t=3,p=4$rVSOCQlo1WjGXwb92Rnlyw$AKUDQ7yTg3UBvgJ+AhCt3ODZy0dPGTepxYzwtr4IRy8'
    WHERE id = 2;
  `)
}

exports.down = (pgm) => {
  pgm.sql(`
    UPDATE users
    SET password = 'admin'
    WHERE id = 1;
  `)
  pgm.sql(`
    UPDATE users
    SET password = 'manager'
    WHERE id = 2;
  `)
}
