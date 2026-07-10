// hooks/useTheories.ts
import { useState, useEffect, useCallback } from 'react';
import { Theory } from '@/types';

export function useTheories() {
  const [theories, setTheories] = useState<Theory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Завантаження всіх теорій
  const fetchTheories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/theory');
      if (!response.ok) {
        throw new Error('Failed to fetch theories');
      }
      const data = await response.json();
      setTheories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Додавання нової теорії
  const addTheory = useCallback(async (theory: Omit<Theory, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/theory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(theory),
      });

      if (!response.ok) {
        throw new Error('Failed to add theory');
      }

      const newTheory = await response.json();
      setTheories(prev => [newTheory, ...prev]);
      return newTheory;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    }
  }, []);

  // Оновлення теорії
  const editTheory = useCallback(async (id: string, updates: Partial<Theory>) => {
    try {
      const response = await fetch(`/api/theory?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update theory');
      }

      const updatedTheory = await response.json();
      setTheories(prev => 
        prev.map(t => t.id === id ? updatedTheory : t)
      );
      return updatedTheory;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    }
  }, []);

  // Видалення теорії
  const removeTheory = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/theory?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete theory');
      }

      setTheories(prev => prev.filter(t => t.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    }
  }, []);

  // Завантаження при монтуванні
  useEffect(() => {
    fetchTheories();
  }, [fetchTheories]);

  return {
    theories,
    loading,
    error,
    fetchTheories,
    addTheory,
    editTheory,
    removeTheory,
  };
}