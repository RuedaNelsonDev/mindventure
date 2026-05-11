const mongoose = require('mongoose');
const { SesionVR } = require('../models');
const { exito, error } = require('../utils/respuestas');

const LISTA_MAX = 50;

async function iniciar(req, res) {
  try {
    const { tipoEscena, nivelEstresAntes } = req.body;

    const sesion = await SesionVR.create({
      userId: req.userId,
      tipoEscena,
      nivelEstresAntes,
      duracionSegundos: 0,
      completada: false,
    });

    return exito(res, { sesion }, 'Sesion VR iniciada', 201);
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      console.error('[VR] ValidationError en iniciar:', err.message);
      return error(res, 'Datos invalidos', 422, err.errors);
    }
    console.error('[VR] Error al iniciar sesion:', err);
    return error(res, 'Error al iniciar la sesion VR', 500);
  }
}

async function finalizar(req, res) {
  try {
    const { id } = req.params;
    const { nivelEstresDespues, duracionSegundos, notas } = req.body;

    const update = {
      nivelEstresDespues,
      duracionSegundos,
      completada: true,
    };
    if (notas !== undefined) update.notas = notas;

    const sesion = await SesionVR.findOneAndUpdate(
      { _id: id, userId: req.userId },
      update,
      { new: true, runValidators: true, context: 'query' }
    );

    if (!sesion) {
      return error(res, 'Sesion VR no encontrada', 404);
    }

    return exito(res, { sesion }, 'Sesion VR finalizada');
  } catch (err) {
    if (err && err.name === 'CastError') {
      return error(res, 'ID de sesion invalido', 400);
    }
    if (err && err.name === 'ValidationError') {
      console.error('[VR] ValidationError en finalizar:', err.message);
      return error(res, 'Datos invalidos', 422, err.errors);
    }
    console.error('[VR] Error al finalizar sesion:', err);
    return error(res, 'Error al finalizar la sesion VR', 500);
  }
}

async function listar(req, res) {
  try {
    const sesiones = await SesionVR.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(LISTA_MAX)
      .lean();

    return exito(res, { sesiones, total: sesiones.length });
  } catch (err) {
    console.error('[VR] Error al listar sesiones:', err);
    return error(res, 'Error al listar las sesiones', 500);
  }
}

async function estadisticas(req, res) {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.userId);

    const [totalesAgg, escenaAgg] = await Promise.all([
      SesionVR.aggregate([
        { $match: { userId: userObjectId } },
        {
          $group: {
            _id: null,
            totalSesiones: { $sum: 1 },
            sesionesCompletadas: { $sum: { $cond: ['$completada', 1, 0] } },
            tiempoTotalSegundos: { $sum: '$duracionSegundos' },
            sumaReduccion: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ['$completada', true] },
                      { $ne: ['$nivelEstresDespues', null] },
                    ],
                  },
                  { $subtract: ['$nivelEstresAntes', '$nivelEstresDespues'] },
                  0,
                ],
              },
            },
            countConReduccion: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ['$completada', true] },
                      { $ne: ['$nivelEstresDespues', null] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]),
      SesionVR.aggregate([
        { $match: { userId: userObjectId } },
        { $group: { _id: '$tipoEscena', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 },
      ]),
    ]);

    const t = totalesAgg[0] || {};
    const totalSesiones = t.totalSesiones || 0;
    const sesionesCompletadas = t.sesionesCompletadas || 0;
    const tiempoTotalSegundos = t.tiempoTotalSegundos || 0;
    const countConReduccion = t.countConReduccion || 0;
    const sumaReduccion = t.sumaReduccion || 0;
    const promedioReduccionEstres =
      countConReduccion > 0
        ? Number((sumaReduccion / countConReduccion).toFixed(2))
        : 0;
    const escenaMasUsada = escenaAgg[0]?._id || null;

    return exito(res, {
      totalSesiones,
      sesionesCompletadas,
      tiempoTotalSegundos,
      promedioReduccionEstres,
      escenaMasUsada,
    });
  } catch (err) {
    console.error('[VR] Error en estadisticas:', err);
    return error(res, 'Error al calcular estadisticas', 500);
  }
}

module.exports = { iniciar, finalizar, listar, estadisticas };
