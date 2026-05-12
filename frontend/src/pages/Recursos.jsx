import { useSearchParams } from 'react-router-dom';
import { BookOpen, SearchX } from 'lucide-react';

import { useRecursos } from '../hooks/useRecursos';
import TarjetaRecurso from '../components/recursos/TarjetaRecurso';
import FiltroCategoria from '../components/recursos/FiltroCategoria';
import BuscadorRecursos from '../components/recursos/BuscadorRecursos';

export default function Recursos() {
  // Filtros viven en la URL para que sean compartibles y sobrevivan a
  // navegacion al detalle (history back los mantiene).
  const [searchParams, setSearchParams] = useSearchParams();
  const categoria = searchParams.get('categoria') || null;
  const buscar = searchParams.get('buscar') || '';

  function actualizarCategoria(c) {
    const next = new URLSearchParams(searchParams);
    if (c) next.set('categoria', c);
    else next.delete('categoria');
    setSearchParams(next);
  }

  function actualizarBusqueda(s) {
    const next = new URLSearchParams(searchParams);
    if (s && s.trim()) next.set('buscar', s.trim());
    else next.delete('buscar');
    setSearchParams(next);
  }

  const params = {};
  if (categoria) params.categoria = categoria;
  if (buscar) params.buscar = buscar;

  const { data, isLoading } = useRecursos(params);
  const recursos = data || [];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="hidden sm:flex w-14 h-14 rounded-2xl bg-white items-center justify-center shadow-sm flex-shrink-0">
            <BookOpen className="w-7 h-7 text-primary-700" aria-hidden="true" />
          </span>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-text-main mb-2">
              Biblioteca de Bienestar
            </h1>
            <p className="text-text-muted">
              Recursos psicoeducativos para acompañarte. Lectura corta, evidencia real.
            </p>
            {!isLoading && (
              <span className="inline-block mt-3 px-3 py-1 rounded-full bg-white/70 text-xs font-medium text-primary-800 border border-primary-200">
                {recursos.length}{' '}
                {recursos.length === 1 ? 'recurso disponible' : 'recursos disponibles'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Filtros + busqueda */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="flex-1 min-w-0">
          <FiltroCategoria activa={categoria} onChange={actualizarCategoria} />
        </div>
        <div className="sm:w-72 flex-shrink-0">
          <BuscadorRecursos valor={buscar} onBuscar={actualizarBusqueda} />
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-64 bg-primary-50/50 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : recursos.length === 0 ? (
        <div className="text-center py-16 bg-surface rounded-2xl border border-primary-100">
          <SearchX
            className="w-12 h-12 mx-auto text-text-muted mb-4"
            aria-hidden="true"
          />
          <h3 className="text-lg font-semibold text-text-main mb-2">
            No encontramos recursos
          </h3>
          <p className="text-text-muted">
            Prueba otra busqueda o categoria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recursos.map((r) => (
            <TarjetaRecurso key={r._id} recurso={r} />
          ))}
        </div>
      )}
    </div>
  );
}
