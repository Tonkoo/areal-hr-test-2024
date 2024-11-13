const express = require("express");
const router = express.Router();
const client = require("../db");

router.get("/regions", async (req, res) => {
  try {
    const result = await client.query("select * from regions");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching regions:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
