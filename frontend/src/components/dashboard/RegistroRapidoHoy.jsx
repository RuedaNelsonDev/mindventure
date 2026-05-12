import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

import {
  useCrearRegistro,
  useRegistroHoy,
} from '../../hooks/useMonitoreo';
import SelectorEstado from '../monitoreo/SelectorEstado';

const ESTADO_EMOJIS = {
  muy_mal: '😢',
  mal: '☹️',
  neutral: '😐',
  bien: '🙂',
  muy_bien: '😄',
};
const ESTADO_LABELS = {
  muy_mal: 'Muy mal',
  mal: 'Mal',
  neutral: 'Neutral',
  bien: 'Bien',
  muy_bien: 'Muy bien',
};

export default function RegistroRapidoHoy() {
  const hoy = useRegistroHoy();
  const crear = useCrearRegistro();
  const [toast, setToast] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  async function handleSeleccion(estado) {
    setError('');
    try {
      await crear.mutateAsync({ estadoAnimo: estado });
      setToast('Registro guardado.');
    } catch (err) {
      setError(
        err?.response?.data?.mensaje || 'No pudimos guardar tu registro.'
      );
    }
  }

  const registroHoy = hoy.data;

  return (
    <div className="relative bg-surface rounded-2xl border border-primary-100 p-6">
      {toast && (
        <div
          role="status"
          className="absolute top-3 right-3 z-10 bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg shadow flex items-center gap-1.5"
        >
          <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
          {toast}
        </div>
      )}

      {hoy.isLoading ? (
        <div className="h-32 bg-primary-50/40 rounded animate-pulse" />
      ) : registroHoy ? (
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="text-6xl" aria-hidden="true">
            {ESTADO_EMOJIS[registroHoy.estadoAnimo]}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-sm text-text-muted">Hoy registraste:</p>
            <p className="text-xl font-bold text-text-main">
              {ESTADO_LABELS[registroHoy.estadoAnimo]}
            </p>
            {registroHoy.nota && (
              <p className="text-sm text-text-muted mt-1 italic">
                "{registroHoy.nota}"
              </p>
            )}
          </div>
          <Link
            to="/monitoreo"
            className="text-sm font-medium text-primary-700 hover:underline whitespace-nowrap"
          >
            Editar en monitoreo
          </Link>
        </div>
      ) : (
        <>
          <h2 className="text-lg font-bold text-text-main mb-1">
            ¿Como te sientes ahora?
          </h2>
          <p className="text-sm text-text-muted mb-5">
            Toca un emoji para registrar tu estado de hoy.
          </p>
          <SelectorEstado valor={null} onChange={handleSeleccion} />
          {error && (
            <p className="text-xs text-red-600 mt-3 text-center">{error}</p>
          )}
          {crear.isPending && (
            <p className="text-xs text-text-muted mt-3 text-center">
              Guardando...
            </p>
          )}
        </>
      )}
    </div>
  );
}
