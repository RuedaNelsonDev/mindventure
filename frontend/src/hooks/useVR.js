import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export const KEYS = {
  sesiones: ['vr', 'sesiones'],
  estadisticas: ['vr', 'estadisticas'],
};

export function useSesionesVR() {
  return useQuery({
    queryKey: KEYS.sesiones,
    queryFn: async () => {
      const res = await api.get('/vr/sesiones');
      return res?.data?.data?.sesiones || [];
    },
  });
}

export function useEstadisticasVR() {
  return useQuery({
    queryKey: KEYS.estadisticas,
    queryFn: async () => {
      const res = await api.get('/vr/estadisticas');
      return res?.data?.data || null;
    },
  });
}

export function useIniciarSesion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (datos) => {
      const res = await api.post('/vr/iniciar', datos);
      return res?.data?.data?.sesion;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.sesiones });
    },
  });
}

export function useFinalizarSesion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...datos }) => {
      const res = await api.patch(`/vr/${id}/finalizar`, datos);
      return res?.data?.data?.sesion;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.sesiones });
      qc.invalidateQueries({ queryKey: KEYS.estadisticas });
    },
  });
}
