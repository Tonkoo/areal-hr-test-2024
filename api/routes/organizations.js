const express = require('express');
const router = express.Router();
const client = require('../db');

router.get('/organizations', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM organizations');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching organizations:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;