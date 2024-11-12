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

router.put("/departments/:id", async (req, res) => {
  const { id } = req.params;
  const { name, comment, parent_id, organization_id } = req.body;

  if (!name || !comment || !organization_id) {
    return res.status(400).json({ error: "Название, комментарий и ID организации обязательны" });
  }

  try {
    let query;
    let values;

    if (parent_id) {
      query = `UPDATE departments 
               SET name = $1, comment = $2, parent_id = $3, organization_id = $4
               WHERE id = $5 RETURNING *`;
      values = [name, comment, parent_id, organization_id, id];
    } else {
      query = `UPDATE departments 
               SET name = $1, comment = $2, parent_id = NULL, organization_id = $3
               WHERE id = $4 RETURNING *`;
      values = [name, comment, organization_id, id];
    }

    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Отдел не найден" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка при обновлении отдела:", err);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
});

router.delete("/departments/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await client.query("DELETE FROM departments WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Отдел не найден" });
    }

    res.json({ message: "Отдел успешно удален", deletedDepartment: result.rows[0] });
  } catch (err) {
    console.error("Ошибка при удалении отдела:", err);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
});

module.exports = router;
