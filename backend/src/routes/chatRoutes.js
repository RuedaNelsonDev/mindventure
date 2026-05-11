const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');
const { validarCampos } = require('../middleware/validacionMiddleware');
const { validadoresEnviar } = require('../utils/validadoresChat');
const {
  enviar,
  historial,
  obtenerConsulta,
  eliminarConsulta,
} = require('../controllers/chatController');

const router = express.Router();

router.post('/enviar', authMiddleware, validadoresEnviar, validarCampos, enviar);
router.get('/historial', authMiddleware, historial);
router.get('/:id', authMiddleware, obtenerConsulta);
router.delete('/:id', authMiddleware, eliminarConsulta);

module.exports = router;
