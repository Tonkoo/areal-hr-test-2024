exports.up = (pgm) => {
  pgm.alterColumn('history_change', 'author', {
    type: 'integer',
    using: 'author::integer',
  })

  pgm.dropColumn('history_change', 'modified_fields')

  pgm.addColumns('history_change', {
    record_id: { type: 'integer', notNull: true },
    old_value: { type: 'varchar(255)' },
    new_value: { type: 'varchar(255)', notNull: true },
  })
  pgm.addConstraint('history_change', 'fk_history_change_author_users', {
    foreignKeys: {
      columns: 'author',
      references: 'users(id)',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
  })
}

exports.down = (pgm) => {
  pgm.alterColumn('history_change', 'author', { type: 'varchar(255)' })

  pgm.addColumns('history_change', {
    modified_fields: { type: 'varchar(255)' },
  })

  pgm.dropColumn('history_change', 'record_id')
  pgm.dropColumn('history_change', 'old_value')
  pgm.dropColumn('history_change', 'new_value')

  pgm.dropConstraint('history_change', 'fk_history_change_author_users')
}
