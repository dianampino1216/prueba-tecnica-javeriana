import type { Lead } from '../types';

//Normalizar un texto
export const normalizeName = (text: string): string => {
    if (!text) return '';

    const trimmedText = text.trim().replace(/\s+/g, ' ');

    return trimmedText
        .split(' ')
        .map(word => {
            if (word.length === 0) return '';
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');
};

// Usamos Omit<Lead, 'id' | 'fecha_inscripcion'> porque al capturar el formulario
// aún no tenemos el ID (lo generaremos) ni la fecha (la pondremos en el momento)
export type LeadInputData = Omit<Lead, 'id' | 'fecha_inscripcion'>;

export const normalizeLeadData = (data: LeadInputData): LeadInputData => {
    return {
        ...data,
        // Normalizamos el nombre (Ej: "  juan   perez " -> "Juan Perez")
        nombre: normalizeName(data.nombre),

        // Normalizamos el email (siempre en minúsculas y sin espacios)
        email: data.email.trim().toLowerCase(),

        // El teléfono lo limpiamos de espacios o guiones que el usuario haya puesto por error
        telefono: data.telefono.replace(/\s+/g, '').replace(/-/g, ''),

        // Para selects, usualmente un trim() es suficiente por si acaso
        programa_interes: data.programa_interes.trim(),
        facultad: data.facultad.trim(),
    };
};