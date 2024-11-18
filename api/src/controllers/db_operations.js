const client = require("../db");

async function getOperations() {
  try {
    const result = await client.query(
      "SELECT personnel_operations.id as operations_id, (last_name || ' ' || first_name || ' ' || middle_name) AS full_name, type_operation.name as type_operation, departments.name as departments_name, positions.name as positions_name, salary from personnel_operations join employees on personnel_operations.employee_id = employees.id join type_operation on personnel_operations.type_operation_id = type_operation.id join departments on personnel_operations.department_id = departments.id join positions on personnel_operations.position_id = positions.id"
    );
    return result.rows;
  } catch (err) {
    console.error("Error fetching operations:", err);
    throw err;
  }
}



module.exports = {
  getOperations,
};
