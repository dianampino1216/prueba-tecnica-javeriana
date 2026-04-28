import { normalizeName, normalizeLeadData, removeAccents } from '../utils/normalizer';
import type { LeadInputData } from '../utils/normalizer';

const baseLead: LeadInputData = {
  nombre: 'Test',
  tipo_documento: 'CC',
  documento: '12345678',
  email: 'test@javeriana.edu.co',
  telefono: '3001234567',
  programa_interes: 'Ingeniería de Sistemas',
  facultad: 'Ingeniería',
};

describe('normalizeName', () => {
  test('N1 — string vacío retorna string vacío', () => {
    expect(normalizeName('')).toBe('');
  });

  test('N2 — nombre con espacios extras queda en Title Case sin espacios dobles', () => {
    expect(normalizeName('  juan   pérez  ')).toBe('Juan Pérez');
  });

  test('N3 — una sola letra queda en mayúscula', () => {
    expect(normalizeName('o')).toBe('O');
  });

  test('N4 — tildes se preservan en el resultado', () => {
    expect(normalizeName('ángela')).toBe('Ángela');
  });
});

describe('removeAccents', () => {
  test('N5 — elimina tildes y diacríticos del string', () => {
    expect(removeAccents('ángela')).toBe('angela');
  });

  test('N6 — string vacío retorna string vacío', () => {
    expect(removeAccents('')).toBe('');
  });
});

describe('normalizeLeadData', () => {
  test('N7 — normaliza email a lowercase con trim', () => {
    const result = normalizeLeadData({ ...baseLead, email: 'USER@Javeriana.edu.co' });
    expect(result.email).toBe('user@javeriana.edu.co');
  });

  test('N8 — limpia guiones y espacios del teléfono', () => {
    const result = normalizeLeadData({ ...baseLead, telefono: '310-555 1234' });
    expect(result.telefono).toBe('3105551234');
  });

  test('N9 — aplica Title Case al nombre', () => {
    const result = normalizeLeadData({ ...baseLead, nombre: 'maria camila' });
    expect(result.nombre).toBe('Maria Camila');
  });
});
