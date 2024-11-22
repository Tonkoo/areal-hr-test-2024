const express = require('express')
const router = express.Router()
const {
  getPositions,
  addPosition,
  updatePosition,
  deletePosition,
} = require('../controllers/db_positions')

router.get('/positions', async (req, res) => {
  try {
    const positions = await getPositions()
    res.json(positions)
  } catch (err) {
    console.error('Error fetching positions:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/positions', async (req, res) => {
  const { position_name, department_id } = req.body

  if (!position_name || !department_id) {
    return res
      .status(400)
      .json({ error: 'position_name and department_id are required' })
  }

  try {
    const newPosition = await addPosition(position_name, department_id)
    res.status(201).json(newPosition)
  } catch (err) {
    console.error('Error adding position:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.put('/positions/:id', async (req, res) => {
  const { id } = req.params
  const { position_name, department_id } = req.body

  if (!position_name || !department_id) {
    return res
      .status(400)
      .json({ error: 'position_name and department_id are required' })
  }

  try {
    const updatedPosition = await updatePosition(
      id,
      position_name,
      department_id,
    )
    res.status(201).json(updatedPosition)
  } catch (err) {
    console.error('Error updating position:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.delete('/positions/:id', async (req, res) => {
  const { id } = req.params

  try {
    const deltedPosition = await deletePosition(id)
    res.status(201).json(deltedPosition)
  } catch (err) {
    console.error('Error deleting position:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
