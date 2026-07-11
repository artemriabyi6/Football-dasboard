// hooks/useGoals.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { FocusGoal, FocusSubGoal, FocusArea, FocusDay } from '@/types';

export function useGoals(areas: FocusArea[], focusDays: FocusDay[]) {
  const [goals, setGoals] = useState<FocusGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const isInitialized = useRef(false);
  const updateTimeout = useRef<NodeJS.Timeout | null>(null);
  const isUpdating = useRef(false);

  // Завантаження даних
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
    isInitialized.current = true;
  }, []);

  // Оновлення прогресу
  const updateProgress = useCallback(() => {
    if (isUpdating.current) return;
    if (goals.length === 0 || focusDays.length === 0 || areas.length === 0) {
      return;
    }

    isUpdating.current = true;
    
    try {
      let hasChanges = false;
      
      const updatedGoals = goals.map(goal => {
        const updatedSubGoals = goal.subGoals.map(subGoal => {
          const sessions = focusDays.filter(day => 
            day.areaIds.some(id => subGoal.focusAreaIds.includes(id))
          ).length;
          
          const currentSessions = Math.min(sessions, subGoal.targetSessions);
          const completed = currentSessions >= subGoal.targetSessions;
          
          if (currentSessions !== subGoal.currentSessions || completed !== subGoal.completed) {
            hasChanges = true;
          }
          
          return {
            ...subGoal,
            currentSessions,
            completed,
            completedAt: completed && !subGoal.completed ? new Date().toISOString() : subGoal.completedAt,
          };
        });

        const allCompleted = updatedSubGoals.every(sg => sg.completed);
        
        if (allCompleted !== goal.completed) {
          hasChanges = true;
        }

        return {
          ...goal,
          subGoals: updatedSubGoals,
          completed: allCompleted,
          completedAt: allCompleted && !goal.completed ? new Date().toISOString() : goal.completedAt,
        };
      });

      if (hasChanges) {
        setGoals(updatedGoals);
      }
    } finally {
      setTimeout(() => {
        isUpdating.current = false;
      }, 50);
    }
  }, [goals, focusDays, areas]);

  // Запускаємо оновлення з затримкою
  useEffect(() => {
    if (!isInitialized.current) return;

    if (updateTimeout.current) {
      clearTimeout(updateTimeout.current);
    }

    updateTimeout.current = setTimeout(() => {
      updateProgress();
    }, 200);

    return () => {
      if (updateTimeout.current) {
        clearTimeout(updateTimeout.current);
      }
    };
  }, [focusDays, areas, updateProgress]);

  // Збереження даних
  useEffect(() => {
    if (!isInitialized.current) return;
    if (isUpdating.current) return;
    
    if (goals.length > 0) {
      localStorage.setItem('focusGoalsData', JSON.stringify(goals));
    } else {
      localStorage.removeItem('focusGoalsData');
    }
  }, [goals]);

  const addGoal = useCallback((goal: Omit<FocusGoal, 'id' | 'createdAt' | 'completed' | 'subGoals'>) => {
    const newGoal: FocusGoal = {
      id: Date.now().toString(),
      ...goal,
      createdAt: new Date().toISOString(),
      completed: false,
      subGoals: [],
    };
    setGoals(prev => [...prev, newGoal]);
    return newGoal;
  }, []);

  const addSubGoal = useCallback((goalId: string, subGoal: Omit<FocusSubGoal, 'id' | 'currentSessions' | 'completed' | 'completedAt'>) => {
    const newSubGoal: FocusSubGoal = {
      id: Date.now().toString(),
      ...subGoal,
      currentSessions: 0,
      completed: false,
      completedAt: undefined,
    };
    
    setGoals(prev => prev.map(g => 
      g.id === goalId 
        ? { ...g, subGoals: [...g.subGoals, newSubGoal] }
        : g
    ));
  }, []);

  const updateSubGoal = useCallback((goalId: string, subGoalId: string, updates: Partial<FocusSubGoal>) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== goalId) return g;
      return {
        ...g,
        subGoals: g.subGoals.map(sg => 
          sg.id === subGoalId ? { ...sg, ...updates } : sg
        ),
      };
    }));
  }, []);

  const deleteSubGoal = useCallback((goalId: string, subGoalId: string) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== goalId) return g;
      return {
        ...g,
        subGoals: g.subGoals.filter(sg => sg.id !== subGoalId),
      };
    }));
  }, []);

  const deleteGoal = useCallback((goalId: string) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
  }, []);

  return {
    goals,
    loading,
    addGoal,
    addSubGoal,
    updateSubGoal,
    deleteSubGoal,
    deleteGoal,
    setGoals,
  };
}