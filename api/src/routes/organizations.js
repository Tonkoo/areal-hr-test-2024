const express = require("express");
const router = express.Router();
const { getOrganizations, addOrganization, updateOrganization, deleteOrganization } = require("../controllers/db_organizations")

router.get("/organizations", async (req, res) => {
  try {
    const organizations = await getOrganizations();
    res.json(organizations);
  } catch (err) {
    console.error("Error fetching organizations:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/organizations", async (req, res) => {
  const { name, comment } = req.body;
  if (!name || !comment) {
    return res.status(400).json({ error: "Name and comment are required" });
  }

  try {
    const newOrganization = await addOrganization(name, comment);
    res.status(201).json(newOrganization);
  } catch (err) {
    console.error("Error saving organization:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/organizations/:id", async (req, res) => {
  const { id } = req.params;
  const { name, comment } = req.body;
  try {
    const updatedOrganizations = await updateOrganization(id, name, comment);
    res.status(201).json(updatedOrganizations);
  } catch (err) {
    console.error("Error updating organization:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/organizations/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deltedOrganizations = await deleteOrganization(id);
    res.status(201).json(deltedOrganizations);
  } catch (err) {
    console.error("Error deleting organization:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
