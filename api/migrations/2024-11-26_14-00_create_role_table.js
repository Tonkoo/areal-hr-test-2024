exports.up = (pgm) => {
  pgm.createTable('role', {
    id: { type: 'serial', primaryKey: true },
    name: { type: 'varchar(255)', notNull: true },
  })

  pgm.sql(`
    INSERT INTO role (name) VALUES
      ('Администратор'),
      ('Кадровый сотрудник');
  `)
}

exports.down = (pgm) => {
  pgm.dropTable('role')
}
