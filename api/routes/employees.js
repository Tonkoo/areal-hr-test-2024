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

module.exports = router;
