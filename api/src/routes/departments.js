const express = require('express')
const router = express.Router()
const {
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} = require('../controllers/departments/db_departments')

router.get('/departments', async (req, res) => {
  try {
    const departments = await getDepartments()
    res.json(departments)
  } catch (err) {
    console.error('Error fetching departments:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/departments', async (req, res) => {
  const { name, comment, parent_id, organization_id } = req.body

  if (!name || !comment || !organization_id) {
    return res
      .status(400)
      .json({ error: 'Name, comment, and organization_id are required' })
  }

  try {
    const newDepartment = await addDepartment(
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
  const { id } = req.params
  const { name, comment, parent_id, organization_id } = req.body

  if (!name || !comment || !organization_id) {
    return res
      .status(400)
      .json({ error: 'Name, comment, and organization_id are required' })
  }

  try {
    const updatedDepartment = await updateDepartment(
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
