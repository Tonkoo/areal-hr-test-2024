const express = require("express");
const router = express.Router();
const client = require("../db");

router.get("/employees", async (req, res) => {
  try {
    const result = await client.query("SELECT employees.id, last_name, first_name, middle_name, TO_CHAR(date_of_birth, 'DD.MM.YYYY') AS   date_of_birth, passport_series, passport_number, regions.name as region, citys.name as city, street, house, building, apartment FROM employees join regions on employees.region_id = regions.id join citys on employees.city_id = citys.id");
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

module.exports = router;
