const express = require("express");
const router = express.Router();
const { getOperations } = require("../controllers/db_operations")


router.get("/operations", async (req, res) => {
  try {
    const operations = await getOperations();
    res.json(operations);
  } catch (err) {
    console.error("Error fetching operations:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
