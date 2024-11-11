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

router.post('/organizations', async (req, res) => {
  const { name, comment } = req.body;
  if (!name || !comment) {
    return res.status(400).json({ error: 'Name and comment are required' });
  }

  try {
    const result = await client.query(
      'INSERT INTO organizations (name, comment) VALUES ($1, $2) RETURNING id',
      [name, comment]
    );
    const newOrganization = {
      id: result.rows[0].id,
      name,
      comment
    };

    res.status(201).json(newOrganization);
  } catch (err) {
    console.error('Error saving organization:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;