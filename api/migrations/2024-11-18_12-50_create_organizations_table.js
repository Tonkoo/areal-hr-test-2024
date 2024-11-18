exports.up = (pgm) => {
  pgm.createTable("organizations", {
    id: { type: "serial", primaryKey: true },
    name: { type: "varchar(255)", notNull: true },
    comment: { type: "text", notNull: false },
  });

  pgm.sql(`
      INSERT INTO organizations (name, comment) VALUES
        ('ООО Рога и Копыта', 'Организация занимается сельским хозяйством'),
        ('ЗАО Прогресс', 'Техническая компания по разработке ПО');
    `);
};

exports.down = (pgm) => {
  pgm.dropTable("organizations");
};
