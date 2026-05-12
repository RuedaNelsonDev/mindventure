import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import clsx from 'clsx';

const VARIANTES = {
  primary: {
    iconBg: 'bg-primary-100 text-primary-700',
    border: 'border-primary-100 hover:border-primary-300',
  },
  secondary: {
    iconBg: 'bg-secondary-100 text-secondary-700',
    border: 'border-secondary-100 hover:border-secondary-300',
  },
  amber: {
    iconBg: 'bg-amber-100 text-amber-700',
    border: 'border-amber-100 hover:border-amber-300',
  },
  blue: {
    iconBg: 'bg-blue-100 text-blue-700',
    border: 'border-blue-100 hover:border-blue-300',
  },
};

export default function TarjetaAccionRapida({
  icono: Icono,
  titulo,
  descripcion,
  color = 'primary',
  to,
}) {
  const v = VARIANTES[color] || VARIANTES.primary;
  return (
    <Link
      to={to}
      className={clsx(
        'group flex items-start gap-4 bg-surface rounded-2xl border-2 p-5 transition-all',
        v.border,
        'hover:shadow-lg hover:scale-[1.01]'
      )}
    >
      <span
        className={clsx(
          'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center',
          v.iconBg
        )}
      >
        <Icono className="w-6 h-6" aria-hidden="true" />
      </span>
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-bold text-text-main mb-1">{titulo}</h3>
        <p className="text-sm text-text-muted line-clamp-2">{descripcion}</p>
      </div>
      <ArrowRight
        className="w-5 h-5 text-text-muted group-hover:text-primary-700 group-hover:translate-x-1 transition-all flex-shrink-0"
        aria-hidden="true"
      />
    </Link>
  );
}
