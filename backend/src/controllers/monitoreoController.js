const mongoose = require('mongoose');
const { RegistroEmocional } = require('../models');
const { exito, error } = require('../utils/respuestas');

const LISTA_MAX = 30;
const COLOMBIA_OFFSET_HORAS = 5;
const MS_DIA = 24 * 60 * 60 * 1000;
const ESTADOS = ['muy_mal', 'mal', 'neutral', 'bien', 'muy_bien'];
const UMBRAL_TENDENCIA = 0.3;

// Inicio del dia "hoy en Colombia" expresado en UTC.
// Colombia esta en UTC-5 (sin DST), asi que el inicio del dia local
// equivale a 05:00 UTC del mismo dia calendario.
function inicioDiaColombia(referencia = new Date()) {
  const offsetMs = COLOMBIA_OFFSET_HORAS * 60 * 60 * 1000;
  const wall = new Date(referencia.getTime() - offsetMs);
  return new Date(
    Date.UTC(
      wall.getUTCFullYear(),
      wall.getUTCMonth(),
      wall.getUTCDate(),
      COLOMBIA_OFFSET_HORAS,
      0,
      0,
      0
    )
  );
}

async function registrar(req, res) {
  try {
    const { estadoAnimo, nota } = req.body;

    const doc = { userId: req.userId, estadoAnimo };
    if (nota !== undefined) doc.nota = nota;

    const registro = await RegistroEmocional.create(doc);

    return exito(res, { registro }, 'Registro guardado', 201);
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      console.error('[Monitoreo] ValidationError en registrar:', err.message);
      return error(res, 'Datos invalidos', 422, err.errors);
    }
    console.error('[Monitoreo] Error al registrar:', err);
    return error(res, 'Error al guardar el registro', 500);
  }
}

async function listar(req, res) {
  try {
    const registros = await RegistroEmocional.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(LISTA_MAX)
      .lean();

    return exito(res, { registros, total: registros.length });
  } catch (err) {
    console.error('[Monitoreo] Error al listar:', err);
    return error(res, 'Error al listar los registros', 500);
  }
}

async function hoy(req, res) {
  try {
    const inicio = inicioDiaColombia();
    const fin = new Date(inicio.getTime() + MS_DIA);

    const registro = await RegistroEmocional.findOne({
      userId: req.userId,
      createdAt: { $gte: inicio, $lt: fin },
    })
      .sort({ createdAt: -1 })
      .lean();

    return exito(res, { registro });
  } catch (err) {
    console.error('[Monitoreo] Error en hoy:', err);
    return error(res, 'Error al obtener el registro de hoy', 500);
  }
}

async function resumen(req, res) {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.userId);
    const inicioHoy = inicioDiaColombia();
    const inicioSemana = new Date(inicioHoy.getTime() - 6 * MS_DIA);
    const inicioMes = new Date(inicioHoy.getTime() - 29 * MS_DIA);
    const inicioPrevSemana = new Date(inicioHoy.getTime() - 13 * MS_DIA);
    const finManana = new Date(inicioHoy.getTime() + MS_DIA);

    const [
      promSemanaAgg,
      promMesAgg,
      promPrevAgg,
      totalRegistros,
      distribAgg,
      diasConRegistro,
    ] = await Promise.all([
      RegistroEmocional.aggregate([
        {
          $match: {
            userId: userObjectId,
            createdAt: { $gte: inicioSemana, $lt: finManana },
          },
        },
        { $group: { _id: null, promedio: { $avg: '$valorNumerico' } } },
      ]),
      RegistroEmocional.aggregate([
        {
          $match: {
            userId: userObjectId,
            createdAt: { $gte: inicioMes, $lt: finManana },
          },
        },
        { $group: { _id: null, promedio: { $avg: '$valorNumerico' } } },
      ]),
      RegistroEmocional.aggregate([
        {
          $match: {
            userId: userObjectId,
            createdAt: { $gte: inicioPrevSemana, $lt: inicioSemana },
          },
        },
        { $group: { _id: null, promedio: { $avg: '$valorNumerico' } } },
      ]),
      RegistroEmocional.countDocuments({ userId: req.userId }),
      RegistroEmocional.aggregate([
        {
          $match: {
            userId: userObjectId,
            createdAt: { $gte: inicioMes, $lt: finManana },
          },
        },
        { $group: { _id: '$estadoAnimo', count: { $sum: 1 } } },
      ]),
      RegistroEmocional.find({ userId: req.userId })
        .sort({ createdAt: -1 })
        .select('createdAt')
        .limit(120)
        .lean(),
    ]);

    const promedioSemana = Number((promSemanaAgg[0]?.promedio || 0).toFixed(2));
    const promedioMes = Number((promMesAgg[0]?.promedio || 0).toFixed(2));
    const promedioPrev = promPrevAgg[0]?.promedio;

    let tendencia = 'estable';
    if (promSemanaAgg.length > 0 && promPrevAgg.length > 0) {
      const delta = promedioSemana - promedioPrev;
      if (delta > UMBRAL_TENDENCIA) tendencia = 'subiendo';
      else if (delta < -UMBRAL_TENDENCIA) tendencia = 'bajando';
    }

    const distribucionEstados = ESTADOS.reduce((acc, e) => {
      acc[e] = 0;
      return acc;
    }, {});
    for (const d of distribAgg) {
      if (d._id in distribucionEstados) distribucionEstados[d._id] = d.count;
    }

    // Dias consecutivos (racha activa terminando hoy o ayer).
    let diasConsecutivos = 0;
    if (diasConRegistro.length > 0) {
      const diasUnicos = new Set();
      for (const r of diasConRegistro) {
        diasUnicos.add(inicioDiaColombia(r.createdAt).getTime());
      }
      const ordenadosDesc = [...diasUnicos].sort((a, b) => b - a);
      const hoyTs = inicioHoy.getTime();
      const ayerTs = hoyTs - MS_DIA;

      let cursor = null;
      if (ordenadosDesc[0] === hoyTs) cursor = hoyTs;
      else if (ordenadosDesc[0] === ayerTs) cursor = ayerTs;

      if (cursor !== null) {
        for (const d of ordenadosDesc) {
          if (d === cursor) {
            diasConsecutivos++;
            cursor -= MS_DIA;
          } else if (d < cursor) {
            break;
          }
        }
      }
    }

    return exito(res, {
      promedioSemana,
      promedioMes,
      tendencia,
      totalRegistros,
      distribucionEstados,
      diasConsecutivos,
    });
  } catch (err) {
    console.error('[Monitoreo] Error en resumen:', err);
    return error(res, 'Error al calcular el resumen', 500);
  }
}

module.exports = { registrar, listar, hoy, resumen };
