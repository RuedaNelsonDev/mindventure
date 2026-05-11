require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const vrRoutes = require('./routes/vrRoutes');
const monitoreoRoutes = require('./routes/monitoreoRoutes');
const recursosRoutes = require('./routes/recursosRoutes');

const app = express();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(helmet());

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
);

if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/vr', vrRoutes);
app.use('/api/monitoreo', monitoreoRoutes);
app.use('/api/recursos', recursosRoutes);

app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
});

app.use((err, req, res, _next) => {
  console.error('[Error]', err.stack || err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Error interno del servidor',
    ...(NODE_ENV === 'development' && { stack: err.stack }),
  });
});

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`[Server] MindVenture API corriendo en puerto ${PORT} (${NODE_ENV})`);
    console.log(`[Server] Health check: http://localhost:${PORT}/api/health`);
  });
}

startServer().catch((err) => {
  console.error('[Server] No se pudo iniciar el servidor:', err.message);
  process.exit(1);
});

module.exports = app;
