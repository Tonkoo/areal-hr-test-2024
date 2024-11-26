exports.up = (pgm) => {
  pgm.createTable('employees', {
    id: { type: 'serial', primaryKey: true },
    last_name: { type: 'varchar(255)', notNull: true },
    first_name: { type: 'varchar(255)', notNull: true },
    middle_name: { type: 'varchar(255)' },
    date_of_birth: { type: 'date', notNull: true },
    passport_series: { type: 'character(4)', notNull: true },
    passport_number: { type: 'character(6)', notNull: true },
    region_id: {
      type: 'integer',
      notNull: true,
      references: 'regions(id)',
      onDelete: 'cascade',
    },
    city_id: {
      type: 'integer',
      notNull: true,
      references: 'citys(id)',
      onDelete: 'cascade',
    },
    street: { type: 'varchar(255)', notNull: true },
    house: { type: 'varchar(255)', notNull: true },
    building: { type: 'varchar(255)' },
    apartment: { type: 'integer' },
  })

  pgm.sql(`
      INSERT INTO employees (last_name, first_name, middle_name, date_of_birth, passport_series, passport_number, region_id, city_id, street, house, building, apartment) VALUES
        ('Иванов', 'Иван', 'Иванович', '1985-05-15', '1234', '123456', 1, 1, 'Ленина', '10', '1', 101),
        ('Петров', 'Петр', 'Петрович', '1990-03-25', '1234', '654321', 2, 2, 'Мира', '20', '2', 202);
    `)
}

exports.down = (pgm) => {
  pgm.dropTable('employees')
}
