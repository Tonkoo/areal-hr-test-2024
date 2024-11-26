exports.up = (pgm) => {
  pgm.createTable('users', {
    id: { type: 'serial', primaryKey: true },
    last_name: { type: 'varchar(255)', notNull: true },
    first_name: { type: 'varchar(255)', notNull: true },
    middle_name: { type: 'varchar(255)', notNull: true },
    login: { type: 'varchar(255)', notNull: true },
    password: { type: 'varchar(255)', notNull: true },
    role_id: {
      type: 'integer',
      notNull: true,
      references: 'role(id)',
      onDelete: 'cascade',
    },
  })

  pgm.sql(`
INSERT INTO users (last_name, first_name, middle_name, login, password, role_id) VALUES
  ('Иванов', 'Иван', 'Иванович', 'admin', 'admin', 1),
  ('Петров', 'Петр', 'Петрович', 'manager', 'manager', 2);
  `)
}

exports.down = (pgm) => {
  pgm.dropTable('user')
}
