import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export const KEYS = {
  registros: ['monitoreo', 'registros'],
  hoy: ['monitoreo', 'hoy'],
  resumen: ['monitoreo', 'resumen'],
};

export function useRegistrosMonitoreo() {
  return useQuery({
    queryKey: KEYS.registros,
    queryFn: async () => {
      const res = await api.get('/monitoreo/registros');
      return res?.data?.data?.registros || [];
    },
  });
}

export function useRegistroHoy() {
  return useQuery({
    queryKey: KEYS.hoy,
    queryFn: async () => {
      const res = await api.get('/monitoreo/hoy');
      return res?.data?.data?.registro || null;
    },
  });
}

export function useResumenMonitoreo() {
  return useQuery({
    queryKey: KEYS.resumen,
    queryFn: async () => {
      const res = await api.get('/monitoreo/resumen');
      return res?.data?.data || null;
    },
  });
}

export function useCrearRegistro() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (datos) => {
      const res = await api.post('/monitoreo/registros', datos);
      return res?.data?.data?.registro;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.registros });
      qc.invalidateQueries({ queryKey: KEYS.hoy });
      qc.invalidateQueries({ queryKey: KEYS.resumen });
    },
  });
}
