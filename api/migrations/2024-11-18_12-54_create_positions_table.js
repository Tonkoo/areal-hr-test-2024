exports.up = (pgm) => {
  pgm.createTable("positions", {
    id: { type: "serial", primaryKey: true },
    name: { type: "varchar(255)", notNull: true },
    department_id: {
      type: "integer",
      notNull: false,
      references: "departments(id)",
      onDelete: "cascade",
    },
  });

  pgm.sql(`
      INSERT INTO positions (name, department_id) VALUES
        ('Менеджер по персоналу', 1),
        ('Разработчик', 2);
    `);
};

exports.down = (pgm) => {
  pgm.dropTable("positions");
};
