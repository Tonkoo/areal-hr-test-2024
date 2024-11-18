const client = require("../db");

async function getRegions() {
  try {
    const result = await client.query("SELECT * FROM regions");
    return result.rows;
  } catch (error) {
    console.error("Error fetching regions:", error);
    throw error;
  }
}

module.exports = {
  getRegions,
};
