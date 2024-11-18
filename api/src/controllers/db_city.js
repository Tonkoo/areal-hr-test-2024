const client = require("../db");

async function getCity() {
  try {
    const result = await client.query("SELECT * FROM citys");
    return result.rows;
  } catch (error) {
    console.error("Error fetching regions:", error);
    throw error;
  }
}

module.exports = {
  getCity,
};
