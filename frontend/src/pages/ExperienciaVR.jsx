import { lazy, Suspense, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

import {
  useEstadisticasVR,
  useFinalizarSesion,
  useIniciarSesion,
} from '../hooks/useVR';
import TarjetaEscena from '../components/vr/TarjetaEscena';
import EscalaEstres from '../components/vr/EscalaEstres';
import CronometroSesion from '../components/vr/CronometroSesion';
import AlertaError from '../components/forms/AlertaError';

// Lazy-load del Canvas 3D — el bundle de three.js solo se carga al entrar a la experiencia.
const EscenaPlaya = lazy(() => import('../components/vr/escenas/EscenaPlaya'));

const FASE_LABEL = {
  inhalar: 'Inhala',
  mantener: 'Manten',
  exhalar: 'Exhala',
};

export default function ExperienciaVR() {
  const navigate = useNavigate();
  const stats = useEstadisticasVR();
  const iniciar = useIniciarSesion();
  const finalizar = useFinalizarSesion();

  const [paso, setPaso] = useState('seleccion');
  const [escenaSeleccionada, setEscenaSeleccionada] = useState(null);
  const [estresAntes, setEstresAntes] = useState(null);
  const [estresDespues, setEstresDespues] = useState(null);
  const [notas, setNotas] = useState('');
  const [sesionActual, setSesionActual] = useState(null);
  const [duracion, setDuracion] = useState(0);
  const [fase, setFase] = useState('inhalar');
  const [error, setError] = useState('');

  function elegirEscena(escena) {
    setEscenaSeleccionada(escena);
    setEstresAntes(null);
    setEstresDespues(null);
    setNotas('');
    setError('');
    setPaso('estres-antes');
  }

  async function comenzarSesion() {
    setError('');
    try {
      const sesion = await iniciar.mutateAsync({
        tipoEscena: escenaSeleccionada,
        nivelEstresAntes: estresAntes,
      });
      setSesionActual(sesion);
      setDuracion(0);
      setPaso('experiencia');
    } catch (err) {
      setError(
        err?.response?.data?.mensaje || 'No pudimos iniciar la sesion VR.'
      );
    }
  }

  function salirDeExperiencia() {
    setPaso('estres-despues');
  }

  async function finalizarSesion() {
    setError('');
    try {
      await finalizar.mutateAsync({
        id: sesionActual._id,
        nivelEstresDespues: estresDespues,
        duracionSegundos: duracion,
        ...(notas.trim() && { notas: notas.trim() }),
      });
      setPaso('resultado');
    } catch (err) {
      setError(
        err?.response?.data?.mensaje || 'No pudimos guardar la sesion.'
      );
    }
  }

  function reiniciar() {
    setPaso('seleccion');
    setEscenaSeleccionada(null);
    setSesionActual(null);
    setEstresAntes(null);
    setEstresDespues(null);
    setNotas('');
    setDuracion(0);
    setError('');
  }

  if (paso === 'seleccion') {
    return <PasoSeleccion stats={stats.data} onElegir={elegirEscena} />;
  }
  if (paso === 'estres-antes') {
    return (
      <PasoEstresAntes
        valor={estresAntes}
        onChange={setEstresAntes}
        onContinuar={comenzarSesion}
        onVolver={() => setPaso('seleccion')}
        cargando={iniciar.isPending}
        error={error}
      />
    );
  }
  if (paso === 'experiencia') {
    return (
      <PasoExperiencia
        onSalir={salirDeExperiencia}
        onTiempo={setDuracion}
        fase={fase}
        onCambioFase={setFase}
      />
    );
  }
  if (paso === 'estres-despues') {
    return (
      <PasoEstresDespues
        valor={estresDespues}
        onChange={setEstresDespues}
        notas={notas}
        onChangeNotas={setNotas}
        onFinalizar={finalizarSesion}
        cargando={finalizar.isPending}
        error={error}
      />
    );
  }
  if (paso === 'resultado') {
    return (
      <PasoResultado
        estresAntes={estresAntes}
        estresDespues={estresDespues}
        duracion={duracion}
        onOtraSesion={reiniciar}
        onVerProgreso={() => navigate('/monitoreo')}
      />
    );
  }
  return null;
}

// ───────── Paso 1: seleccion ─────────
function PasoSeleccion({ stats, onElegir }) {
  const completadas = stats?.sesionesCompletadas || 0;
  const reduccion = Number(stats?.promedioReduccionEstres || 0).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text-main mb-2">
          Elige tu experiencia
        </h1>
        <p className="text-text-muted">
          Encuentra calma en un entorno virtual
        </p>
      </div>

      {stats && stats.totalSesiones > 0 && (
        <div className="bg-primary-50 rounded-xl p-4 text-center border border-primary-200">
          <p className="text-sm text-primary-900">
            Has completado{' '}
            <strong>
              {completadas} {completadas === 1 ? 'sesion' : 'sesiones'}
            </strong>
            {' · '}Reduccion promedio de estres:{' '}
            <strong>{reduccion} puntos</strong>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <TarjetaEscena
          emoji="🏖️"
          titulo="Playa Calmante"
          descripcion="Olas suaves y un ejercicio de respiracion guiada."
          duracion="5-10 minutos"
          disponible
          onClick={() => onElegir('playa')}
        />
        <TarjetaEscena
          emoji="🌲"
          titulo="Bosque Sereno"
          descripcion="Sonidos de la naturaleza para meditar."
          duracion="5-10 minutos"
          disponible={false}
        />
        <TarjetaEscena
          emoji="🌌"
          titulo="Espacio Cosmico"
          descripcion="Inmersion en el universo para mindfulness."
          duracion="5-10 minutos"
          disponible={false}
        />
      </div>
    </div>
  );
}

// ───────── Paso 2: estres antes ─────────
function PasoEstresAntes({ valor, onChange, onContinuar, onVolver, cargando, error }) {
  return (
    <CardEstres>
      <EscalaEstres
        titulo="¿Cual es tu nivel de estres ahora?"
        valor={valor}
        onChange={onChange}
      />
      <AlertaError mensaje={error} />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onVolver}
          disabled={cargando}
          className="px-4 py-3 rounded-lg text-sm font-medium text-text-muted hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Volver
        </button>
        <button
          type="button"
          onClick={onContinuar}
          disabled={cargando || valor == null}
          className="flex-1 py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 active:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cargando ? 'Preparando...' : 'Comenzar experiencia'}
        </button>
      </div>
    </CardEstres>
  );
}

// ───────── Paso 3: experiencia ─────────
function PasoExperiencia({ onSalir, onTiempo, fase, onCambioFase }) {
  return (
    <div className="space-y-3">
      <p className="text-center text-sm text-text-muted">
        Sigue la esfera con tu respiracion. Puedes rotar la vista arrastrando con el mouse.
      </p>

      <div className="relative w-full h-[75vh] min-h-[440px] rounded-2xl overflow-hidden border border-primary-200 bg-gradient-to-b from-sky-200 to-sky-400">
        <Suspense
          fallback={
            <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
              Cargando escena...
            </div>
          }
        >
          <EscenaPlaya onCambioFase={onCambioFase} />
        </Suspense>

        <div className="absolute top-3 left-3 z-10">
          <CronometroSesion iniciado onTiempo={onTiempo} />
        </div>

        <button
          type="button"
          onClick={onSalir}
          className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/90 text-white text-sm font-medium hover:bg-red-600 transition-colors backdrop-blur-sm shadow-lg"
        >
          <X className="w-4 h-4" aria-hidden="true" />
          Salir
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <FaseRespiracionLabel fase={fase} />
        </div>
      </div>

      <p className="text-center text-xs text-text-muted">
        Recomendamos al menos 60 segundos de practica. Sal cuando te sientas listo.
      </p>
    </div>
  );
}

function FaseRespiracionLabel({ fase }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [fase]);

  return (
    <div
      className={`bg-black/50 backdrop-blur-md text-white rounded-2xl px-8 py-4 text-3xl sm:text-4xl font-bold tracking-wide transition-all duration-500 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      }`}
    >
      {FASE_LABEL[fase] || 'Respira'}
    </div>
  );
}

// ───────── Paso 4: estres despues ─────────
function PasoEstresDespues({
  valor,
  onChange,
  notas,
  onChangeNotas,
  onFinalizar,
  cargando,
  error,
}) {
  return (
    <CardEstres>
      <p className="text-sm text-primary-700 font-medium text-center">
        Despues de la experiencia
      </p>
      <EscalaEstres
        titulo="¿Cual es tu nivel de estres ahora?"
        valor={valor}
        onChange={onChange}
      />

      <div className="space-y-1">
        <label htmlFor="notas-vr" className="block text-sm font-medium text-text-main">
          ¿Como te sentiste?{' '}
          <span className="text-text-muted font-normal">(opcional)</span>
        </label>
        <textarea
          id="notas-vr"
          value={notas}
          onChange={(e) => onChangeNotas(e.target.value)}
          maxLength={500}
          rows={3}
          placeholder="Comparte lo que sentiste durante la practica..."
          className="w-full rounded-lg border-2 border-primary-100 bg-surface px-3 py-2 text-sm focus:outline-none focus:border-primary-500 resize-none"
        />
        <p className="text-xs text-text-muted text-right tabular-nums">
          {notas.length} / 500
        </p>
      </div>

      <AlertaError mensaje={error} />

      <button
        type="button"
        onClick={onFinalizar}
        disabled={cargando || valor == null}
        className="w-full py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 active:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {cargando ? 'Guardando...' : 'Finalizar'}
      </button>
    </CardEstres>
  );
}

// ───────── Paso 5: resultado ─────────
function PasoResultado({ estresAntes, estresDespues, duracion, onOtraSesion, onVerProgreso }) {
  const reducido = estresAntes > estresDespues;
  const min = Math.floor(duracion / 60);
  const sec = duracion % 60;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-surface rounded-2xl shadow-sm border border-primary-100 p-8 text-center space-y-6">
        <div className="text-7xl" aria-hidden="true">
          {reducido ? '🎉' : '💚'}
        </div>

        {reducido ? (
          <div>
            <h2 className="text-2xl font-bold text-text-main mb-2">
              ¡Bajaste tu estres de {estresAntes} a {estresDespues}!
            </h2>
            <p className="text-text-muted">
              Disminuiste {estresAntes - estresDespues}{' '}
              {estresAntes - estresDespues === 1 ? 'punto' : 'puntos'}.
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-text-main mb-2">
              Cada practica cuenta.
            </h2>
            <p className="text-text-muted">
              Sigue intentandolo. El bienestar se construye con constancia.
            </p>
          </div>
        )}

        <div className="bg-primary-50 rounded-xl p-4 border border-primary-100">
          <p className="text-sm text-text-muted">Tiempo de practica</p>
          <p className="text-xl font-bold text-text-main tabular-nums">
            {min} {min === 1 ? 'minuto' : 'minutos'} {sec} {sec === 1 ? 'segundo' : 'segundos'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <button
            type="button"
            onClick={onOtraSesion}
            className="px-5 py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 active:bg-primary-800 transition-colors"
          >
            Hacer otra sesion
          </button>
          <button
            type="button"
            onClick={onVerProgreso}
            className="px-5 py-3 rounded-lg border-2 border-primary-300 text-primary-700 font-semibold hover:bg-primary-50 transition-colors"
          >
            Ver mi progreso
          </button>
        </div>
      </div>
    </div>
  );
}

function CardEstres({ children }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-surface rounded-2xl shadow-sm border border-primary-100 p-6 sm:p-8 space-y-6">
        {children}
      </div>
    </div>
  );
}
