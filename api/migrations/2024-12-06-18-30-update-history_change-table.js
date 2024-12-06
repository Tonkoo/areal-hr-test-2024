exports.up = (pgm) => {
  pgm.alterColumn('history_change', 'old_value', { type: 'text' })
  pgm.alterColumn('history_change', 'new_value', { type: 'text' })
}

exports.down = (pgm) => {
  pgm.alterColumn('history_change', 'old_value', { type: 'varchar(255)' })
  pgm.alterColumn('history_change', 'new_value', { type: 'varchar(255)' })
}
