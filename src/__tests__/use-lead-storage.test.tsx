import { renderHook, act } from '@testing-library/react';
import { useLeadsStorage } from '../hooks/use-lead-storage';
import type { LeadInputData } from '../utils/normalizer';

const LEADS_STORAGE_KEY = 'javeriana_leads';

const sampleInput: LeadInputData = {
  nombre: 'Juan Pérez',
  tipo_documento: 'CC',
  documento: '12345678',
  email: 'juan@javeriana.edu.co',
  telefono: '3001234567',
  programa_interes: 'Ingeniería de Sistemas',
  facultad: 'Ingeniería',
};

describe('useLeadsStorage', () => {
  afterEach(() => {
    rstest.restoreAllMocks();
  });

  test('H1 — sin datos previos, leads inicia como array vacío', () => {
    const { result } = renderHook(() => useLeadsStorage());
    expect(result.current.leads).toEqual([]);
  });

  test('H2 — carga leads existentes de localStorage al montar', () => {
    const stored = [{ ...sampleInput, id: '1', fecha_inscripcion: '2026-04-27T00:00:00.000Z' }];
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(stored));

    const { result } = renderHook(() => useLeadsStorage());

    expect(result.current.leads).toHaveLength(1);
    expect(result.current.leads[0].nombre).toBe('Juan Pérez');
  });

  test('H3 — localStorage con JSON corrupto retorna array vacío sin lanzar excepción', () => {
    localStorage.setItem(LEADS_STORAGE_KEY, 'invalid json {{{');

    const { result } = renderHook(() => useLeadsStorage());

    expect(result.current.leads).toEqual([]);
  });

  test('H4 — addLead agrega lead al estado y lo persiste en localStorage', () => {
    const { result } = renderHook(() => useLeadsStorage());

    let addResult = false;
    act(() => {
      addResult = result.current.addLead(sampleInput);
    });

    expect(addResult).toBe(true);
    expect(result.current.leads).toHaveLength(1);
    expect(typeof result.current.leads[0].id).toBe('string');

    const raw = localStorage.getItem(LEADS_STORAGE_KEY);
    const persisted: unknown[] = JSON.parse(raw ?? '[]');
    expect(persisted).toHaveLength(1);
  });

  test('H5 — addLead acumula múltiples leads sin sobreescribir el primero', () => {
    const firstLead = { ...sampleInput, id: '1', fecha_inscripcion: '2026-04-27T00:00:00.000Z' };
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify([firstLead]));

    const { result } = renderHook(() => useLeadsStorage());
    act(() => {
      result.current.addLead({ ...sampleInput, documento: '99999999' });
    });

    expect(result.current.leads).toHaveLength(2);
  });

  test('H6 — addLead retorna false cuando localStorage.setItem lanza', () => {
    rstest.spyOn(window.localStorage, 'setItem').mockImplementationOnce(() => {
      throw new Error('QuotaExceededError');
    });

    const { result } = renderHook(() => useLeadsStorage());

    let addResult = true;
    act(() => {
      addResult = result.current.addLead(sampleInput);
    });

    expect(addResult).toBe(false);
    expect(result.current.leads).toEqual([]);
  });

  test('H7 — fecha_inscripcion es un ISO string de fecha válida', () => {
    const { result } = renderHook(() => useLeadsStorage());
    act(() => {
      result.current.addLead(sampleInput);
    });

    const { fecha_inscripcion } = result.current.leads[0];
    expect(Number.isNaN(new Date(fecha_inscripcion).getTime())).toBe(false);
  });
});
