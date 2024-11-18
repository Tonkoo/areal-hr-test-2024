exports.up = (pgm) => {
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
  
  };
  
  exports.down = (pgm) => {
    pgm.dropTable("history_change");
  };
  