import { apiClient } from './api-client';
import type { Evento } from '../types';

// Datos de rescate para eventos
const FALLBACK_EVENTOS: Evento[] = [
  { id: '1', nombre: 'Feria de Pregrados Javeriana', fecha: '2026-05-20', descripcion: 'Conoce nuestra oferta.'},
  { id: '2', nombre: 'Webinar: Futuro de la IA', fecha: '2026-05-25', descripcion: 'Charla virtual.'},
  { id: '3', nombre: 'Open Day Arquitectura', fecha: '2026-06-10', descripcion: 'Visita los talleres.'}
];

export const eventosService = {
  getEventos: async (): Promise<Evento[]> => {
    try {
      return await apiClient<Evento[]>('api/events');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return FALLBACK_EVENTOS;
    }
  }
};