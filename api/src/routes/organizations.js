const express = require('express')
const router = express.Router()
const {
  organizationSchema,
} = require('../controllers/organizations/dto/validation-organizations')
const {
  getOrganizations,
  addOrganization,
  updateOrganization,
  deleteOrganization,
  getHistoryOrganizations,
} = require('../controllers/organizations/db-organizations')

router.get('/organizations', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const organizations = await getOrganizations()
      return res.json(organizations)
    } catch (err) {
      console.error('Error fetching organizations:', err)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
  return res.status(401).json({ message: 'Неавторизованный доступ' })
})

router.get('/organizations/history/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const { id } = req.params
      const historyOrganizations = await getHistoryOrganizations(id)
      return res.json(historyOrganizations)
    } catch (err) {
      console.error('Error fetching history organizations:', err)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
  return res.status(401).json({ message: 'Неавторизованный доступ' })
})

router.post('/organizations', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const { error, value } = organizationSchema.validate(req.body, {
        abortEarly: false,
      })

      if (error) {
        const errorMessages = error.details.reduce((acc, detail) => {
          acc[detail.path[0]] = detail.message
          return acc
        }, {})
        return res.status(400).json({ errors: errorMessages })
      }

      const { name, comment } = value

      const newOrganization = await addOrganization(req, name, comment)

      return res.status(201).json(newOrganization)
    } catch (err) {
      console.error('Error saving organization:', err)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
  return res.status(401).json({ message: 'Неавторизованный доступ' })
})

router.put('/organizations/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const { error, value } = organizationSchema.validate(req.body, {
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
      const { name, comment } = value

      const updatedOrganizations = await updateOrganization(
        req,
        id,
        name,
        comment,
      )
      return res.status(201).json(updatedOrganizations)
    } catch (err) {
      console.error('Error updating organization:', err)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
  return res.status(401).json({ message: 'Неавторизованный доступ' })
})

router.delete('/organizations/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    const { id } = req.params
    try {
      const deltedOrganizations = await deleteOrganization(id)
      return res.status(201).json(deltedOrganizations)
    } catch (err) {
      console.error('Error deleting organization:', err)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
  return res.status(401).json({ message: 'Неавторизованный доступ' })
})

module.exports = router
