const Joi = require('joi')

const UsersSchema = Joi.object({
  last_name: Joi.string()
    .min(3)
    .max(255)
    .required()
    .regex(/^[^\d]*$/)
    .messages({
      'any.required': 'Поле "Фамилия" обязательно',
      'string.pattern.base': 'Поле "Фамилия" не может содержать цифры',
      'string.empty': 'Поле "Фамилия" не может быть пустым',
      'string.min': 'Поле "Фамилия" должно быть не короче 3 символов',
      'string.max': 'Поле "Фамилия" не может быть длиннее 100 символов',
    }),
  first_name: Joi.string()
    .min(3)
    .max(100)
    .required()
    .regex(/^[^\d]*$/)
    .messages({
      'any.required': 'Поле "Имя" обязательно',
      'string.pattern.base': 'Поле "Имя" не может содержать цифры',
      'string.empty': 'Поле "Имя" не может быть пустым',
      'string.min': 'Поле "Имя" должно быть не короче 3 символов',
      'string.max': 'Поле "Имя" не может быть длиннее 100 символов',
    }),
  middle_name: Joi.string()
    .min(3)
    .max(100)
    .regex(/^[^\d]*$/)
    .allow(null, '')
    .messages({
      'string.pattern.base': 'Поле "Отчество" не может содержать цифры',
      'string.min': 'Поле "Отчество" должно быть не короче 3 символов',
      'string.max': 'Поле "Отчество" не может быть длиннее 100 символов',
    }),
  login: Joi.string()
    .pattern(/^[a-zA-Z0-9]+$/)
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.empty': 'Поле "Логин" не может быть пустым',
      'string.pattern.base':
        'Поле "Логин" должен содержать только буквы и цифры без символов',
      'string.min': 'Поле "Логин" должен содержать не менее 3 символов',
      'string.max': 'Поле "Логин" не может превышать 30 символов',
      'any.required': 'Поле "Логин" обязателен',
    }),
  password: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/,
    )
    .required()
    .messages({
      'string.empty': 'Поле "Пароль" не может быть пустым',
      'string.pattern.base':
        'Пароль должен содержать минимум 8 символов, включая заглавные и строчные буквы, цифру и хотя бы один из следующих специальных символов: @$!%*?&',
      'any.required': 'Поле "Пароль" обязателен',
    }),
})

module.exports = UsersSchema
