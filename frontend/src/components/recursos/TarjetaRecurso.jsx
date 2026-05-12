import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Brain,
  Clock,
  Heart,
  Sparkles,
  Users,
} from 'lucide-react';
import clsx from 'clsx';

export const CATEGORIA_INFO = {
  ansiedad: {
    label: 'Ansiedad',
    badge: 'bg-amber-100 text-amber-800',
    badgeBorder: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: Brain,
  },
  depresion: {
    label: 'Depresion',
    badge: 'bg-blue-100 text-blue-800',
    badgeBorder: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Heart,
  },
  autoestima: {
    label: 'Autoestima',
    badge: 'bg-violet-100 text-violet-800',
    badgeBorder: 'bg-violet-100 text-violet-800 border-violet-200',
    icon: Sparkles,
  },
  relaciones: {
    label: 'Relaciones',
    badge: 'bg-pink-100 text-pink-800',
    badgeBorder: 'bg-pink-100 text-pink-800 border-pink-200',
    icon: Users,
  },
  meditacion: {
    label: 'Meditacion',
    badge: 'bg-teal-100 text-teal-800',
    badgeBorder: 'bg-teal-100 text-teal-800 border-teal-200',
    icon: BookOpen,
  },
};

const FALLBACK_CAT = {
  label: 'General',
  badge: 'bg-gray-100 text-gray-800',
  badgeBorder: 'bg-gray-100 text-gray-800 border-gray-200',
  icon: BookOpen,
};

function preview(texto, max = 120) {
  if (!texto) return '';
  const limpio = String(texto)
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/^###\s+/gm, '')
    .replace(/^-\s+/gm, '')
    .replace(/\n+/g, ' ')
    .trim();
  if (limpio.length <= max) return limpio;
  return limpio.slice(0, max).trim() + '...';
}

export default function TarjetaRecurso({ recurso, variante = 'grid' }) {
  const cat = CATEGORIA_INFO[recurso.categoria] || FALLBACK_CAT;
  const to = `/recursos/${recurso._id}`;

  if (variante === 'compacto') {
    return (
      <Link
        to={to}
        className="block bg-surface rounded-xl border border-primary-100 p-4 hover:shadow-md hover:border-primary-300 transition-all"
      >
        <span className={clsx('inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2', cat.badge)}>
          {cat.label}
        </span>
        <h3 className="text-sm font-semibold text-text-main mb-2 line-clamp-2">
          {recurso.titulo}
        </h3>
        {recurso.tiempoLectura && (
          <span className="text-xs text-text-muted inline-flex items-center gap-1">
            <Clock className="w-3 h-3" aria-hidden="true" />
            {recurso.tiempoLectura} min
          </span>
        )}
      </Link>
    );
  }

  if (variante === 'sugerido') {
    const IconCat = cat.icon;
    return (
      <Link
        to={to}
        className="flex items-center gap-3 bg-surface rounded-xl border border-primary-100 p-3 hover:bg-primary-50/50 hover:border-primary-300 transition-colors"
      >
        <span className={clsx('flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center', cat.badge)}>
          <IconCat className="w-5 h-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-text-main truncate">
            {recurso.titulo}
          </p>
          {recurso.tiempoLectura && (
            <p className="text-xs text-text-muted">
              {recurso.tiempoLectura} min de lectura
            </p>
          )}
        </div>
      </Link>
    );
  }

  // Variante grid (default)
  return (
    <Link
      to={to}
      className="group flex flex-col bg-surface rounded-2xl border border-primary-100 p-5 hover:shadow-lg hover:scale-[1.01] hover:border-primary-300 transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className={clsx('inline-block px-2.5 py-1 rounded-full text-xs font-medium', cat.badge)}>
          {cat.label}
        </span>
        {recurso.tiempoLectura && (
          <span className="inline-flex items-center gap-1 text-xs text-text-muted">
            <Clock className="w-3 h-3" aria-hidden="true" />
            {recurso.tiempoLectura} min
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold text-text-main mb-2 leading-snug line-clamp-2">
        {recurso.titulo}
      </h3>

      <p className="text-sm text-text-muted leading-relaxed flex-1 mb-4 line-clamp-3">
        {preview(recurso.contenido, 140)}
      </p>

      <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-700 group-hover:gap-2 transition-all">
        Leer mas
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </span>
    </Link>
  );
}
