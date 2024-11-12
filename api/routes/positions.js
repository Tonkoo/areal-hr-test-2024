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

router.put("/positions/:id", async (req, res) => {
  const { id } = req.params;
  const { position_name, department_id } = req.body;

  if (!position_name || !department_id) {
    return res.status(400).json({ error: "position_name and department_id are required" });
  }

  try {
    const result = await client.query(
      `UPDATE positions 
       SET name = $1, department_id = $2
       WHERE id = $3 RETURNING *`,
      [position_name, department_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Position not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating position:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
