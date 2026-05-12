import { useEffect, useRef, useState } from 'react';

import { useEnviarConsulta, useHistorial } from '../hooks/useChat';
import BannerCrisis from '../components/chat/BannerCrisis';
import BurbujaMensaje from '../components/chat/BurbujaMensaje';
import InputChat from '../components/chat/InputChat';
import MensajePensando from '../components/chat/MensajePensando';

const SUGERENCIAS = [
  'Me siento ansioso por mi trabajo',
  'Tengo problemas para dormir',
  'Quiero aprender una tecnica de respiracion',
];

export default function Chat() {
  const historial = useHistorial();
  const enviar = useEnviarConsulta();

  const [inputValue, setInputValue] = useState('');
  const [preguntaPendiente, setPreguntaPendiente] = useState(null);
  const endRef = useRef(null);

  // Backend devuelve DESC (mas reciente primero); el chat muestra ASC.
  const consultas = historial.data || [];
  const consultasOrdenadas = [...consultas].reverse();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [consultasOrdenadas.length, preguntaPendiente, enviar.isPending]);

  async function handleEnviar(texto) {
    if (!texto.trim()) return;
    setInputValue('');
    setPreguntaPendiente(texto);
    try {
      await enviar.mutateAsync(texto);
    } catch {
      // El mensaje se mantuvo en el cliente hasta este finally.
      // Limpiamos el pendiente para que el usuario lo reescriba si quiere.
    } finally {
      setPreguntaPendiente(null);
    }
  }

  const isLoading = historial.isLoading;
  const sinHistorial =
    !isLoading && consultasOrdenadas.length === 0 && !preguntaPendiente;

  return (
    <div
      className="flex flex-col"
      style={{ height: 'calc(100vh - 12rem)', minHeight: '32rem' }}
    >
      <BannerCrisis />

      <div className="bg-surface rounded-xl border border-primary-100 flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          <div className="max-w-4xl mx-auto">
            {isLoading && <Skeleton />}

            {sinHistorial && (
              <Bienvenida onSugerencia={(s) => setInputValue(s)} />
            )}

            {!isLoading &&
              consultasOrdenadas.map((c) => (
                <div key={c._id}>
                  <BurbujaMensaje mensaje={c} tipo="pregunta" />
                  <BurbujaMensaje
                    mensaje={c}
                    tipo="respuesta"
                    alertaCrisis={c.alertaCrisis}
                  />
                </div>
              ))}

            {preguntaPendiente && (
              <>
                <BurbujaMensaje
                  mensaje={{
                    pregunta: preguntaPendiente,
                    createdAt: new Date().toISOString(),
                  }}
                  tipo="pregunta"
                />
                {enviar.isPending && <MensajePensando />}
              </>
            )}

            {enviar.isError && !preguntaPendiente && (
              <div className="text-center text-sm text-red-600 my-4">
                Hubo un problema al enviar tu mensaje. Intenta de nuevo.
              </div>
            )}

            <div ref={endRef} />
          </div>
        </div>

        <InputChat
          value={inputValue}
          onChange={setInputValue}
          onEnviar={handleEnviar}
          enviando={enviar.isPending}
        />
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-4">
      {[
        { side: 'right', w: 'w-3/5' },
        { side: 'left', w: 'w-4/5' },
        { side: 'right', w: 'w-1/2' },
      ].map((row, i) => (
        <div
          key={i}
          className={row.side === 'right' ? 'flex justify-end' : 'flex'}
        >
          <div
            className={`${row.w} h-16 rounded-2xl bg-primary-100/60 animate-pulse ${
              row.side === 'left' ? 'ml-11' : ''
            }`}
          />
        </div>
      ))}
    </div>
  );
}

function Bienvenida({ onSugerencia }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center px-4">
      <div className="text-6xl mb-4" aria-hidden="true">🧠</div>
      <h2 className="text-2xl font-bold text-text-main mb-2">
        Hola, soy MindVenture
      </h2>
      <p className="text-text-muted max-w-md mb-8">
        ¿Como te sientes hoy? Puedes contarme lo que necesites.
      </p>
      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 max-w-2xl">
        {SUGERENCIAS.map((s) => (
          <button
            key={s}
            onClick={() => onSugerencia(s)}
            className="px-4 py-2 text-sm rounded-full bg-white border border-primary-200 text-primary-700 hover:bg-primary-50 hover:border-primary-300 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
