const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');
const { validarCampos } = require('../middleware/validacionMiddleware');
const {
  validadoresIniciar,
  validadoresFinalizar,
} = require('../utils/validadoresVR');
const {
  iniciar,
  finalizar,
  listar,
  estadisticas,
} = require('../controllers/vrController');

const router = express.Router();

router.post(
  '/iniciar',
  authMiddleware,
  validadoresIniciar,
  validarCampos,
  iniciar
);
router.patch(
  '/:id/finalizar',
  authMiddleware,
  validadoresFinalizar,
  validarCampos,
  finalizar
);
router.get('/sesiones', authMiddleware, listar);
router.get('/estadisticas', authMiddleware, estadisticas);

module.exports = router;
