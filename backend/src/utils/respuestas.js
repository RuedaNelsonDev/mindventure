function exito(res, data, mensaje = 'OK', status = 200) {
  return res.status(status).json({
    success: true,
    data,
    mensaje,
  });
}

function error(res, mensaje, status = 400, detalles = null) {
  return res.status(status).json({
    success: false,
    mensaje,
    detalles,
  });
}

module.exports = { exito, error };
