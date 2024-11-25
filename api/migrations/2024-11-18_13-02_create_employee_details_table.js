exports.up = (pgm) => {
  pgm.createTable('employee_details', {
    id: { type: 'serial', primaryKey: true },
    department_id: {
      type: 'integer',
      notNull: true,
      references: 'departments(id)',
      onDelete: 'cascade',
    },
    position_id: {
      type: 'integer',
      notNull: true,
      references: 'positions(id)',
      onDelete: 'cascade',
    },
    salary: { type: 'money', notNull: true },
    is_fired: { type: 'boolean', notNull: true },
  })

  pgm.sql(`
      INSERT INTO employee_details (id, department_id, position_id, salary, is_fired) VALUES
        (1, 1, 1, '50000', false),
        (2, 2, 2, '60000', false);
    `)
}

exports.down = (pgm) => {
  pgm.dropTable('employee_details')
}
