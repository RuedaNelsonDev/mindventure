import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Activity,
  ArrowRight,
  BookOpen,
  Calendar,
  MessageCircle,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { useDashboard } from '../hooks/useDashboard';
import SaludoBienvenida from '../components/dashboard/SaludoBienvenida';
import RegistroRapidoHoy from '../components/dashboard/RegistroRapidoHoy';
import TarjetaAccionRapida from '../components/dashboard/TarjetaAccionRapida';
import UltimaActividad from '../components/dashboard/UltimaActividad';
import MiniGraficoTendencia from '../components/dashboard/MiniGraficoTendencia';
import TarjetaResumen from '../components/monitoreo/TarjetaResumen';
import TarjetaRecurso from '../components/recursos/TarjetaRecurso';

export default function Dashboard() {
  const { user } = useAuth();
  const {
    resumenEmocional,
    registros,
    statsVR,
    ultimaSesionVR,
    ultimasConsultas,
    recursosSugeridos,
  } = useDashboard();

  const sesionesTotal = statsVR?.totalSesiones || 0;
  const reduccion = Number(statsVR?.promedioReduccionEstres || 0).toFixed(1);
  const totalConsultas = ultimasConsultas.length;
  const ultimaConsultaTime = ultimasConsultas[0]?.createdAt
    ? formatDistanceToNow(new Date(ultimasConsultas[0].createdAt), {
        addSuffix: true,
        locale: es,
      })
    : null;
  const promedioSemana = Number(resumenEmocional?.promedioSemana || 0).toFixed(1);
  const dias = resumenEmocional?.diasConsecutivos || 0;
  const totalRegistros = resumenEmocional?.totalRegistros || 0;

  return (
    <div className="space-y-6">
      {/* Fila 1 — Saludo */}
      <SaludoBienvenida nombre={user?.nombre || 'amigo'} />

      {/* Fila 2 — Registro rapido */}
      <RegistroRapidoHoy />

      {/* Fila 3 — KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <TarjetaResumen
          titulo="Sesiones VR"
          valor={sesionesTotal}
          subtitulo={
            sesionesTotal > 0
              ? `Reduccion promedio: ${reduccion} pts`
              : 'Aun no has practicado'
          }
          icono={Sparkles}
        />
        <TarjetaResumen
          titulo="Conversaciones"
          valor={totalConsultas}
          subtitulo={
            ultimaConsultaTime ? `Ultima ${ultimaConsultaTime}` : 'Aun no has conversado'
          }
          icono={MessageCircle}
        />
        <TarjetaResumen
          titulo="Dias registrados"
          valor={totalRegistros}
          subtitulo={`Racha: ${dias} ${dias === 1 ? 'dia' : 'dias'}`}
          icono={Calendar}
        />
        <TarjetaResumen
          titulo="Promedio semana"
          valor={promedioSemana}
          subtitulo="Escala 1 - 5"
          icono={TrendingUp}
          tendencia={resumenEmocional?.tendencia}
        />
      </div>

      {/* Fila 4 — Acciones rapidas */}
      <div>
        <h2 className="text-lg font-bold text-text-main mb-3">
          ¿Que quieres hacer?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TarjetaAccionRapida
            icono={MessageCircle}
            titulo="Hablar con IA"
            descripcion="Conversa cuando lo necesites con MindVenture."
            color="primary"
            to="/chat"
          />
          <TarjetaAccionRapida
            icono={Sparkles}
            titulo="Sesion VR"
            descripcion="Sumergete en un entorno calmante."
            color="secondary"
            to="/vr"
          />
          <TarjetaAccionRapida
            icono={BookOpen}
            titulo="Explorar recursos"
            descripcion="Tecnicas concretas con evidencia."
            color="amber"
            to="/recursos"
          />
          <TarjetaAccionRapida
            icono={Activity}
            titulo="Mi monitoreo"
            descripcion="Mira tu evolucion emocional."
            color="blue"
            to="/monitoreo"
          />
        </div>
      </div>

      {/* Fila 5 — Split: tendencia + recursos sugeridos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-surface rounded-2xl border border-primary-100 p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-bold text-text-main">Mi evolucion emocional</h3>
              <p className="text-xs text-text-muted">Ultimos registros</p>
            </div>
            <Link
              to="/monitoreo"
              className="text-xs text-primary-700 hover:underline inline-flex items-center gap-0.5"
            >
              Ver detalle <ArrowRight className="w-3 h-3" aria-hidden="true" />
            </Link>
          </div>
          <MiniGraficoTendencia registros={registros} />
        </div>

        <div className="bg-surface rounded-2xl border border-primary-100 p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-bold text-text-main">Recursos sugeridos</h3>
              <p className="text-xs text-text-muted">Seleccionados para ti</p>
            </div>
            <Link
              to="/recursos"
              className="text-xs text-primary-700 hover:underline inline-flex items-center gap-0.5"
            >
              Ver todos <ArrowRight className="w-3 h-3" aria-hidden="true" />
            </Link>
          </div>
          <div className="space-y-2">
            {recursosSugeridos.length === 0 ? (
              <p className="text-sm text-text-muted text-center py-4">
                Sin recursos disponibles.
              </p>
            ) : (
              recursosSugeridos
                .slice(0, 3)
                .map((r) => (
                  <TarjetaRecurso
                    key={r._id}
                    recurso={r}
                    variante="sugerido"
                  />
                ))
            )}
          </div>
        </div>
      </div>

      {/* Fila 6 — Ultima actividad */}
      <UltimaActividad
        ultimasConsultas={ultimasConsultas}
        ultimaSesionVR={ultimaSesionVR}
        ultimosRegistros={registros}
      />
    </div>
  );
}
