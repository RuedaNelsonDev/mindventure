const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('[DB] Falta la variable de entorno MONGODB_URI. Revisa tu archivo .env');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`[DB] Conexion exitosa a MongoDB -> host: ${conn.connection.host} / db: ${conn.connection.name}`);
  } catch (error) {
    console.error('[DB] Error al conectar con MongoDB:', error.message);
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('[DB] MongoDB se ha desconectado');
  });

  mongoose.connection.on('error', (err) => {
    console.error('[DB] Error en la conexion de MongoDB:', err.message);
  });
}

module.exports = connectDB;
