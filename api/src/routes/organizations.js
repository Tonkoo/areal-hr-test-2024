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
  try {
    const organizations = await getOrganizations()
    res.json(organizations)
  } catch (err) {
    console.error('Error fetching organizations:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/organizations/history/:id', async (req, res) => {
  try {
    const { id } = req.params
    const historyOrganizations = await getHistoryOrganizations(id)
    res.json(historyOrganizations)
  } catch (err) {
    console.error('Error fetching history organizations:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/organizations', async (req, res) => {
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

    res.status(201).json(newOrganization)
  } catch (err) {
    console.error('Error saving organization:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.put('/organizations/:id', async (req, res) => {
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
    res.status(201).json(updatedOrganizations)
  } catch (err) {
    console.error('Error updating organization:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.delete('/organizations/:id', async (req, res) => {
  const { id } = req.params
  try {
    const deltedOrganizations = await deleteOrganization(id)
    res.status(201).json(deltedOrganizations)
  } catch (err) {
    console.error('Error deleting organization:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
