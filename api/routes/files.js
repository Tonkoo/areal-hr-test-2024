const express = require("express");
const router = express.Router();
const client = require("../db");

router.get("/files/:employeeId", async (req, res) => {
    try {
      const { employeeId } = req.params;
      const result = await client.query(
        "SELECT ef.id as file_id, ps.name as file_name, ps.file as filepath FROM employeesfiles ef JOIN passport_scan ps ON ef.passport_scan_id = ps.id WHERE ef.employee_id = $1",
        [employeeId]
      );
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while fetching files" });
    }
  });

module.exports = router;
