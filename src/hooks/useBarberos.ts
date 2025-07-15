// src/hooks/useBarberos.ts

import { useQuery } from '@tanstack/react-query';
import useApiClient from './useApiClient';
import { type Servicio } from './useServicios'; // Reutilizamos la interfaz

// --- INTERFACES COMPLETAS ---
// La API devuelve el objeto 'user' anidado
interface UserData {
  id: number;
  nombre: string;
  email: string;
}

export interface Barbero {
  id: number;
  user_id: number;
  barberia_id: number;
  foto_url: string | null;
  biografia: string | null;
  estado: 'activo' | 'inactivo';
  user: UserData;
  servicios: Servicio[]; // La API devuelve los servicios asociados
}

export const useBarberos = (barberiaId?: number) => {
  const apiClient = useApiClient();

  const getBarberos = async () => {
    const response = await apiClient.get<Barbero[]>(`/barberos?barberia_id=${barberiaId}`);
    return response.data;
  };

  const barberosQuery = useQuery({
    queryKey: ['barberos', barberiaId],
    queryFn: getBarberos,
    enabled: !!barberiaId,
  });

  return {
    barberos: barberosQuery.data,
    isLoading: barberosQuery.isLoading,
  };
};
