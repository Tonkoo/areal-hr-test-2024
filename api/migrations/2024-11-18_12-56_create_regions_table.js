exports.up = (pgm) => {
  pgm.createTable("regions", {
    id: { type: "serial", primaryKey: true },
    name: { type: "varchar(255)", notNull: true },
  });

  pgm.sql(`
      INSERT INTO regions (name) VALUES
        ('Центральный'),
        ('Сибирский');
    `);
};

exports.down = (pgm) => {
  pgm.dropTable("regions");
};
