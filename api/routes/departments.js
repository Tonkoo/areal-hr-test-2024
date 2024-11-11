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

router.get("/get-organization-by-parent/:parent_id", async (req, res) => {
  const { parent_id } = req.params;

  try {
    const result = await client.query(
      `SELECT organization_id 
       FROM departments 
       WHERE id = $1`, [parent_id]
    );

    if (result.rows.length > 0) {
      res.json({ organization_id: result.rows[0].organization_id });
    } else {
      res.status(404).json({ error: "Parent department not found" });
    }
  } catch (err) {
    console.error("Error fetching organization by parent:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/departments", async (req, res) => {
  const { name, comment, parent_id, organization_id } = req.body;

  if (!name || !comment || !organization_id) {
    return res.status(400).json({ error: "Name, comment, and organization_id are required" });
  }

  try {
    let query;
    let values;

    if (parent_id) {
      query = `INSERT INTO departments (name, comment, parent_id, organization_id) 
               VALUES ($1, $2, $3, $4) RETURNING *`;
      values = [name, comment, parent_id, organization_id];
    } else {
      query = `INSERT INTO departments (name, comment, organization_id) 
               VALUES ($1, $2, $3) RETURNING *`;
      values = [name, comment, organization_id];
    }

    const result = await client.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error saving department:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
