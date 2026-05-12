import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Calendar,
  CheckCircle2,
  Flame,
  Heart,
  Sparkles,
  TrendingUp,
  Trophy,
} from 'lucide-react';

import {
  useCrearRegistro,
  useRegistroHoy,
  useRegistrosMonitoreo,
  useResumenMonitoreo,
} from '../hooks/useMonitoreo';
import SelectorEstado from '../components/monitoreo/SelectorEstado';
import TarjetaResumen from '../components/monitoreo/TarjetaResumen';
import GraficoTendencia from '../components/monitoreo/GraficoTendencia';
import GraficoDistribucion from '../components/monitoreo/GraficoDistribucion';
import AlertaError from '../components/forms/AlertaError';

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

export default function Monitoreo() {
  const registros = useRegistrosMonitoreo();
  const hoy = useRegistroHoy();
  const resumen = useResumenMonitoreo();
  const crear = useCrearRegistro();

  const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);
  const [nota, setNota] = useState('');
  const [editando, setEditando] = useState(false);
  const [toast, setToast] = useState(null);
  const [errorGuardar, setErrorGuardar] = useState('');

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const registroHoy = hoy.data;
  const mostrarFormulario = !registroHoy || editando;

  async function handleGuardar() {
    setErrorGuardar('');
    if (!estadoSeleccionado) {
      setErrorGuardar('Selecciona como te sientes hoy.');
      return;
    }
    try {
      await crear.mutateAsync({
        estadoAnimo: estadoSeleccionado,
        ...(nota.trim() && { nota: nota.trim() }),
      });
      setEstadoSeleccionado(null);
      setNota('');
      setEditando(false);
      setToast('Registro guardado. ¡Gracias por cuidarte!');
    } catch (err) {
      setErrorGuardar(
        err?.response?.data?.mensaje || 'No pudimos guardar tu registro.'
      );
    }
  }

  function iniciarEdicion() {
    if (registroHoy) {
      setEstadoSeleccionado(registroHoy.estadoAnimo);
      setNota(registroHoy.nota || '');
    }
    setEditando(true);
  }

  function cancelarEdicion() {
    setEditando(false);
    setEstadoSeleccionado(null);
    setNota('');
    setErrorGuardar('');
  }

  // Para el grafico de tendencia: ASC (backend devuelve DESC).
  const registrosOrdenados = registros.data
    ? [...registros.data].reverse()
    : [];

  return (
    <div className="space-y-6">
      {toast && <Toast mensaje={toast} />}

      {/* Seccion 1: Registro de hoy */}
      <Card>
        <h2 className="text-xl font-bold text-text-main mb-1">
          ¿Como te sientes hoy?
        </h2>
        <p className="text-sm text-text-muted mb-6">
          Tomate un momento para reconocer tu estado emocional.
        </p>

        {hoy.isLoading ? (
          <SkeletonRegistroHoy />
        ) : mostrarFormulario ? (
          <FormularioRegistro
            estado={estadoSeleccionado}
            onChangeEstado={setEstadoSeleccionado}
            nota={nota}
            onChangeNota={setNota}
            onGuardar={handleGuardar}
            guardando={crear.isPending}
            error={errorGuardar}
            mostrarCancelar={editando}
            onCancelar={cancelarEdicion}
          />
        ) : (
          <RegistroHoyVista registro={registroHoy} onEditar={iniciarEdicion} />
        )}
      </Card>

      {/* Seccion 2: KPIs */}
      <SeccionResumen resumen={resumen.data} loading={resumen.isLoading} />

      {/* Seccion 3: Evolucion */}
      <Card>
        <h2 className="text-xl font-bold text-text-main mb-1">
          Tu evolucion emocional
        </h2>
        <p className="text-sm text-text-muted mb-4">
          Como ha cambiado tu animo a lo largo del tiempo.
        </p>
        {registros.isLoading ? (
          <div className="h-72 bg-primary-50/40 rounded-xl animate-pulse" />
        ) : (
          <GraficoTendencia registros={registrosOrdenados} />
        )}
      </Card>

      {/* Seccion 4: Distribucion */}
      <Card>
        <h2 className="text-xl font-bold text-text-main mb-1">
          Como te has sentido este mes
        </h2>
        <p className="text-sm text-text-muted mb-4">
          Distribucion de tus registros en los ultimos 30 dias.
        </p>
        {resumen.isLoading ? (
          <div className="h-72 bg-primary-50/40 rounded-xl animate-pulse" />
        ) : (
          <GraficoDistribucion
            distribucionEstados={resumen.data?.distribucionEstados}
          />
        )}
      </Card>

      {/* Seccion 5: Mensajes contextuales */}
      <MensajesInteligentes resumen={resumen.data} />
    </div>
  );
}

function Card({ children, className = '' }) {
  return (
    <div
      className={`bg-surface rounded-2xl shadow-sm border border-primary-100 p-6 ${className}`}
    >
      {children}
    </div>
  );
}

function SkeletonRegistroHoy() {
  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-50 animate-pulse"
          />
        ))}
      </div>
      <div className="h-20 bg-primary-50/50 rounded-xl animate-pulse" />
    </div>
  );
}

function FormularioRegistro({
  estado,
  onChangeEstado,
  nota,
  onChangeNota,
  onGuardar,
  guardando,
  error,
  mostrarCancelar,
  onCancelar,
}) {
  return (
    <div className="space-y-5">
      <SelectorEstado valor={estado} onChange={onChangeEstado} />

      <div className="space-y-1">
        <label
          className="block text-sm font-medium text-text-main"
          htmlFor="nota-emocion"
        >
          ¿Que paso hoy? <span className="text-text-muted font-normal">(opcional)</span>
        </label>
        <textarea
          id="nota-emocion"
          value={nota}
          onChange={(e) => onChangeNota(e.target.value)}
          maxLength={500}
          rows={3}
          placeholder="Comparte lo que necesites contar..."
          className="w-full rounded-lg border-2 border-primary-100 bg-surface px-3 py-2 text-sm focus:outline-none focus:border-primary-500 resize-none transition-colors"
        />
        <p className="text-xs text-text-muted text-right tabular-nums">
          {nota.length} / 500
        </p>
      </div>

      <AlertaError mensaje={error} />

      <div className="flex gap-2 justify-end">
        {mostrarCancelar && (
          <button
            type="button"
            onClick={onCancelar}
            disabled={guardando}
            className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
        )}
        <button
          type="button"
          onClick={onGuardar}
          disabled={guardando || !estado}
          className="px-5 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 active:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {guardando ? 'Guardando...' : 'Guardar registro'}
        </button>
      </div>
    </div>
  );
}

function RegistroHoyVista({ registro, onEditar }) {
  const emoji = ESTADO_EMOJIS[registro.estadoAnimo] || '😐';
  const label = ESTADO_LABELS[registro.estadoAnimo] || registro.estadoAnimo;
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 bg-primary-50/50 rounded-xl p-5">
      <div className="text-6xl" aria-hidden="true">
        {emoji}
      </div>
      <div className="flex-1 text-center sm:text-left">
        <p className="text-sm text-text-muted">Hoy registraste:</p>
        <p className="text-xl font-bold text-text-main">{label}</p>
        {registro.nota && (
          <p className="text-sm text-text-muted mt-2 italic">
            "{registro.nota}"
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onEditar}
        className="px-4 py-2 rounded-lg border-2 border-primary-300 text-primary-700 text-sm font-medium hover:bg-primary-50 transition-colors"
      >
        Editar
      </button>
    </div>
  );
}

function Toast({ mensaje }) {
  return (
    <div
      role="status"
      className="fixed top-20 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2"
    >
      <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
      <span className="text-sm font-medium">{mensaje}</span>
    </div>
  );
}

function SeccionResumen({ resumen, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 rounded-2xl bg-primary-50/50 animate-pulse"
          />
        ))}
      </div>
    );
  }
  if (!resumen) return null;

  const promSemana = Number(resumen.promedioSemana || 0).toFixed(1);
  const promMes = Number(resumen.promedioMes || 0).toFixed(1);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <TarjetaResumen
        titulo="Promedio ultima semana"
        valor={promSemana}
        subtitulo="Escala 1 (muy mal) - 5 (muy bien)"
        icono={TrendingUp}
        tendencia={resumen.tendencia}
      />
      <TarjetaResumen
        titulo="Promedio ultimo mes"
        valor={promMes}
        subtitulo="Escala 1 - 5"
        icono={Calendar}
      />
      <TarjetaResumen
        titulo="Total de registros"
        valor={resumen.totalRegistros || 0}
        subtitulo="Dias que has registrado"
        icono={Award}
      />
      <TarjetaResumen
        titulo="Racha actual"
        valor={resumen.diasConsecutivos || 0}
        subtitulo={
          resumen.diasConsecutivos === 1 ? 'dia seguido' : 'dias seguidos'
        }
        icono={Flame}
      />
    </div>
  );
}

function MensajesInteligentes({ resumen }) {
  if (!resumen) return null;

  const mensajes = [];

  if (resumen.tendencia === 'bajando' && resumen.promedioSemana < 3) {
    mensajes.push(
      <MensajeContextual
        key="dificil"
        Icon={Heart}
        className="bg-amber-50 border-amber-200 text-amber-900"
        titulo="Hemos notado que la semana ha sido dificil"
      >
        Si quieres hablar con alguien,{' '}
        <Link to="/chat" className="font-semibold underline">
          MindVenture esta aqui para ti
        </Link>
        .
      </MensajeContextual>
    );
  }

  if (resumen.diasConsecutivos === 0 && resumen.totalRegistros > 0) {
    mensajes.push(
      <MensajeContextual
        key="vuelve"
        Icon={Sparkles}
        className="bg-primary-50 border-primary-200 text-primary-900"
        titulo="Hace tiempo no registras"
      >
        Un minuto al dia puede marcar la diferencia. Vuelve cuando puedas.
      </MensajeContextual>
    );
  }

  if (resumen.promedioSemana >= 4) {
    mensajes.push(
      <MensajeContextual
        key="bien"
        Icon={Trophy}
        className="bg-green-50 border-green-200 text-green-900"
        titulo="¡Vas muy bien esta semana!"
      >
        Felicidades por cuidarte. Sigue asi.
      </MensajeContextual>
    );
  }

  if (resumen.diasConsecutivos >= 7) {
    mensajes.push(
      <MensajeContextual
        key="racha"
        Icon={Award}
        className="bg-secondary-50 border-secondary-200 text-secondary-900"
        titulo={`¡${resumen.diasConsecutivos} dias consecutivos!`}
      >
        El cuidado constante construye bienestar.
      </MensajeContextual>
    );
  }

  if (mensajes.length === 0) return null;
  return <div className="space-y-3">{mensajes}</div>;
}

function MensajeContextual({ Icon, className, titulo, children }) {
  return (
    <div className={`border-2 rounded-2xl p-5 ${className}`}>
      <div className="flex items-start gap-3">
        <Icon className="w-6 h-6 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div className="flex-1">
          <p className="font-semibold mb-1">{titulo}</p>
          <p className="text-sm">{children}</p>
        </div>
      </div>
    </div>
  );
}
