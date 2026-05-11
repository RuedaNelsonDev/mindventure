# MindVenture - Backend

API REST de **MindVenture**, plataforma de apoyo psicologico para comunidades vulnerables de Colombia.

## Stack

- Node.js 20+
- Express 4
- MongoDB + Mongoose
- JWT para autenticacion
- Integracion con DeepSeek API

## Requisitos previos

- Node.js >= 20
- npm >= 10
- Instancia de MongoDB (local o Atlas)

## Instalacion

```bash
cd backend
npm install
```

## Configuracion

1. Copia el archivo de ejemplo de variables de entorno:

   ```bash
   cp .env.example .env
   ```

2. Completa las variables en `.env`:

   | Variable | Descripcion |
   | --- | --- |
   | `PORT` | Puerto donde corre la API (ej. `5000`) |
   | `NODE_ENV` | Entorno de ejecucion (`development` o `production`) |
   | `MONGODB_URI` | Cadena de conexion a MongoDB |
   | `JWT_SECRET` | Clave secreta para firmar JWT |
   | `JWT_EXPIRES_IN` | Tiempo de vida del token (ej. `7d`) |
   | `DEEPSEEK_API_KEY` | API key de DeepSeek |
   | `DEEPSEEK_API_URL` | Endpoint base de DeepSeek |
   | `FRONTEND_URL` | URL del frontend para configurar CORS |

## Scripts

| Comando | Descripcion |
| --- | --- |
| `npm run dev` | Inicia el servidor con **nodemon** (hot reload) |
| `npm start` | Inicia el servidor en modo produccion |
| `npm run seed` | Pobla la base de datos con recursos iniciales |

## Estructura del proyecto

```
backend/
├── src/
│   ├── config/         # Configuracion (DB, etc.)
│   ├── controllers/    # Logica de los endpoints
│   ├── middleware/     # Middlewares (auth, validacion, errores)
│   ├── models/         # Modelos de Mongoose
│   ├── routes/         # Definicion de rutas
│   ├── scripts/        # Scripts utilitarios (seeds, etc.)
│   ├── services/       # Servicios externos (DeepSeek, etc.)
│   ├── utils/          # Helpers reutilizables
│   └── server.js       # Punto de entrada
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Health check

Una vez iniciado el servidor, verifica que esta corriendo:

```
GET http://localhost:5000/api/health
```

Respuesta esperada:

```json
{ "status": "ok", "timestamp": "2026-05-11T00:00:00.000Z" }
```
