# MindVenture - Frontend

Frontend de **MindVenture**, plataforma de apoyo psicologico para comunidades vulnerables en Colombia.

## Stack

- React 18 + Vite 6
- Tailwind CSS v4 (plugin oficial de Vite, sin PostCSS)
- React Router v6
- TanStack Query (estado del servidor)
- axios (HTTP)
- Three.js + @react-three/fiber + @react-three/drei (escenas VR)
- Recharts (graficos)
- Lucide React (iconos)
- date-fns (fechas con locale es)
- clsx (clases condicionales)

## Requisitos

- Node.js >= 20
- Backend de MindVenture corriendo en `http://localhost:5000` (ver `/backend`).

## Instalacion

```bash
cd frontend
npm install
```

## Configuracion

Copia `.env.example` a `.env` y ajusta si el backend no esta en localhost:5000:

```
VITE_API_URL=http://localhost:5000/api
```

> Las variables expuestas al cliente DEBEN empezar con `VITE_`.

## Scripts

| Comando | Descripcion |
| --- | --- |
| `npm run dev` | Servidor de desarrollo (Vite, default puerto 5173) |
| `npm run build` | Build de produccion en `dist/` |
| `npm run preview` | Sirve el build localmente |
| `npm run lint` | Corre ESLint |

## Estructura

```
frontend/
├── public/             # Estaticos servidos tal cual
├── src/
│   ├── assets/         # Imagenes, audios
│   ├── components/     # Componentes reutilizables
│   ├── contexts/       # React Contexts (auth, etc.)
│   ├── hooks/          # Custom hooks
│   ├── pages/          # Pantallas / rutas
│   ├── services/       # Clientes API (axios)
│   ├── utils/          # Helpers
│   ├── App.jsx
│   ├── index.css       # @import tailwindcss + @theme
│   └── main.jsx
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

## Tailwind v4 con @theme

Los design tokens se definen en `src/index.css` dentro del bloque `@theme`. Cada
custom property `--color-foo-500` se convierte automaticamente en utilidades
`bg-foo-500`, `text-foo-500`, `border-foo-500`, etc.

Tokens disponibles:
- `primary-50` .. `primary-900` (teal, base #14b8a6)
- `secondary-50` .. `secondary-900` (violeta-lavanda, base #a78bfa)
- `background`, `surface`, `text-main`, `text-muted`
- `font-sans` (Inter)

## Autenticacion

El cliente axios en `src/services/api.js` lee el JWT desde
`localStorage.getItem('mv_token')` y lo envia como `Authorization: Bearer ...`.
Si el backend responde 401, limpia el token y redirige a `/login`.
