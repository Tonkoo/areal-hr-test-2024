exports.up = (pgm) => {
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
  pgm.sql(`
      INSERT INTO departments (name, parent_id, comment, organization_id) VALUES
        ('HR', null, 'Отдел кадров', 1),
        ('IT', 1, 'Отдел информационных технологий', 2);
    `);
};

exports.down = (pgm) => {
  pgm.dropTable("departments");
};
