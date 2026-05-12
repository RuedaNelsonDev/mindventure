# 🧠 MindVenture

Plataforma digital de apoyo psicologico para comunidades vulnerables de
Colombia, integrando **Inteligencia Artificial** y **Realidad Virtual web**.

## Proyecto academico

Proyecto de Grado · Universidad Nacional Abierta y a Distancia (UNAD)
Curso **202016907** · Programa de **Ingenieria de Sistemas**.

### Equipo

| Rol | Integrante |
| --- | --- |
| Investigador principal | Wilmar Lenin Delgado Lopez |
| Coinvestigador y Desarrollo | Nelson Miguel Rueda Chacon |
| Tutor UNAD | Ruben Dario Ordoñez Mantilla |

## Demo en produccion

| Recurso | URL |
| --- | --- |
| Frontend | _Proximamente_ |
| API Backend | _Proximamente_ |
| Repositorio | _Proximamente_ |

## Stack tecnologico

### Frontend
- **React 18** + **Vite 6**
- **Tailwind CSS v4** con plugin oficial de Vite (sin PostCSS)
- **React Router v6**
- **TanStack Query v5**
- **React Three Fiber** + **drei** (escenas VR)
- **Recharts** (graficos)
- **Axios** (HTTP)
- **date-fns** (locale `es`)
- **lucide-react** (iconos)

### Backend
- **Node 20+** con **Express 4**
- **MongoDB Atlas** + **Mongoose**
- **JWT** + **bcryptjs** (autenticacion)
- **DeepSeek API** (chat con IA)
- **Helmet**, **CORS**, **Morgan** (seguridad y logging)
- **express-validator** (validacion de entrada)

## Estructura del proyecto

```
mindventure/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuracion (conexion BD)
│   │   ├── controllers/    # Logica de los endpoints
│   │   ├── middleware/     # Auth, validacion, manejo de errores
│   │   ├── models/         # Esquemas Mongoose
│   │   ├── routes/         # Definicion de rutas Express
│   │   ├── scripts/        # Seeds y pruebas (detector de crisis)
│   │   ├── services/       # Cliente DeepSeek
│   │   ├── utils/          # JWT, validadores, respuestas
│   │   └── server.js       # Entry point
│   ├── .env.example
│   ├── package.json
│   └── test-api.http       # Suite REST Client para pruebas manuales
├── frontend/
│   ├── public/sounds/      # Audio para escenas VR
│   ├── src/
│   │   ├── assets/
│   │   ├── components/     # UI por modulo: auth, chat, dashboard, monitoreo, recursos, vr
│   │   ├── contexts/       # AuthContext
│   │   ├── hooks/          # useAuth, useChat, useMonitoreo, useVR, useRecursos, useDashboard
│   │   ├── pages/          # Pantallas (rutas)
│   │   ├── services/       # api.js (axios)
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── index.css       # @import tailwindcss + @theme
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   └── package.json
├── .gitignore
└── README.md
```

## Modulos implementados

1. **Autenticacion** con consentimiento informado conforme a la **Ley 1581 de 2012** de Colombia (Habeas Data) y modal de Politica de Tratamiento de Datos.
2. **Chatbot con IA** usando **DeepSeek**, con deteccion automatica de crisis (29 frases clave) y derivacion a la **Linea Nacional MinSalud 192 opcion 4**.
3. **Realidad Virtual web** con escena de playa terapeutica y ejercicio de **respiracion guiada 4-7-8** (Three.js + react-three-fiber).
4. **Monitoreo emocional** con escala de 5 estados, graficos de tendencia, distribucion mensual, racha de dias consecutivos y mensajes contextuales (Recharts).
5. **Biblioteca de recursos psicoeducativos** basados en **Terapia Cognitivo-Conductual (TCC)** y **mindfulness** — 10 recursos completos en español colombiano.
6. **Dashboard integrador** con KPIs multi-modulo, accesos rapidos y feed de actividad reciente.

## Instalacion local

### Pre-requisitos
- Node.js 20 o superior
- Cuenta gratuita en [MongoDB Atlas](https://www.mongodb.com/atlas) o instancia local
- API key de [DeepSeek](https://platform.deepseek.com)

### Backend

```bash
git clone <url-del-repo> mindventure
cd mindventure/backend
npm install
cp .env.example .env
# Edita .env con MONGODB_URI, JWT_SECRET, DEEPSEEK_API_KEY, etc.
npm run dev
```

El servidor corre en `http://localhost:5000`. Health check: `GET /api/health`.

### Frontend

```bash
cd mindventure/frontend
npm install
cp .env.example .env
npm run dev
```

La aplicacion corre en `http://localhost:5173`.

## Seeds para la demo

Desde `backend/`:

```bash
# 10 recursos psicoeducativos (TCC, respiracion, mindfulness, etc.)
npm run seed

# ~25 registros emocionales con patron de recuperacion gradual para un usuario
npm run seed:monitoreo -- tu@email.co
```

## Despliegue sugerido

| Componente | Proveedor |
| --- | --- |
| Frontend (Vite build estatico) | [Vercel](https://vercel.com) |
| Backend (Node + Express) | [Render](https://render.com) |
| Base de datos | [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier M0) |

## ⚠️ Aviso importante

> **MindVenture es una herramienta de apoyo emocional, NO sustituye atencion clinica profesional.**
>
> Si estas en crisis llama a la **Linea Nacional MinSalud 192 opcion 4**, disponible las 24 horas.

## Licencia

Proyecto academico UNAD 2026 · No comercial.
