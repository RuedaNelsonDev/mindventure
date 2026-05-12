import { useEffect, useRef, useState } from 'react';
import { Timer } from 'lucide-react';

export default function CronometroSesion({ iniciado, onTiempo }) {
  const [segundos, setSegundos] = useState(0);
  const onTiempoRef = useRef(onTiempo);

  useEffect(() => {
    onTiempoRef.current = onTiempo;
  }, [onTiempo]);

  useEffect(() => {
    if (!iniciado) {
      setSegundos(0);
      return;
    }
    const interval = setInterval(() => {
      setSegundos((s) => {
        const next = s + 1;
        onTiempoRef.current?.(next);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [iniciado]);

  if (!iniciado) return null;

  const mm = String(Math.floor(segundos / 60)).padStart(2, '0');
  const ss = String(segundos % 60).padStart(2, '0');

  return (
    <div className="bg-black/40 backdrop-blur-md text-white rounded-xl px-3 py-2 flex items-center gap-2 font-mono text-xl tabular-nums">
      <Timer className="w-4 h-4" aria-hidden="true" />
      <span aria-label={`${mm} minutos ${ss} segundos`}>{mm}:{ss}</span>
    </div>
  );
}
