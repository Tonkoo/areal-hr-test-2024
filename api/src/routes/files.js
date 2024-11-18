const express = require("express");
const router = express.Router();
const client = require("../db");
const multer = require("multer");
const { getFiles, addFile, deleteFile } = require("../controllers/db_file");
const { saveFile, deleteFileFromSystem } = require("../controllers/service_file");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/files/:employee_id", async (req, res) => {
  try {
    const { employee_id } = req.params;
    const files = await getFiles(employee_id);
    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while fetching files" });
  }
});

router.post("/files/:employee_id", upload.single('file'), async (req, res) => {
  try {
    const { employee_id } = req.params;
    const { name } = req.body;
    const filePath  = await saveFile(req.file);
    const newFile = await addFile(name, filePath, employee_id);

    res.status(201).json({ message: "File added successfully", fileId: newFile.id });
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

    await client.query("BEGIN");

    const deletedFiles = await deleteFile(fileId);
    if (!deletedFiles) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "File not found" });
    }
    await deleteFileFromSystem(filepath);

    await client.query("COMMIT");

    res.status(200).json({ message: "File successfully deleted" });

  } catch (err) {
    console.error(err);
    await client.query("ROLLBACK");
    res.status(500).json({ error: "An error occurred while deleting the file" });
  }
});

module.exports = router;
