const { body } = require('express-validator');

const validadoresEnviar = [
  body('pregunta')
    .notEmpty()
    .withMessage('La pregunta es obligatoria')
    .isLength({ min: 1, max: 1000 })
    .withMessage('La pregunta debe tener entre 1 y 1000 caracteres')
    .trim(),
];

module.exports = { validadoresEnviar };
