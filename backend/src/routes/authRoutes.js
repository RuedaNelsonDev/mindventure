const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');
const { validarCampos } = require('../middleware/validacionMiddleware');
const {
  validadoresRegistro,
  validadoresLogin,
} = require('../utils/validadoresAuth');
const {
  registrar,
  login,
  perfil,
  actualizarPerfil,
} = require('../controllers/authController');

const router = express.Router();

router.post('/registrar', validadoresRegistro, validarCampos, registrar);
router.post('/login', validadoresLogin, validarCampos, login);
router.get('/perfil', authMiddleware, perfil);
router.patch('/perfil', authMiddleware, actualizarPerfil);

module.exports = router;
