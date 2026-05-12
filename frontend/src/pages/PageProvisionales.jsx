import { Link } from 'react-router-dom';

function Placeholder({ titulo, ruta, descripcion }) {
  return (
    <div className="py-16 text-center">
      <h1 className="text-3xl font-bold text-text-main mb-2">{titulo}</h1>
      <p className="text-text-muted mb-4">
        {descripcion || 'Implementado en el proximo prompt.'}
      </p>
      <code className="inline-block px-3 py-1 rounded bg-primary-100 text-primary-700 text-xs">
        {ruta}
      </code>
    </div>
  );
}

function FullScreenPlaceholder({ titulo, ruta }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="text-5xl mb-4">🧠</div>
        <Placeholder titulo={titulo} ruta={ruta} />
        <Link
          to="/login"
          className="inline-block mt-4 text-sm text-primary-700 hover:underline"
        >
          ← Volver al login
        </Link>
      </div>
    </div>
  );
}

export function PageLoginPlaceholder() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="text-5xl mb-4">🧠</div>
        <Placeholder titulo="Login" ruta="/login" />
      </div>
    </div>
  );
}

export function PageRegistroPlaceholder() {
  return <FullScreenPlaceholder titulo="Registro" ruta="/registro" />;
}

export function PageDashboardPlaceholder() {
  return <Placeholder titulo="Dashboard" ruta="/dashboard" />;
}

export function PageChatPlaceholder() {
  return <Placeholder titulo="Chat con IA" ruta="/chat" />;
}

export function PageVRPlaceholder() {
  return <Placeholder titulo="Sesiones VR" ruta="/vr" />;
}

export function PageMonitoreoPlaceholder() {
  return <Placeholder titulo="Monitoreo emocional" ruta="/monitoreo" />;
}

export function PageRecursosPlaceholder() {
  return <Placeholder titulo="Recursos psicoeducativos" ruta="/recursos" />;
}

export function PageNotFoundPlaceholder() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🤔</div>
        <h1 className="text-3xl font-bold text-text-main mb-2">
          Pagina no encontrada
        </h1>
        <p className="text-text-muted mb-6">La ruta que buscas no existe.</p>
        <Link
          to="/dashboard"
          className="inline-block px-4 py-2 rounded-md bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
