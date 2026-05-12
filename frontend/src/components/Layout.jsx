import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, LogOut, Menu, User, X } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../contexts/AuthContext';
import PoliticaDatosModal from './PoliticaDatosModal';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/chat', label: 'Chat' },
  { to: '/vr', label: 'VR' },
  { to: '/recursos', label: 'Recursos' },
  { to: '/monitoreo', label: 'Monitoreo' },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);
  const userMenuRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!userMenuOpen) return;
    function onDocClick(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [userMenuOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ───── HEADER ───── */}
      <header className="sticky top-0 z-30 bg-surface shadow-sm border-b border-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-xl font-bold text-text-main hover:opacity-80 transition-opacity"
            >
              <span className="text-2xl" aria-hidden="true">🧠</span>
              <span>MindVenture</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    clsx(
                      'px-3 py-2 text-sm font-medium transition-colors border-b-2',
                      isActive
                        ? 'text-primary-700 border-primary-600'
                        : 'text-text-muted border-transparent hover:text-primary-700'
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              {user && (
                <div ref={userMenuRef} className="hidden md:block relative">
                  <button
                    onClick={() => setUserMenuOpen((o) => !o)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-primary-50 transition-colors"
                    aria-haspopup="menu"
                    aria-expanded={userMenuOpen}
                  >
                    <span className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-700" />
                    </span>
                    <span className="text-sm font-medium text-text-main max-w-[140px] truncate">
                      {user.nombre}
                    </span>
                    <ChevronDown
                      className={clsx(
                        'w-4 h-4 text-text-muted transition-transform',
                        userMenuOpen && 'rotate-180'
                      )}
                    />
                  </button>

                  {userMenuOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 mt-2 w-52 bg-surface rounded-lg shadow-lg border border-primary-100 py-1"
                    >
                      <div className="px-4 py-2 border-b border-primary-100">
                        <div className="text-sm font-medium text-text-main truncate">
                          {user.nombre}
                        </div>
                        <div className="text-xs text-text-muted truncate">
                          {user.email}
                        </div>
                      </div>
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-main hover:bg-primary-50 text-left"
                        role="menuitem"
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar sesion
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden p-2 rounded-md text-text-main hover:bg-primary-50"
                aria-label="Abrir menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ───── MOBILE MENU (slide-in right) ───── */}
      <div
        className={clsx(
          'fixed inset-0 z-40 md:hidden transition-opacity duration-200',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setMobileOpen(false)}
        aria-hidden={!mobileOpen}
      >
        <div className="absolute inset-0 bg-black/40" />
        <aside
          onClick={(e) => e.stopPropagation()}
          className={clsx(
            'absolute top-0 right-0 h-full w-72 max-w-[80vw] bg-surface shadow-xl transform transition-transform duration-200',
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          )}
          role="dialog"
          aria-label="Menu de navegacion"
        >
          <div className="flex items-center justify-between p-4 border-b border-primary-100">
            <span className="text-lg font-bold text-text-main">Menu</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-md hover:bg-primary-50"
              aria-label="Cerrar menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {user && (
            <div className="px-4 py-3 border-b border-primary-100">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-700" />
                </span>
                <div className="min-w-0">
                  <div className="font-medium text-text-main truncate">{user.nombre}</div>
                  <div className="text-xs text-text-muted truncate">{user.email}</div>
                </div>
              </div>
            </div>
          )}

          <nav className="py-2">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  clsx(
                    'block px-4 py-3 text-sm font-medium border-l-4',
                    isActive
                      ? 'bg-primary-50 text-primary-700 border-primary-600'
                      : 'text-text-main border-transparent hover:bg-primary-50'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {user && (
            <div className="border-t border-primary-100 py-2">
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-text-main hover:bg-primary-50"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesion
              </button>
            </div>
          )}
        </aside>
      </div>

      {/* ───── MAIN ───── */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* ───── FOOTER ───── */}
      <footer className="bg-primary-50/60 border-t border-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-sm text-text-muted flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>© 2026 MindVenture · Proyecto Academico UNAD</div>
          <button
            onClick={() => setPolicyOpen(true)}
            className="hover:text-primary-700 underline-offset-4 hover:underline transition-colors"
          >
            Politica de Datos
          </button>
        </div>
      </footer>

      <PoliticaDatosModal open={policyOpen} onClose={() => setPolicyOpen(false)} />
    </div>
  );
}
