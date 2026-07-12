// context/GoalsContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FocusGoal } from '@/types';

interface GoalsContextType {
  goals: FocusGoal[];
  setGoals: (goals: FocusGoal[]) => void;
  addGoal: (goal: FocusGoal) => void;
  updateGoal: (id: string, updates: Partial<FocusGoal>) => void;
  deleteGoal: (id: string) => void;
  loading: boolean;
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export function GoalsProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals] = useState<FocusGoal[]>([]);
  const [loading, setLoading] = useState(true);

  // Завантаження даних при монтуванні
  useEffect(() => {
    const saved = localStorage.getItem('focusGoalsData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setGoals(parsed);
      } catch {
        setGoals([]);
      }
    }
    setLoading(false);
  }, []);

  // Збереження при зміні
  useEffect(() => {
    if (!loading) {
      if (goals.length > 0) {
        localStorage.setItem('focusGoalsData', JSON.stringify(goals));
      } else {
        localStorage.removeItem('focusGoalsData');
      }
    }
  }, [goals, loading]);

  const addGoal = (goal: FocusGoal) => {
    setGoals(prev => [...prev, goal]);
  };

  const updateGoal = (id: string, updates: Partial<FocusGoal>) => {
    setGoals(prev => prev.map(g => 
      g.id === id ? { ...g, ...updates } : g
    ));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  return (
    <GoalsContext.Provider value={{ goals, setGoals, addGoal, updateGoal, deleteGoal, loading }}>
      {children}
    </GoalsContext.Provider>
  );
}

export function useGoals() {
  const context = useContext(GoalsContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalsProvider');
  }
  return context;
}