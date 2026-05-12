import clsx from 'clsx';

function getRango(valor) {
  if (valor == null) return null;
  if (valor <= 3) return 'bajo';
  if (valor <= 6) return 'medio';
  return 'alto';
}

const ESTILOS = {
  bajo: {
    valor: 'text-green-600',
    descripcion: 'Te sientes bastante tranquilo',
    boton: 'bg-green-100 border-green-400 text-green-700',
  },
  medio: {
    valor: 'text-amber-500',
    descripcion: 'Estres moderado',
    boton: 'bg-amber-100 border-amber-400 text-amber-700',
  },
  alto: {
    valor: 'text-red-600',
    descripcion: 'Estres alto',
    boton: 'bg-red-100 border-red-400 text-red-700',
  },
};

export default function EscalaEstres({ titulo, valor, onChange }) {
  const rango = getRango(valor);
  const estilo = rango ? ESTILOS[rango] : null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-text-main text-center">{titulo}</h2>

      <div className="text-center">
        <span
          className={clsx(
            'text-6xl font-bold tabular-nums transition-colors',
            estilo ? estilo.valor : 'text-text-muted'
          )}
        >
          {valor ?? '—'}
        </span>
        <p className="text-sm text-text-muted mt-2 min-h-[1.25rem]">
          {estilo ? estilo.descripcion : 'Selecciona un nivel del 1 al 10'}
        </p>
      </div>

      <input
        type="range"
        min="1"
        max="10"
        step="1"
        value={valor ?? 5}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={titulo}
        className="w-full h-2 bg-primary-100 rounded-lg appearance-none cursor-pointer accent-primary-600"
      />

      <div className="flex justify-between text-xs text-text-muted px-1">
        <span>Muy bajo (1)</span>
        <span>Muy alto (10)</span>
      </div>

      <div className="grid grid-cols-10 gap-1.5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => {
          const seleccionado = valor === n;
          const estiloBoton = seleccionado
            ? ESTILOS[getRango(n)].boton
            : 'bg-white border-primary-100 text-text-main hover:border-primary-300';
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              aria-pressed={seleccionado}
              aria-label={`Nivel ${n}`}
              className={clsx(
                'h-10 rounded-lg border-2 text-sm font-semibold transition-all',
                estiloBoton,
                seleccionado && 'scale-110 shadow-sm'
              )}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}
