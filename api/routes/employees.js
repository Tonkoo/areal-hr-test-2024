const express = require("express");
const router = express.Router();
const client = require("../db");

router.get("/employees", async (req, res) => {
  try {
    const result = await client.query("SELECT employees.id, employees.last_name, employees.first_name, employees.middle_name, TO_CHAR(employees.date_of_birth, 'DD.MM.YYYY') AS date_of_birth, employees.passport_series, employees.passport_number, regions.name AS region, citys.name AS city, employees.street, employees.house, employees.building, employees.apartment, departments.name AS department_name, positions.name AS position_name, recent_operations.salary FROM employees JOIN regions ON employees.region_id = regions.id JOIN citys ON employees.city_id = citys.id JOIN ( SELECT personnel_operations.*, ROW_NUMBER() OVER (PARTITION BY employee_id ORDER BY id DESC) AS row_num FROM personnel_operations) AS recent_operations ON employees.id = recent_operations.employee_id AND recent_operations.row_num = 1 JOIN departments ON recent_operations.department_id = departments.id JOIN positions ON recent_operations.position_id = positions.id;");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/employees", async (req, res) => {
  const { last_name, first_name, middle_name, date_of_birth, passport_series, passport_number, region_id, city_id, street, house, building, apartment} = req.body;

  if (!last_name || !first_name || !middle_name || !date_of_birth || !passport_series || !passport_number || !region_id || !city_id || !street || !house || !building || !apartment ) {
    return res.status(400).json({ error: "All fields must be filled" });
  }

  try {
    const result = await client.query(
      `INSERT INTO employees (last_name, first_name, middle_name, date_of_birth, passport_series, passport_number, region_id, city_id, street, house, building, apartment) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9 ,$10, $11, $12) RETURNING *`,
      [last_name, first_name, middle_name, date_of_birth, passport_series, passport_number, region_id, city_id, street, house, building, apartment]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding employees:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/employees/:id", async (req, res) => {
  const { id } = req.params;
  const { last_name, first_name, middle_name, date_of_birth, passport_series, passport_number, region_id, city_id, street, house, building, apartment} = req.body;
  if (!last_name || !first_name || !middle_name || !date_of_birth || !passport_series || !passport_number || !region_id || !city_id || !street || !house || !building || !apartment ) {
    return res.status(400).json({ error: "All fields must be filled" });
  }

  try {
    const result = await client.query(
      `UPDATE employees 
       SET last_name = $1,
        first_name = $2,
        middle_name = $3,
        date_of_birth = $4,
        passport_series = $5,
        passport_number = $6,
        region_id = $7,
        city_id = $8,
        street = $9,
        house = $10,
        building = $11,
        apartment = $12
       WHERE id = $13 RETURNING *`,
      [last_name, first_name, middle_name, date_of_birth, passport_series, passport_number, region_id, city_id, street, house, building, apartment, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating employee:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
