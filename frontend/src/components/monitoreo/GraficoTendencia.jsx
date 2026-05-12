import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const ESTADO_LABELS = {
  1: 'Muy mal',
  2: 'Mal',
  3: 'Neutral',
  4: 'Bien',
  5: 'Muy bien',
};

const ESTADO_EMOJIS = {
  1: '😢',
  2: '☹️',
  3: '😐',
  4: '🙂',
  5: '😄',
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const valor = payload[0].value;
  return (
    <div className="bg-white rounded-lg border border-primary-200 shadow-md p-3 text-xs">
      <div className="text-text-muted mb-1">
        Fecha: <span className="font-medium text-text-main">{label}</span>
      </div>
      <div>
        Estado:{' '}
        <span className="font-semibold text-primary-700">
          {ESTADO_LABELS[valor] || valor}
        </span>{' '}
        <span aria-hidden="true">{ESTADO_EMOJIS[valor]}</span>
      </div>
    </div>
  );
}

export default function GraficoTendencia({ registros }) {
  if (!registros || registros.length < 2) {
    return (
      <div className="text-center text-text-muted py-12 text-sm">
        Necesitas al menos 2 registros para ver tu tendencia.
      </div>
    );
  }

  const data = registros.map((r) => ({
    fecha: format(new Date(r.createdAt), 'd MMM', { locale: es }),
    valor: r.valorNumerico,
    estadoAnimo: r.estadoAnimo,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ccfbf1" />
        <XAxis
          dataKey="fecha"
          tick={{ fontSize: 11, fill: '#5e7c7a' }}
          tickLine={{ stroke: '#ccfbf1' }}
        />
        <YAxis
          domain={[1, 5]}
          ticks={[1, 2, 3, 4, 5]}
          tick={{ fontSize: 11, fill: '#5e7c7a' }}
          tickLine={{ stroke: '#ccfbf1' }}
          tickFormatter={(v) => ESTADO_LABELS[v] || v}
          width={75}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="valor"
          stroke="#14b8a6"
          strokeWidth={2.5}
          dot={{ r: 4, fill: '#14b8a6', strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#0d9488' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
