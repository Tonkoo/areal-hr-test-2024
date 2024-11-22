exports.up = (pgm) => {
  pgm.createTable('citys', {
    id: { type: 'serial', primaryKey: true },
    name: { type: 'varchar(255)', notNull: true },
    region_id: {
      type: 'integer',
      notNull: true,
      references: 'regions(id)',
      onDelete: 'cascade',
    },
  })
  pgm.sql(`
      INSERT INTO citys (name, region_id) VALUES
        ('Москва', 1),
        ('Новосибирск', 2);
    `)
}

exports.down = (pgm) => {
  pgm.dropTable('citys')
}
