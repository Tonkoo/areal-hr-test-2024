exports.up = (pgm) => {
    pgm.createTable("type_operation", {
      id: { type: "serial", primaryKey: true },
      name: { type: "varchar(255)", notNull: true },
    });
    pgm.sql(`
      INSERT INTO type_operation (name) VALUES
        ('Принятие на работу'),
        ('Увольнение'),
        ('Изменение зарплаты'),
        ('Изменение отдела'),
        ('Изменение должности');
    `);
  
  };
  
  exports.down = (pgm) => {
    pgm.dropTable("type_operation");
  };
  