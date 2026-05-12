import clsx from 'clsx';

export const ESTADOS = [
  { id: 'muy_mal', emoji: '😢', label: 'Muy mal' },
  { id: 'mal', emoji: '☹️', label: 'Mal' },
  { id: 'neutral', emoji: '😐', label: 'Neutral' },
  { id: 'bien', emoji: '🙂', label: 'Bien' },
  { id: 'muy_bien', emoji: '😄', label: 'Muy bien' },
];

export default function SelectorEstado({ valor, onChange }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
      {ESTADOS.map((e) => {
        const seleccionado = valor === e.id;
        return (
          <button
            key={e.id}
            type="button"
            onClick={() => onChange(e.id)}
            aria-pressed={seleccionado}
            aria-label={`Estado: ${e.label}`}
            className={clsx(
              'flex flex-col items-center gap-2 p-1 transition-all duration-200',
              seleccionado ? 'scale-110' : 'hover:scale-105'
            )}
          >
            <span
              className={clsx(
                'flex items-center justify-center rounded-full bg-white',
                'h-16 w-16 sm:h-20 sm:w-20',
                'text-3xl sm:text-4xl',
                'transition-all',
                seleccionado
                  ? 'ring-4 ring-primary-400 shadow-md'
                  : 'ring-1 ring-primary-100 hover:bg-gray-50 hover:ring-primary-200 shadow-sm'
              )}
              aria-hidden="true"
            >
              {e.emoji}
            </span>
            <span
              className={clsx(
                'text-xs sm:text-sm font-medium',
                seleccionado ? 'text-primary-700' : 'text-text-muted'
              )}
            >
              {e.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
