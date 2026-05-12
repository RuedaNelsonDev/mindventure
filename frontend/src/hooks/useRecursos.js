import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

const STALE_5_MIN = 5 * 60 * 1000;

export function useRecursos(params = {}) {
  return useQuery({
    queryKey: ['recursos', params],
    queryFn: async () => {
      const res = await api.get('/recursos', { params });
      return res?.data?.data?.recursos || [];
    },
    staleTime: STALE_5_MIN,
  });
}

export function useRecurso(id) {
  return useQuery({
    queryKey: ['recursos', id],
    queryFn: async () => {
      const res = await api.get(`/recursos/${id}`);
      return res?.data?.data?.recurso || null;
    },
    enabled: !!id,
    staleTime: STALE_5_MIN,
    retry: (failureCount, error) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 1;
    },
  });
}

export function useRecursosSugeridos() {
  return useQuery({
    queryKey: ['recursos', 'sugeridos'],
    queryFn: async () => {
      const res = await api.get('/recursos/sugeridos');
      return res?.data?.data?.recursos || [];
    },
    staleTime: STALE_5_MIN,
  });
}
