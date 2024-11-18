const express = require("express");
const router = express.Router();
const { getCity } = require("../controllers/db_city");

router.get("/citys", async (req, res) => {
  try {
    const city = await getCity();
    res.json(city);
  } catch (err) {
    console.error("Error fetching citys:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
