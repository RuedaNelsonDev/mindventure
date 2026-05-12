import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';

const DEBOUNCE_MS = 350;

export default function BuscadorRecursos({ valor, onBuscar }) {
  const [texto, setTexto] = useState(valor || '');
  const primerRender = useRef(true);

  // Debounce: tras 350ms sin tipear, dispara onBuscar.
  useEffect(() => {
    if (primerRender.current) {
      primerRender.current = false;
      return;
    }
    const t = setTimeout(() => {
      onBuscar(texto);
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [texto]);

  // Sincroniza si el padre reinicia el valor externamente (ej. URL params).
  useEffect(() => {
    if ((valor || '') !== texto) {
      setTexto(valor || '');
    }
  }, [valor]);

  return (
    <div className="relative">
      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="w-4 h-4 text-text-muted" aria-hidden="true" />
      </span>
      <input
        type="text"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Busca por titulo o tema..."
        aria-label="Buscar recursos"
        className="w-full rounded-lg border-2 border-primary-100 bg-surface pl-9 pr-9 py-2 text-sm focus:outline-none focus:border-primary-500 transition-colors"
      />
      {texto && (
        <button
          type="button"
          onClick={() => setTexto('')}
          aria-label="Limpiar busqueda"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-primary-700 transition-colors"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
