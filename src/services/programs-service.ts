
import type { Programa } from '../types';
import { apiClient } from './api-client';

// Datos de rescate por si la API falla o nos quedamos sin cuota
const FALLBACK_PROGRAMAS: Programa[] = [
  { id: '1', nombre: 'Arquitectura', tipo_programa: 'Pregrado', facultad: 'Facultad de Arquitectura y Diseño', descripcion: 'Programa académico enfocado en el diseño y construcción de espacios sostenibles.', url_detalle: 'https://www.javeriana.edu.co/carrera-arquitectura', imagen_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=80' },
  { id: '2', nombre: 'Química Farmacéutica', tipo_programa: 'Pregrado', facultad: 'Facultad de Ciencias', descripcion: 'Diseño, desarrollo y control de calidad de medicamentos y cosméticos.', url_detalle: 'https://www.javeriana.edu.co/carrera-quimica-farmaceutica', imagen_url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=500&q=80' },
  { id: '3', nombre: 'Maestría en Economía', tipo_programa: 'Maestría', facultad: 'Facultad de Ciencias Económicas y Administrativas', descripcion: 'Profundización en teoría económica, políticas públicas y econometría.', url_detalle: 'https://www.javeriana.edu.co/maestria-economia/', imagen_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80' },
  { id: '4', nombre: 'Diplomado en Marketing Digital Estratégico', tipo_programa: 'Educación Continua', facultad: 'Facultad de Ciencias Económicas y Administrativas', descripcion: 'Aprende a diseñar y ejecutar estrategias digitales de alto impacto para potenciar marcas.', url_detalle: '', imagen_url: 'https://images.unsplash.com/photo-1432888117426-15c015dd9c3e?auto=format&fit=crop&w=500&q=80' }
];

export const programasService = {
  getProgramas: async (): Promise<Programa[]> => {
    try {
      return await apiClient<Programa[]>('api/programs');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return FALLBACK_PROGRAMAS;
    }
  }
};