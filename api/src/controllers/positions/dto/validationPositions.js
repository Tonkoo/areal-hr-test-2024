const Joi = require('joi')

const positionSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    'string.base': 'Название должно быть строкой',
    'string.empty': 'Название не может быть пустым',
    'string.min': 'Название должно содержать минимум 3 символа',
    'string.max': 'Название не должно превышать 50 символов',
    'any.required': 'Название обязательно для заполнения',
  }),
  department_id: Joi.number().integer().required().messages({
    'any.required': 'Название отдела обязательно для заполнения',
    'number.base': 'ID отдела не может быть пустым',
  }),
})

module.exports = positionSchema
