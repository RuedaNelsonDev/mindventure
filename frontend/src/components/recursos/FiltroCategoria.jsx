import clsx from 'clsx';

const CATEGORIAS = [
  { id: null, label: 'Todos' },
  { id: 'ansiedad', label: 'Ansiedad' },
  { id: 'depresion', label: 'Depresion' },
  { id: 'autoestima', label: 'Autoestima' },
  { id: 'relaciones', label: 'Relaciones' },
  { id: 'meditacion', label: 'Meditacion' },
];

export default function FiltroCategoria({ activa, onChange }) {
  return (
    <div
      role="group"
      aria-label="Filtrar por categoria"
      className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1"
      style={{ scrollbarWidth: 'thin' }}
    >
      {CATEGORIAS.map((c) => {
        const seleccionado = activa === c.id;
        return (
          <button
            key={c.id ?? 'todos'}
            type="button"
            onClick={() => onChange(c.id)}
            aria-pressed={seleccionado}
            className={clsx(
              'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors',
              seleccionado
                ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                : 'bg-white text-text-main border-primary-100 hover:bg-primary-50 hover:border-primary-300'
            )}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
