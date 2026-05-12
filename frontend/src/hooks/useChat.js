import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export const HISTORIAL_KEY = ['chat', 'historial'];

export function useHistorial() {
  return useQuery({
    queryKey: HISTORIAL_KEY,
    queryFn: async () => {
      const res = await api.get('/chat/historial');
      return res?.data?.data?.consultas || [];
    },
  });
}

export function useEnviarConsulta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (pregunta) => {
      const res = await api.post('/chat/enviar', { pregunta });
      return res?.data?.data?.consulta;
    },
    onSuccess: (nuevaConsulta) => {
      // Optimistic cache update: backend devuelve DESC, prepend.
      if (nuevaConsulta?._id) {
        qc.setQueryData(HISTORIAL_KEY, (old = []) => [nuevaConsulta, ...old]);
      }
      qc.invalidateQueries({ queryKey: HISTORIAL_KEY });
    },
  });
}

export function useEliminarConsulta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/chat/${id}`);
      return id;
    },
    onSuccess: (id) => {
      qc.setQueryData(HISTORIAL_KEY, (old = []) =>
        old.filter((c) => c._id !== id)
      );
      qc.invalidateQueries({ queryKey: HISTORIAL_KEY });
    },
  });
}
