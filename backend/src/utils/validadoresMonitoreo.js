const { body } = require('express-validator');

const validadoresRegistrar = [
  body('estadoAnimo')
    .isIn(['muy_mal', 'mal', 'neutral', 'bien', 'muy_bien'])
    .withMessage('estadoAnimo debe ser muy_mal, mal, neutral, bien o muy_bien'),
  body('nota')
    .optional()
    .isString()
    .withMessage('nota debe ser texto')
    .isLength({ max: 500 })
    .withMessage('nota no puede superar 500 caracteres'),
];

module.exports = { validadoresRegistrar };
