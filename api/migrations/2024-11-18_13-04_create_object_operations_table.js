exports.up = (pgm) => {
  pgm.createTable("object_operations", {
    id: { type: "serial", primaryKey: true },
    name: { type: "varchar(255)", notNull: true },
  });
  pgm.sql(`
      INSERT INTO object_operations (name) VALUES
        ('Организация'),
        ('Отдел'),
        ('Должность'),
        ('Сотрудник'),
        ('Кадровая операция');
    `);
};

exports.down = (pgm) => {
  pgm.dropTable("object_operations");
};
