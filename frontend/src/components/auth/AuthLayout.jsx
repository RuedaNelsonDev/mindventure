export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-primary-50 to-secondary-100">
      <div className="w-full max-w-md">
        <div className="bg-surface shadow-xl rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="text-center">
            <div className="text-5xl mb-2" aria-hidden="true">🧠</div>
            <h1 className="text-2xl font-bold text-text-main">MindVenture</h1>
          </div>

          {children}

          <p className="text-xs text-text-muted text-center pt-4 border-t border-primary-100">
            ¿Necesitas ayuda?{' '}
            <span className="font-medium text-primary-700">
              Linea Nacional 192 opcion 4
            </span>{' '}
            (MinSalud)
          </p>
        </div>
      </div>
    </div>
  );
}
