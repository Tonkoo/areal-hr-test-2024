exports.up = (pgm) => {
  pgm.createTable("organizations", {
    id: { type: "serial", primaryKey: true },
    name: { type: "varchar(255)", notNull: true },
    comment: { type: "text", notNull: false },
  });

  pgm.createTable("departments", {
    id: { type: "serial", primaryKey: true },
    name: { type: "varchar(255)", notNull: true },
    parent_id: {
      type: "integer",
      references: "departments(id)",
      onDelete: "cascade",
    },
    comment: { type: "text", notNull: true },
    organization_id: {
      type: "integer",
      notNull: false,
      references: "organizations(id)",
      onDelete: "cascade",
    },
  });
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
  pgm.createTable("regions", {
    id: { type: "serial", primaryKey: true },
    name: { type: "varchar(255)", notNull: true },
  });
  pgm.createTable("citys", {
    id: { type: "serial", primaryKey: true },
    name: { type: "varchar(255)", notNull: true },
    region_id: {
      type: "integer",
      notNull: true,
      references: "regions(id)",
      onDelete: "cascade",
    },
  });
  pgm.createTable("employees", {
    id: { type: "serial", primaryKey: true },
    last_name: { type: "varchar(255)", notNull: true },
    first_name: { type: "varchar(255)", notNull: true },
    middle_name: { type: "varchar(255)" },
    date_of_birth: { type: "date", notNull: true },
    passport_series: { type: "character(4)", notNull: true },
    passport_number: { type: "character(6)", notNull: true },
    region_id: {
      type: "integer",
      notNull: true,
      references: "regions(id)",
      onDelete: "cascade",
    },
    city_id: {
      type: "integer",
      notNull: true,
      references: "citys(id)",
      onDelete: "cascade",
    },
    street: { type: "varchar(255)", notNull: true },
    house: { type: "varchar(255)", notNull: true },
    building: { type: "varchar(255)" },
    apartment: { type: "integer" },
  });
  pgm.createTable("passport_scan", {
    id: { type: "serial", primaryKey: true },
    name: { type: "varchar(255)", notNull: true },
    file: { type: "varchar(255)", notNull: true },
  });
  pgm.createTable("employeesfiles", {
    id: { type: "serial", primaryKey: true },
    employee_id: {
      type: "integer",
      notNull: true,
      references: "employees(id)",
      onDelete: "cascade",
    },
    passport_scan_id: {
      type: "integer",
      notNull: true,
      references: "passport_scan(id)",
      onDelete: "cascade",
    },
  });
  pgm.createTable("type_operation", {
    id: { type: "serial", primaryKey: true },
    name: { type: "varchar(255)", notNull: true },
  });
  pgm.createTable("personnel_operations", {
    id: { type: "serial", primaryKey: true },
    employee_id: {
      type: "integer",
      notNull: true,
      references: "employees(id)",
      onDelete: "cascade",
    },
    type_operation_id: {
      type: "integer",
      notNull: true,
      references: "type_operation(id)",
      onDelete: "cascade",
    },
    department_id: {
      type: "integer",
      references: "departments(id)",
      onDelete: "cascade",
    },
    position_id: {
      type: "integer",
      references: "positions(id)",
      onDelete: "cascade",
    },
    salary: { type: "money" },
  });
  pgm.createTable("object_operations", {
    id: { type: "serial", primaryKey: true },
    name: { type: "varchar(255)", notNull: true },
  });
  pgm.createTable("history_change", {
    id: { type: "serial", primaryKey: true },
    datetime_operations: { type: "timestamp", notNull: true },
    author: { type: "varchar(255)", notNull: true },
    id_object_operations: {
      type: "integer",
      notNull: true,
      references: "object_operations(id)",
      onDelete: "cascade",
    },
    modified_fields: { type: "varchar(255)", notNull: true },
  });
  pgm.sql(`
    INSERT INTO organizations (name, comment) VALUES
      ('ООО Рога и Копыта', 'Организация занимается сельским хозяйством'),
      ('ЗАО Прогресс', 'Техническая компания по разработке ПО');
  `);

  pgm.sql(`
    INSERT INTO departments (name, parent_id, comment, organization_id) VALUES
      ('HR', null, 'Отдел кадров', 1),
      ('IT', 1, 'Отдел информационных технологий', 2);
  `);

  pgm.sql(`
    INSERT INTO positions (name, department_id) VALUES
      ('Менеджер по персоналу', 1),
      ('Разработчик', 2);
  `);

  pgm.sql(`
    INSERT INTO regions (name) VALUES
      ('Центральный'),
      ('Сибирский');
  `);

  pgm.sql(`
    INSERT INTO citys (name, region_id) VALUES
      ('Москва', 1),
      ('Новосибирск', 2);
  `);

  pgm.sql(`
    INSERT INTO employees (last_name, first_name, middle_name, date_of_birth, passport_series, passport_number, region_id, city_id, street, house, building, apartment) VALUES
      ('Иванов', 'Иван', 'Иванович', '1985-05-15', 'AB', '123456', 1, 1, 'Ленина', '10', '1', 101),
      ('Петров', 'Петр', 'Петрович', '1990-03-25', 'CD', '654321', 2, 2, 'Мира', '20', '2', 202);
  `);

  pgm.sql(`
    INSERT INTO passport_scan (name, file) VALUES
      ('Иванов И.И. Паспорт', '/files/ivanov.jpg'),
      ('Петров П.П. Паспорт', '/files/petrov.jpg');
  `);

  pgm.sql(`
    INSERT INTO employeesfiles (employee_id, passport_scan_id) VALUES
      (1, 1),
      (2, 2);
  `);

  pgm.sql(`
    INSERT INTO type_operation (name) VALUES
      ('Принятие на работу'),
      ('Увольнение'),
      ('Изменение зарплаты'),
      ('Изменение отдела'),
      ('Изменение должности');
  `);

  pgm.sql(`
    INSERT INTO personnel_operations (employee_id, type_operation_id, department_id, position_id, salary) VALUES
      (1, 1, 1, 1, '50000'),
      (2, 1, 2, 2, '60000');
  `);

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
  pgm.dropTable("organizations");
  pgm.dropTable("departments");
  pgm.dropTable("positions");
  pgm.dropTable("regions");
  pgm.dropTable("citys");
  pgm.dropTable("employees");
  pgm.dropTable("passport_scan");
  pgm.dropTable("employeesfiles");
  pgm.dropTable("type_operation");
  pgm.dropTable("personnel_operations");
  pgm.dropTable("object_operations");
  pgm.dropTable("history_change");
};
