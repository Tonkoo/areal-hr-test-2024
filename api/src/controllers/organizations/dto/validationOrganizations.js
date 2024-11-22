const Joi = require('joi')

const organizationSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    'string.base': 'Название должно быть строкой',
    'string.empty': 'Название не может быть пустым',
    'string.min': 'Название должно быть не короче 3 символов',
    'string.max': 'Название не может быть длиннее 50 символов',
    'any.required': 'Название обязательно',
  }),
  comment: Joi.string().max(250).required().messages({
    'string.base': 'Комментарий должен быть строкой',
    'string.empty': 'Комментарий не может быть пустым',
    'string.max': 'Комментарий не может быть длиннее 250 символов',
    'any.required': 'Комментарий обязателен',
  }),
})

module.exports = {
  organizationSchema,
}
