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

module.exports = router;
