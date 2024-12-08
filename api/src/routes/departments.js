const express = require('express')
const router = express.Router()
const {
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  getHistoryDepartments,
} = require('../controllers/departments/db-departments')
const departmentSchema = require('../controllers/departments/dto/validationd-departments')

router.get('/departments', async (req, res) => {
  try {
    const departments = await getDepartments()
    res.json(departments)
  } catch (err) {
    console.error('Error fetching departments:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/departments/history/:id', async (req, res) => {
  try {
    const { id } = req.params
    const historyDepartments = await getHistoryDepartments(id)
    res.json(historyDepartments)
  } catch (err) {
    console.error('Error fetching history departments:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/departments', async (req, res) => {
  try {
    const { error, value } = departmentSchema.validate(req.body, {
      abortEarly: false,
    })

    if (error) {
      const errorMessages = error.details.reduce((acc, detail) => {
        acc[detail.path[0]] = detail.message
        return acc
      }, {})
      return res.status(400).json({ errors: errorMessages })
    }

    const { name, comment, parent_id, organization_id } = value
    const newDepartment = await addDepartment(
      req,
      name,
      comment,
      parent_id,
      organization_id,
    )
    res.status(201).json(newDepartment)
  } catch (err) {
    console.error('Error saving department:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.put('/departments/:id', async (req, res) => {
  try {
    const { error, value } = departmentSchema.validate(req.body, {
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
    const { name, comment, parent_id, organization_id } = value

    const updatedDepartment = await updateDepartment(
      req,
      id,
      name,
      comment,
      parent_id,
      organization_id,
    )
    if (!updatedDepartment) {
      return res.status(404).json({ error: 'Department not found' })
    }
    res.json(updatedDepartment)
  } catch (err) {
    console.error('Error updating department:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

router.delete('/departments/:id', async (req, res) => {
  const { id } = req.params

  try {
    const deletedDepartment = await deleteDepartment(id)
    if (!deletedDepartment) {
      return res.status(404).json({ error: 'Department not found' })
    }
    res.status(204).end()
  } catch (err) {
    console.error('Error deleting department:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
