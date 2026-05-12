import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const ESTADOS_INFO = {
  muy_mal: { label: 'Muy mal', emoji: '😢', color: '#ef4444' },
  mal: { label: 'Mal', emoji: '☹️', color: '#f97316' },
  neutral: { label: 'Neutral', emoji: '😐', color: '#6b7280' },
  bien: { label: 'Bien', emoji: '🙂', color: '#14b8a6' },
  muy_bien: { label: 'Muy bien', emoji: '😄', color: '#10b981' },
};

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="bg-white rounded-lg border border-primary-200 shadow-md p-3 text-xs">
      <div className="font-semibold mb-1">
        <span aria-hidden="true">{p.emoji}</span> {p.label}
      </div>
      <div className="text-text-muted">
        {p.value} registro{p.value !== 1 ? 's' : ''} · {p.porcentaje}%
      </div>
    </div>
  );
}

function renderLabel({ porcentaje }) {
  if (porcentaje < 7) return '';
  return `${porcentaje}%`;
}

export default function GraficoDistribucion({ distribucionEstados }) {
  if (!distribucionEstados) {
    return (
      <div className="text-center text-text-muted py-12 text-sm">
        Aun no hay datos suficientes.
      </div>
    );
  }

  const total = Object.values(distribucionEstados).reduce(
    (a, b) => a + (b || 0),
    0
  );

  if (total === 0) {
    return (
      <div className="text-center text-text-muted py-12 text-sm">
        Aun no hay datos suficientes.
      </div>
    );
  }

  const data = Object.entries(distribucionEstados)
    .filter(([, count]) => count > 0)
    .map(([estado, count]) => ({
      name: ESTADOS_INFO[estado]?.label || estado,
      value: count,
      label: ESTADOS_INFO[estado]?.label || estado,
      emoji: ESTADOS_INFO[estado]?.emoji || '',
      color: ESTADOS_INFO[estado]?.color || '#999',
      porcentaje: Math.round((count / total) * 100),
    }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={90}
          label={renderLabel}
          labelLine={false}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
