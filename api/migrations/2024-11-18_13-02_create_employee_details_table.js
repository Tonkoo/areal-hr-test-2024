exports.up = (pgm) => {
  pgm.createTable('employee_details', {
    id: { type: 'serial', primaryKey: true },
    employee_id: {
      type: 'integer',
      notNull: true,
      references: 'employees(id)',
      onDelete: 'cascade',
    },
    department_id: {
      type: 'integer',
      references: 'departments(id)',
      onDelete: 'cascade',
    },
    position_id: {
      type: 'integer',
      references: 'positions(id)',
      onDelete: 'cascade',
    },
    salary: { type: 'money' },
  })

  pgm.sql(`
      INSERT INTO employee_details (employee_id, department_id, position_id, salary) VALUES
        (1, 1, 1, '50000'),
        (2, 2, 2, '60000');
    `)
}

exports.down = (pgm) => {
  pgm.dropTable('employee_details')
}
