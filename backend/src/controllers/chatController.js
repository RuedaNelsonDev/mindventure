const { Consulta } = require('../models');
const { generarRespuesta } = require('../services/deepseekService');
const { detectarCrisis } = require('../utils/deteccionCrisis');
const { exito, error } = require('../utils/respuestas');

const SUFIJO_CRISIS =
  '\n\n🆘 Si estas en crisis: Linea 192 opcion 4 (MinSalud Colombia) - disponible 24/7. ' +
  'Tambien puedes acudir a urgencias del hospital mas cercano.';

const HISTORIAL_CONTEXTO = 5;
const HISTORIAL_MAX = 50;

async function enviar(req, res) {
  try {
    const { pregunta } = req.body;
    const userId = req.userId;

    const alertaCrisis = detectarCrisis(pregunta);

    const historialReciente = await Consulta.find({ userId })
      .sort({ createdAt: -1 })
      .limit(HISTORIAL_CONTEXTO)
      .lean();

    const historial = historialReciente
      .reverse()
      .map((c) => ({ pregunta: c.pregunta, respuesta: c.respuesta }));

    const { respuesta: respuestaIA, tokensUsados } = await generarRespuesta(
      pregunta,
      historial
    );

    const respuestaFinal = alertaCrisis
      ? `${respuestaIA}${SUFIJO_CRISIS}`
      : respuestaIA;

    const consulta = await Consulta.create({
      userId,
      pregunta,
      respuesta: respuestaFinal,
      modeloIA: 'deepseek-chat',
      tokensUsados,
      alertaCrisis,
    });

    return exito(res, { consulta }, 'Consulta procesada', 201);
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      console.error('[Chat] ValidationError en enviar:', err.message);
      return error(res, 'Datos invalidos', 422, err.errors);
    }
    console.error('[Chat] Error inesperado en enviar:', err);
    return error(res, 'Error al procesar la consulta', 500);
  }
}

async function historial(req, res) {
  try {
    const consultas = await Consulta.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(HISTORIAL_MAX)
      .lean();

    return exito(res, { consultas, total: consultas.length });
  } catch (err) {
    console.error('[Chat] Error al obtener historial:', err);
    return error(res, 'Error al obtener el historial', 500);
  }
}

async function obtenerConsulta(req, res) {
  try {
    const { id } = req.params;
    const consulta = await Consulta.findOne({ _id: id, userId: req.userId });

    if (!consulta) {
      return error(res, 'Consulta no encontrada', 404);
    }
    return exito(res, { consulta });
  } catch (err) {
    if (err && err.name === 'CastError') {
      return error(res, 'ID de consulta invalido', 400);
    }
    console.error('[Chat] Error al obtener consulta:', err);
    return error(res, 'Error al obtener la consulta', 500);
  }
}

async function eliminarConsulta(req, res) {
  try {
    const { id } = req.params;
    const consulta = await Consulta.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!consulta) {
      return error(res, 'Consulta no encontrada', 404);
    }
    return exito(res, { id }, 'Consulta eliminada');
  } catch (err) {
    if (err && err.name === 'CastError') {
      return error(res, 'ID de consulta invalido', 400);
    }
    console.error('[Chat] Error al eliminar consulta:', err);
    return error(res, 'Error al eliminar la consulta', 500);
  }
}

module.exports = { enviar, historial, obtenerConsulta, eliminarConsulta };
