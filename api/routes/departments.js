const express = require("express");
const router = express.Router();
const client = require("../db");

router.get("/departments", async (req, res) => {
  try {
    const result = await client.query("SELECT d.id AS department_id, d.name AS department_name, pd.name AS parent_department_name, d.comment AS department_comment, o.name AS organization_name FROM departments AS d LEFT JOIN departments AS pd ON d.parent_id = pd.id  LEFT JOIN organizations AS o ON d.organization_id = o.id ORDER BY o.name, d.id;");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching departments:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
