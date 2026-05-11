const { Recurso } = require('../models');
const { exito, error } = require('../utils/respuestas');

const LISTA_MAX = 100;
const CATEGORIAS_VALIDAS = [
  'ansiedad',
  'depresion',
  'autoestima',
  'relaciones',
  'meditacion',
];

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function listar(req, res) {
  try {
    const { categoria, buscar } = req.query;

    const filtro = { publicado: true };

    if (categoria) {
      if (!CATEGORIAS_VALIDAS.includes(categoria)) {
        return error(
          res,
          `Categoria invalida. Use: ${CATEGORIAS_VALIDAS.join(', ')}`,
          400
        );
      }
      filtro.categoria = categoria;
    }

    if (buscar && typeof buscar === 'string' && buscar.trim()) {
      const regex = new RegExp(escapeRegex(buscar.trim()), 'i');
      filtro.$or = [{ titulo: regex }, { contenido: regex }];
    }

    const recursos = await Recurso.find(filtro)
      .sort({ createdAt: -1 })
      .limit(LISTA_MAX)
      .lean();

    return exito(res, { recursos, total: recursos.length });
  } catch (err) {
    console.error('[Recursos] Error al listar:', err);
    return error(res, 'Error al listar recursos', 500);
  }
}

async function obtener(req, res) {
  try {
    const { id } = req.params;
    const recurso = await Recurso.findOne({ _id: id, publicado: true }).lean();

    if (!recurso) {
      return error(res, 'Recurso no encontrado', 404);
    }

    return exito(res, { recurso });
  } catch (err) {
    if (err && err.name === 'CastError') {
      return error(res, 'ID de recurso invalido', 400);
    }
    console.error('[Recursos] Error al obtener:', err);
    return error(res, 'Error al obtener el recurso', 500);
  }
}

async function sugeridos(req, res) {
  try {
    const recursos = await Recurso.aggregate([
      { $match: { publicado: true } },
      { $sample: { size: 3 } },
    ]);

    return exito(res, { recursos, total: recursos.length });
  } catch (err) {
    console.error('[Recursos] Error en sugeridos:', err);
    return error(res, 'Error al obtener recursos sugeridos', 500);
  }
}

module.exports = { listar, obtener, sugeridos };
