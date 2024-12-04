const Joi = require('joi')

const employeeSchema = Joi.object({
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
  date_of_birth: Joi.date().required().messages({
    'any.required': 'Поле "Дата рождения" обязательно',
    'date.empty': 'Поле "Дата рождения" не может быть пустым',
  }),
  passport_series: Joi.string()
    .pattern(/^\d{4}$/)
    .required()
    .messages({
      'any.required': 'Поле "Серия паспорта" обязательно',
      'string.empty': 'Поле "Серия паспорта" не может быть пустым',
      'string.pattern.base':
        'Поле "Серия паспорта" должно содержать ровно 4 цифры',
    }),
  passport_number: Joi.string()
    .pattern(/^\d{6}$/)
    .required()
    .messages({
      'any.required': 'Поле "Номер паспорта" обязательно',
      'string.empty': 'Поле "Номер паспорта" не может быть пустым',
      'string.pattern.base':
        'Поле "Номер паспорта" должно содержать ровно 6 цифр',
    }),
  region_id: Joi.number().integer().required().messages({
    'any.required': 'Поле "Регион" обязательно для заполнения',
    'number.base': 'Поле "Регион" не может быть пустым',
  }),
  city_id: Joi.number().integer().required().messages({
    'any.required': 'Поле "Город" обязательно для заполнения',
    'number.base': 'Поле "Город" не может быть пустым',
  }),
  street: Joi.string().min(3).max(100).required().messages({
    'any.required': 'Поле "Улица" обязательно для заполнения',
    'string.empty': 'Поле "Улица" не может быть пустым',
    'string.min': 'Поле "Улица" должно содержать минимум 3 символа',
    'string.max': 'Поле "Улица" не должно превышать 50 символов',
  }),
  house: Joi.string()
    .pattern(/^[a-zA-Z0-9а-яА-Я/-]*$/)
    .required()
    .messages({
      'any.required': 'Поле "Номер дома" обязательно',
      'string.empty': 'Поле "Номер дома" не может быть пустым',
      'string.pattern.base':
        'Поле "Номер дома" может содержать только буквы, цифры, дефис или дробь',
    }),
  building: Joi.string()
    .pattern(/^[a-zA-Z0-9а-яА-Я/-]*$/)
    .allow(null, '')
    .messages({
      'string.pattern.base':
        'Поле "Корпус дома" может содержать только буквы, цифры, дефис или дробь',
    }),
  apartment: Joi.number().integer().positive().allow(null, '').messages({
    'number.base': 'Поле "Квартира" должно быть числом',
    'number.integer': 'Поле "Квартира" должно быть целым числом',
    'number.positive': 'Поле "Квартира" должно быть положительным числом',
  }),
  department_id: Joi.number().integer().required().messages({
    'any.required': 'Поле "Отдел" обязательно для заполнения',
    'number.base': 'Поле "Отдел" не может быть пустым',
  }),
  position_id: Joi.number().integer().required().messages({
    'any.required': 'Поле "Должность" обязательно для заполнения',
    'number.base': 'Поле "Должность" не может быть пустым',
  }),
  salary: Joi.number().precision(2).min(1).required().messages({
    'any.required': 'Поле "Зарплата" обязательно',
    'number.base': 'Поле "Зарплата" должно быть числом',
    'number.precision':
      'Поле "Зарплата" должно иметь не более двух знаков после запятой',
    'number.min': 'Зарплата должна быть больше 0',
  }),
})

module.exports = employeeSchema
