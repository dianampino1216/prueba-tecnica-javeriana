import { useState } from 'react';
import type { Lead } from '../types';
import type { LeadInputData } from '../utils/normalizer';

const LEADS_STORAGE_KEY = 'javeriana_leads';

export const useLeadsStorage = () => {
  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const item = window.localStorage.getItem(LEADS_STORAGE_KEY);
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error('Error al leer de localStorage:', error);
      return [];
    }
  });

  const addLead = (normalizedData: LeadInputData): boolean => {
    try {
      const newLead: Lead = {
        ...normalizedData,
        id: typeof crypto !== 'undefined' && crypto.randomUUID 
          ? crypto.randomUUID() 
          : Date.now().toString(),
        fecha_inscripcion: new Date().toISOString(),
      };

      const updatedLeads = [...leads, newLead];
      window.localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updatedLeads));
      setLeads(updatedLeads);

      return true;
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
      return false; 
    }
  };

  return { leads, addLead };
};