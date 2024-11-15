const express = require("express");
const router = express.Router();
const client = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

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

router.post("/files/:employeeId", upload.single('file'), async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { name } = req.body;
    const file = req.file.path;

    const passportScanResult = await client.query(
      "INSERT INTO passport_scan (name, file) VALUES ($1, $2) RETURNING id",
      [name, file]
    );

    const passportScanId = passportScanResult.rows[0].id;

    await client.query(
      "INSERT INTO employeesfiles (employee_id, passport_scan_id) VALUES ($1, $2)",
      [employeeId, passportScanId]
    );

    res.status(201).json({ message: "File added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while adding the file" });
  }
});

router.delete("/files/:fileId", async (req, res) => {
  try {
    const { fileId } = req.params;
    const { filepath } = req.query;

    if (!filepath) {
      return res.status(400).json({ error: "The file path is not specified" });
    }

    await client.query("DELETE FROM employeesfiles WHERE passport_scan_id = $1", [fileId]);
    await client.query("DELETE FROM passport_scan WHERE id = $1", [fileId]);

    fs.unlink(filepath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return res.status(500).json({ error: "The file has been removed from the database but was not deleted from the file system" });
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while deleting the file" });
  }
});

module.exports = router;
