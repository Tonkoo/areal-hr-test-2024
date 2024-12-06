exports.up = (pgm) => {
  pgm.createTable('passport_scan', {
    id: { type: 'serial', primaryKey: true },
    name: { type: 'varchar(255)', notNull: true },
    path: { type: 'varchar(255)', notNull: true },
    employee_id: {
      type: 'integer',
      notNull: true,
      references: 'employees(id)',
      onDelete: 'cascade',
    },
  })
}

exports.down = (pgm) => {
  pgm.dropTable('passport_scan')
}
