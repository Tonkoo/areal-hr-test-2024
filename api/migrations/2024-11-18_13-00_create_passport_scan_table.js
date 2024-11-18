exports.up = (pgm) => {
    pgm.createTable("passport_scan", {
      id: { type: "serial", primaryKey: true },
      name: { type: "varchar(255)", notNull: true },
      path: { type: "varchar(255)", notNull: true },
      employee_id: {
        type: "integer",
        notNull: true,
        references: "employees(id)",
        onDelete: "cascade",
      }
  
    });
    pgm.sql(`
      INSERT INTO passport_scan (name, path, employee_id) VALUES
        ('Иванов И.И. Паспорт', '..\\uploads\\1731938456221.pdf', 1),
        ('Петров П.П. Паспорт', '..\\uploads\\1731938461207.pdf', 2);
    `);
  };
  
  exports.down = (pgm) => {
    pgm.dropTable("passport_scan");
  };
  