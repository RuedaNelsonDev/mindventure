import { useHistorial } from './useChat';
import {
  useRegistroHoy,
  useRegistrosMonitoreo,
  useResumenMonitoreo,
} from './useMonitoreo';
import { useRecursosSugeridos } from './useRecursos';
import { useEstadisticasVR, useSesionesVR } from './useVR';

/**
 * Orquesta todas las queries necesarias para el Dashboard.
 * Cada query es independiente y corre en paralelo gracias a TanStack Query.
 * No hay endpoint backend nuevo: solo reutilizamos los existentes.
 *
 * `registros` no estaba en la spec original pero lo necesitamos para
 * MiniGraficoTendencia y para UltimaActividad (ultimos 2 registros).
 */
export function useDashboard() {
  const estadoHoy = useRegistroHoy();
  const resumenEmocional = useResumenMonitoreo();
  const registros = useRegistrosMonitoreo();
  const statsVR = useEstadisticasVR();
  const sesionesVR = useSesionesVR();
  const historial = useHistorial();
  const recursosSugeridos = useRecursosSugeridos();

  const ultimaSesionVR = sesionesVR.data?.[0] || null;

  const loading =
    estadoHoy.isLoading ||
    resumenEmocional.isLoading ||
    registros.isLoading ||
    statsVR.isLoading ||
    sesionesVR.isLoading ||
    historial.isLoading ||
    recursosSugeridos.isLoading;

  const error =
    estadoHoy.error ||
    resumenEmocional.error ||
    registros.error ||
    statsVR.error ||
    sesionesVR.error ||
    historial.error ||
    recursosSugeridos.error;

  return {
    estadoHoy: estadoHoy.data,
    resumenEmocional: resumenEmocional.data,
    registros: registros.data || [],
    statsVR: statsVR.data,
    ultimaSesionVR,
    ultimasConsultas: historial.data || [],
    recursosSugeridos: recursosSugeridos.data || [],
    loading,
    error,
  };
}
