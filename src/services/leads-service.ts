import type { Lead } from '../types';
import { apiClient } from './api-client';

const MOCK_LEADS: Lead[] = [
    {
        id: 'mock-1',
        nombre: 'Andrés Felipe Castro',
        email: 'af.castro@javeriana.edu.co',
        telefono: '573101234567',
        tipo_documento: 'CC',
        documento: '10203040',
        programa_interes: 'Ingeniería de Sistemas',
        facultad: 'Ingeniería',
        fecha_inscripcion: new Date().toISOString()
    },
];

export const leadsService = {
    getLeads: async (): Promise<Lead[]> => {
        try {
            return await apiClient<Lead[]>('api/leads');
        } catch (error) {
            console.log("Usando fallback de leads:", error);
            return MOCK_LEADS;
        }
    }
};