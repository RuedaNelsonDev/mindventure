const { body } = require('express-validator');

const validadoresIniciar = [
  body('tipoEscena')
    .isIn(['playa', 'bosque', 'espacio'])
    .withMessage('tipoEscena debe ser playa, bosque o espacio'),
  body('nivelEstresAntes')
    .isInt({ min: 1, max: 10 })
    .withMessage('nivelEstresAntes debe ser un entero entre 1 y 10'),
];

const validadoresFinalizar = [
  body('nivelEstresDespues')
    .isInt({ min: 1, max: 10 })
    .withMessage('nivelEstresDespues debe ser un entero entre 1 y 10'),
  body('duracionSegundos')
    .isInt({ min: 0 })
    .withMessage('duracionSegundos debe ser un entero >= 0'),
  body('notas')
    .optional()
    .isString()
    .withMessage('notas debe ser texto')
    .isLength({ max: 500 })
    .withMessage('notas no puede superar 500 caracteres'),
];

module.exports = { validadoresIniciar, validadoresFinalizar };
