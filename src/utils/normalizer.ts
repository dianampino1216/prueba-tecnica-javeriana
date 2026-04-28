import type { Lead } from '../types';

// Normalize text to title case
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

export type LeadInputData = Omit<Lead, 'id' | 'fecha_inscripcion'>;

export const normalizeLeadData = (data: LeadInputData): LeadInputData => {
    return {
        ...data,
        nombre: normalizeName(data.nombre),
        email: data.email.trim().toLowerCase(),
        telefono: data.telefono.replace(/\s+/g, '').replace(/-/g, ''),
        programa_interes: data.programa_interes.trim(),
        facultad: data.facultad.trim(),
    };
};

// Strip accents and diacritics for accent-insensitive search
export const removeAccents = (str: string): string => {
    if (!str) return '';
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};