const jwt = require('jsonwebtoken');

function generarToken(userId) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET no esta configurado en las variables de entorno');
  }
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ userId: String(userId) }, secret, { expiresIn });
}

function verificarToken(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET no esta configurado en las variables de entorno');
  }
  return jwt.verify(token, secret);
}

module.exports = { generarToken, verificarToken };
