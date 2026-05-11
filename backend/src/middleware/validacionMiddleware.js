const { validationResult } = require('express-validator');
const { error } = require('../utils/respuestas');

function validarCampos(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return error(res, 'Errores de validacion', 422, result.array());
  }
  return next();
}

module.exports = { validarCampos };
