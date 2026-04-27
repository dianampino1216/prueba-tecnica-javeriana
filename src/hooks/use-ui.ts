import { useContext } from 'react';
import { UIContext } from '../contexts/ui-context';

export const useUI = () => {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
};
