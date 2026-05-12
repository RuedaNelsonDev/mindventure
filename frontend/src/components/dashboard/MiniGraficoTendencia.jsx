import { Line, LineChart, ResponsiveContainer, YAxis } from 'recharts';

export default function MiniGraficoTendencia({ registros }) {
  if (!registros || registros.length < 2) {
    return (
      <div className="h-20 flex items-center justify-center text-center">
        <p className="text-xs text-text-muted px-4">
          Registra al menos 2 dias para ver tu tendencia.
        </p>
      </div>
    );
  }

  // Backend devuelve DESC; sparkline necesita ASC.
  const data = [...registros]
    .reverse()
    .map((r) => ({ valor: r.valorNumerico }));

  return (
    <div className="h-20">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <YAxis domain={[1, 5]} hide />
          <Line
            type="monotone"
            dataKey="valor"
            stroke="#14b8a6"
            strokeWidth={2}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
