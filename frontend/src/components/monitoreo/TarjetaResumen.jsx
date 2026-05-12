import { ArrowDown, ArrowRight, ArrowUp } from 'lucide-react';
import clsx from 'clsx';

const TENDENCIAS = {
  subiendo: {
    Icon: ArrowUp,
    label: 'Mejorando',
    className: 'bg-green-50 text-green-700 border-green-200',
  },
  estable: {
    Icon: ArrowRight,
    label: 'Estable',
    className: 'bg-gray-50 text-gray-600 border-gray-200',
  },
  bajando: {
    Icon: ArrowDown,
    label: 'Atencion',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
};

export default function TarjetaResumen({
  titulo,
  valor,
  subtitulo,
  icono: Icono,
  tendencia,
}) {
  const t = tendencia && TENDENCIAS[tendencia];

  return (
    <div className="bg-surface rounded-2xl shadow-sm border border-primary-100 p-5">
      <div className="flex items-start justify-between mb-3 min-h-[2.5rem]">
        {Icono && (
          <span className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-700">
            <Icono className="w-5 h-5" aria-hidden="true" />
          </span>
        )}
        {t && (
          <span
            className={clsx(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border',
              t.className
            )}
          >
            <t.Icon className="w-3 h-3" aria-hidden="true" />
            {t.label}
          </span>
        )}
      </div>
      <p className="text-xs text-text-muted mb-1 uppercase tracking-wide">
        {titulo}
      </p>
      <p className="text-2xl font-bold text-text-main tabular-nums">{valor}</p>
      {subtitulo && (
        <p className="text-xs text-text-muted mt-1">{subtitulo}</p>
      )}
    </div>
  );
}
