const { body } = require('express-validator');

const validadoresRegistro = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Formato de email invalido')
    .normalizeEmail(),
  body('password')
    .isString()
    .withMessage('La contrasena debe ser texto')
    .isLength({ min: 8 })
    .withMessage('La contrasena debe tener al menos 8 caracteres')
    .matches(/[A-Za-z]/)
    .withMessage('La contrasena debe contener al menos una letra')
    .matches(/\d/)
    .withMessage('La contrasena debe contener al menos un numero'),
  body('consentimientoDatos')
    .exists({ values: 'null' })
    .withMessage('Debes aceptar el consentimiento de datos')
    .isBoolean({ strict: false })
    .withMessage('consentimientoDatos debe ser un valor booleano')
    .custom((value) => value === true || value === 'true')
    .withMessage('Debes aceptar el consentimiento de datos para registrarte'),
];

const validadoresLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Formato de email invalido')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('La contrasena es obligatoria'),
];

module.exports = { validadoresRegistro, validadoresLogin };
