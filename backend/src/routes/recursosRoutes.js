const express = require('express');

const {
  listar,
  obtener,
  sugeridos,
} = require('../controllers/recursosController');

const router = express.Router();

// /sugeridos antes de /:id para que express no lo trate como id="sugeridos".
router.get('/sugeridos', sugeridos);
router.get('/:id', obtener);
router.get('/', listar);

module.exports = router;
