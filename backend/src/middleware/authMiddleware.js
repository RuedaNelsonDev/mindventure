const { verificarToken } = require('../utils/jwt');
const { error } = require('../utils/respuestas');

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || req.headers.Authorization;

  if (!header || typeof header !== 'string' || !header.startsWith('Bearer ')) {
    return error(res, 'Token no proporcionado', 401);
  }

  const token = header.slice('Bearer '.length).trim();

  if (!token) {
    return error(res, 'Token no proporcionado', 401);
  }

  try {
    const payload = verificarToken(token);
    if (!payload || !payload.userId) {
      return error(res, 'Token invalido o expirado', 401);
    }
    req.userId = payload.userId;
    return next();
  } catch (err) {
    console.error('[Auth] Token rechazado:', err.name, '-', err.message);
    return error(res, 'Token invalido o expirado', 401);
  }
}

module.exports = authMiddleware;
