const express = require("express");
const router = express.Router();
const client = require("../db");

router.get("/positions", async (req, res) => {
  try {
    const result = await client.query("SELECT positions.id, positions.name as position_name, departments.name as department_name FROM positions join departments on positions.department_id = departments.id");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching departments:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/positions", async (req, res) => {
  const { name, department_id } = req.body;

  if (!name || !department_id) {
    return res.status(400).json({ error: "Name and department_id are required" });
  }

  try {
    const result = await client.query(
      `INSERT INTO positions (name, department_id) 
       VALUES ($1, $2) RETURNING *`,
      [name, department_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding position:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
