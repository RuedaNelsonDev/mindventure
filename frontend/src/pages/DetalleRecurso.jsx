import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, MessageCircle } from 'lucide-react';

import { useRecurso } from '../hooks/useRecursos';
import RenderizadorMarkdown from '../components/recursos/RenderizadorMarkdown';
import { CATEGORIA_INFO } from '../components/recursos/TarjetaRecurso';

const FALLBACK_CAT = {
  label: 'General',
  badgeBorder: 'bg-gray-100 text-gray-800 border-gray-200',
};

export default function DetalleRecurso() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: recurso, isLoading, isError, error } = useRecurso(id);

  function volver() {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/recursos');
    }
  }

  if (isLoading) {
    return <ArticuloSkeleton />;
  }

  const noEncontrado =
    (isError && error?.response?.status === 404) || (!isLoading && !recurso);
  if (noEncontrado) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <BookOpen
          className="w-12 h-12 mx-auto text-text-muted mb-4"
          aria-hidden="true"
        />
        <h2 className="text-xl font-bold text-text-main mb-2">
          Recurso no encontrado
        </h2>
        <p className="text-text-muted mb-6">
          El recurso que buscas no existe o fue retirado.
        </p>
        <Link
          to="/recursos"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Volver a recursos
        </Link>
      </div>
    );
  }

  if (!recurso) return null;

  const cat = CATEGORIA_INFO[recurso.categoria] || FALLBACK_CAT;

  return (
    <article className="max-w-3xl mx-auto">
      <button
        type="button"
        onClick={volver}
        className="inline-flex items-center gap-1 text-sm text-primary-700 hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Volver a recursos
      </button>

      <header className="space-y-4 mb-8 pb-6 border-b border-primary-100">
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${cat.badgeBorder}`}
        >
          {cat.label}
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-text-main leading-tight">
          {recurso.titulo}
        </h1>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-muted">
          {recurso.autor && <span>{recurso.autor}</span>}
          {recurso.fuente && (
            <>
              <span aria-hidden="true">·</span>
              <span>{recurso.fuente}</span>
            </>
          )}
          {recurso.tiempoLectura && (
            <>
              <span aria-hidden="true">·</span>
              <span>{recurso.tiempoLectura} min de lectura</span>
            </>
          )}
        </div>
      </header>

      <RenderizadorMarkdown contenido={recurso.contenido} />

      {/* CTA */}
      <div className="mt-12 bg-primary-50 border border-primary-200 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-text-main mb-2">
          ¿Te ayudo este recurso?
        </h3>
        <p className="text-sm text-text-muted mb-4">
          Si quieres conversar sobre lo que sentiste o explorar otros recursos,
          MindVenture esta aqui.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/chat"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            Hablar con MindVenture
          </Link>
          <Link
            to="/recursos"
            className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border-2 border-primary-300 text-primary-700 text-sm font-semibold hover:bg-primary-50 transition-colors"
          >
            Ver mas recursos
          </Link>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-4">
        <p className="text-xs text-text-muted leading-relaxed">
          MindVenture es un apoyo emocional, no sustituye atencion profesional.
          Si necesitas ayuda inmediata:{' '}
          <strong>Linea Nacional 192 opcion 4</strong> (24/7).
        </p>
      </div>
    </article>
  );
}

function ArticuloSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="h-5 w-32 bg-primary-50 rounded animate-pulse" />
      <div className="h-7 w-20 bg-primary-50/70 rounded-full animate-pulse" />
      <div className="h-10 w-3/4 bg-primary-50 rounded animate-pulse" />
      <div className="h-4 w-1/2 bg-primary-50/70 rounded animate-pulse" />
      <div className="space-y-3 pt-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-4 bg-primary-50/60 rounded animate-pulse"
            style={{ width: `${70 + Math.random() * 30}%` }}
          />
        ))}
      </div>
    </div>
  );
}
