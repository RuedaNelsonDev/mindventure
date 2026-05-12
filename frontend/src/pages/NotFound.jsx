import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function NotFound() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="w-full max-w-md">
        <div className="bg-surface shadow-xl rounded-2xl p-8 text-center space-y-4">
          <div className="text-9xl leading-none" aria-hidden="true">🧠</div>
          <h1 className="text-6xl font-bold text-text-main tabular-nums">404</h1>
          <h2 className="text-xl font-semibold text-text-main">
            Esta ruta no existe en MindVenture
          </h2>
          <p className="text-text-muted leading-relaxed">
            Parece que te perdiste. Pero tranquilo, todos nos perdemos a veces.
            Lo importante es saber volver.
          </p>
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-full py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 active:bg-primary-800 transition-colors"
            >
              Volver al Dashboard
            </button>
            <button
              type="button"
              onClick={() => logout()}
              className="text-sm text-text-muted hover:text-primary-700 hover:underline transition-colors"
            >
              O cierra sesion
            </button>
          </div>
        </div>
        <p className="text-center text-xs text-text-muted mt-4">
          © 2026 MindVenture · Proyecto Academico UNAD
        </p>
      </div>
    </div>
  );
}
