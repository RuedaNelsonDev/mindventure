const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');
const { validarCampos } = require('../middleware/validacionMiddleware');
const { validadoresRegistrar } = require('../utils/validadoresMonitoreo');
const {
  registrar,
  listar,
  hoy,
  resumen,
} = require('../controllers/monitoreoController');

const router = express.Router();

router.post(
  '/registros',
  authMiddleware,
  validadoresRegistrar,
  validarCampos,
  registrar
);
router.get('/registros', authMiddleware, listar);
router.get('/hoy', authMiddleware, hoy);
router.get('/resumen', authMiddleware, resumen);

module.exports = router;
