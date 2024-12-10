const express = require('express')
const router = express.Router()
const positionSchema = require('../controllers/positions/dto/validation-positions')
const {
  getPositions,
  addPosition,
  updatePosition,
  deletePosition,
  getHistoryPositions,
} = require('../controllers/positions/db-positions')

router.get('/positions', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const positions = await getPositions()
      return res.json(positions)
    } catch (err) {
      console.error('Error fetching positions:', err)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
  return res.status(401).json({ message: 'Неавторизованный доступ' })
})

router.get('/positions/history/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const { id } = req.params
      const historyPositions = await getHistoryPositions(id)
      return res.json(historyPositions)
    } catch (err) {
      console.error('Error fetching history positions:', err)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
  return res.status(401).json({ message: 'Неавторизованный доступ' })
})

router.post('/positions', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const { error, value } = positionSchema.validate(req.body, {
        abortEarly: false,
      })
      if (error) {
        const errorMessages = error.details.reduce((acc, detail) => {
          acc[detail.path[0]] = detail.message
          return acc
        }, {})
        return res.status(400).json({ errors: errorMessages })
      }
      const { name, department_id } = value
      const newPosition = await addPosition(req, name, department_id)
      return res.status(201).json(newPosition)
    } catch (err) {
      console.error('Error adding position:', err)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
  return res.status(401).json({ message: 'Неавторизованный доступ' })
})

router.put('/positions/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const { error, value } = positionSchema.validate(req.body, {
        abortEarly: false,
      })

      if (error) {
        const errorMessages = error.details.reduce((acc, detail) => {
          acc[detail.path[0]] = detail.message
          return acc
        }, {})
        return res.status(400).json({ errors: errorMessages })
      }

      const { id } = req.params
      const { name, department_id } = value
      const updatedPosition = await updatePosition(req, id, name, department_id)
      return res.status(201).json(updatedPosition)
    } catch (err) {
      console.error('Error updating position:', err)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
  return res.status(401).json({ message: 'Неавторизованный доступ' })
})

router.delete('/positions/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    const { id } = req.params

    try {
      const deltedPosition = await deletePosition(id)
      return res.status(201).json(deltedPosition)
    } catch (err) {
      console.error('Error deleting position:', err)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
  return res.status(401).json({ message: 'Неавторизованный доступ' })
})

module.exports = router
