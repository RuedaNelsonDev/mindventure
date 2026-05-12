import { Clock } from 'lucide-react';
import clsx from 'clsx';

export default function TarjetaEscena({
  emoji,
  titulo,
  descripcion,
  duracion,
  disponible,
  onClick,
}) {
  const Tag = disponible ? 'button' : 'div';
  return (
    <Tag
      {...(disponible ? { type: 'button', onClick } : { 'aria-disabled': true })}
      className={clsx(
        'relative text-left bg-surface rounded-2xl border-2 p-6 transition-all w-full',
        disponible
          ? 'border-primary-100 hover:border-primary-400 hover:scale-[1.02] hover:shadow-lg cursor-pointer'
          : 'border-gray-200 opacity-60 cursor-not-allowed'
      )}
    >
      {!disponible && (
        <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium border border-amber-200">
          Proximamente
        </span>
      )}

      <div className="text-7xl mb-4" aria-hidden="true">
        {emoji}
      </div>
      <h3 className="text-xl font-bold text-text-main mb-2">{titulo}</h3>
      <p className="text-sm text-text-muted mb-4 line-clamp-2 min-h-[2.5rem]">
        {descripcion}
      </p>
      {duracion && (
        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-primary-50 text-primary-700 border border-primary-200">
          <Clock className="w-3 h-3" aria-hidden="true" />
          {duracion}
        </span>
      )}
    </Tag>
  );
}
