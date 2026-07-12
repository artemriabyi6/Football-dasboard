// components/GoalManager.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { FocusGoal, FocusSubGoal, FocusArea, FocusDay } from '@/types';
import { useGoals } from '@/context/GoalsContext';
import styles from './GoalManager.module.css';

interface GoalManagerProps {
  areas: FocusArea[];
  focusDays: FocusDay[];
}

export default function GoalManager({ areas, focusDays }: GoalManagerProps) {
  const { goals, addGoal, updateGoal, deleteGoal, setGoals } = useGoals();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSubGoalId, setEditingSubGoalId] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState<Partial<FocusGoal>>({
    title: '',
    description: '',
    targetDate: '',
    subGoals: [],
  });
  
  const [isUpdating, setIsUpdating] = useState(false);

  // Функція для підрахунку прогресу
  const calculateProgress = useCallback((goal: FocusGoal) => {
    const updatedSubGoals = goal.subGoals.map(subGoal => {
      const sessions = focusDays.filter(day => 
        day.areaIds.some(id => subGoal.focusAreaIds.includes(id))
      ).length;
      
      const currentSessions = Math.min(sessions, subGoal.targetSessions);
      const completed = currentSessions >= subGoal.targetSessions;
      
      return {
        ...subGoal,
        currentSessions,
        completed,
        completedAt: completed && !subGoal.completed ? new Date().toISOString() : subGoal.completedAt,
      };
    });

    const allCompleted = updatedSubGoals.every(sg => sg.completed);
    
    return {
      ...goal,
      subGoals: updatedSubGoals,
      completed: allCompleted,
      completedAt: allCompleted && !goal.completed ? new Date().toISOString() : goal.completedAt,
    };
  }, [focusDays]);

  // Оновлення прогресу
  useEffect(() => {
    if (goals.length === 0 || focusDays.length === 0 || areas.length === 0 || isUpdating) {
      return;
    }

    setIsUpdating(true);

    try {
      const updatedGoals = goals.map(goal => calculateProgress(goal));
      
      const hasChanges = updatedGoals.some((newGoal, index) => {
        const oldGoal = goals[index];
        return JSON.stringify(newGoal.subGoals) !== JSON.stringify(oldGoal.subGoals);
      });

      if (hasChanges) {
        setGoals(updatedGoals);
      }
    } finally {
      setTimeout(() => {
        setIsUpdating(false);
      }, 100);
    }
  }, [focusDays, areas, goals, calculateProgress, setGoals]);

  const handleCreateGoal = () => {
    if (!newGoal.title || !newGoal.targetDate) return;

    const goal: FocusGoal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description || '',
      targetDate: newGoal.targetDate,
      createdAt: new Date().toISOString(),
      completed: false,
      subGoals: [],
    };

    addGoal(goal);
    setNewGoal({ title: '', description: '', targetDate: '', subGoals: [] });
    setShowCreateForm(false);
  };

  const addSubGoal = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const newSubGoal: FocusSubGoal = {
      id: Date.now().toString(),
      title: `Підціль ${goal.subGoals.length + 1}`,
      description: '',
      targetSessions: 5,
      currentSessions: 0,
      completed: false,
      focusAreaIds: areas.slice(0, 1).map(a => a.id),
      exerciseIds: [],
    };

    const updatedGoal = {
      ...goal,
      subGoals: [...goal.subGoals, newSubGoal]
    };
    updateGoal(goalId, { subGoals: updatedGoal.subGoals });
  };

  const updateSubGoal = (goalId: string, subGoalId: string, updates: Partial<FocusSubGoal>) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const updatedSubGoals = goal.subGoals.map(sg => 
      sg.id === subGoalId ? { ...sg, ...updates } : sg
    );
    updateGoal(goalId, { subGoals: updatedSubGoals });
  };

  const deleteSubGoal = (goalId: string, subGoalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const updatedSubGoals = goal.subGoals.filter(sg => sg.id !== subGoalId);
    updateGoal(goalId, { subGoals: updatedSubGoals });
  };

  const handleDeleteGoal = (goalId: string) => {
    if (!confirm('Ви впевнені, що хочете видалити цю ціль?')) return;
    deleteGoal(goalId);
  };

  const getGoalProgress = (goal: FocusGoal) => {
    if (goal.subGoals.length === 0) return 0;
    const completed = goal.subGoals.filter(sg => sg.completed).length;
    return (completed / goal.subGoals.length) * 100;
  };

  const getTotalSessionsNeeded = (goal: FocusGoal) => {
    return goal.subGoals.reduce((sum, sg) => sum + sg.targetSessions, 0);
  };

  const getTotalSessionsCompleted = (goal: FocusGoal) => {
    return goal.subGoals.reduce((sum, sg) => sum + sg.currentSessions, 0);
  };

  const hasAreas = areas.length > 0;

  const handleTargetChange = (goalId: string, subGoalId: string, value: number) => {
    const newValue = Math.max(1, Math.min(100, value));
    updateSubGoal(goalId, subGoalId, { targetSessions: newValue });
  };

  const adjustTarget = (goalId: string, subGoalId: string, currentValue: number, delta: number) => {
    const newValue = Math.max(1, Math.min(100, currentValue + delta));
    updateSubGoal(goalId, subGoalId, { targetSessions: newValue });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>🎯 Мої цілі</h3>
        <button 
          className={styles.addButton}
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? '✕' : '+ Нова ціль'}
        </button>
      </div>

      {showCreateForm && (
        <div className={styles.createForm}>
          <input
            type="text"
            placeholder="Назва цілі"
            value={newGoal.title}
            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Опис (опціонально)"
            value={newGoal.description}
            onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
            className={styles.input}
          />
          <input
            type="date"
            value={newGoal.targetDate}
            onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
            className={styles.input}
          />
          <div className={styles.formActions}>
            <button 
              className={styles.cancelButton}
              onClick={() => setShowCreateForm(false)}
            >
              Скасувати
            </button>
            <button 
              className={styles.saveButton}
              onClick={handleCreateGoal}
              disabled={!newGoal.title || !newGoal.targetDate}
            >
              Створити ціль
            </button>
          </div>
        </div>
      )}

      {!hasAreas && (
        <div className={styles.warning}>
          ⚠️ Спочатку додайте напрямки розвитку на сторінці &quot;Фокус&quot;
        </div>
      )}

      {goals.length === 0 ? (
        <div className={styles.emptyState}>
          <p>👋 Створіть свою першу ціль</p>
          <p className={styles.emptySubtext}>Розбийте її на підцілі та відстежуйте прогрес</p>
        </div>
      ) : (
        <div className={styles.goalsList}>
          {goals.map(goal => {
            const progress = getGoalProgress(goal);
            const totalSessions = getTotalSessionsNeeded(goal);
            const completedSessions = getTotalSessionsCompleted(goal);

            return (
              <div key={goal.id} className={`${styles.goalCard} ${goal.completed ? styles.completed : ''}`}>
                <div className={styles.goalHeader}>
                  <div className={styles.goalInfo}>
                    <h4 className={styles.goalTitle}>{goal.title}</h4>
                    {goal.description && (
                      <p className={styles.goalDescription}>{goal.description}</p>
                    )}
                  </div>
                  <div className={styles.goalActions}>
                    <span className={styles.goalStatus}>
                      {goal.completed ? '✅ Виконано' : `⏳ ${Math.round(progress)}%`}
                    </span>
                    <button 
                      className={styles.deleteGoalButton}
                      onClick={() => handleDeleteGoal(goal.id)}
                      aria-label="Видалити ціль"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className={styles.goalMeta}>
                  <span>📅 До: {new Date(goal.targetDate).toLocaleDateString('uk-UA')}</span>
                  <span>🏃 {completedSessions} / {totalSessions} тренувань</span>
                  <span>📊 {goal.subGoals.length} підцілей</span>
                </div>

                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className={styles.subGoals}>
                  <div className={styles.subGoalsHeader}>
                    <span className={styles.subGoalsTitle}>Підцілі</span>
                    <button 
                      className={styles.addSubGoalButton}
                      onClick={() => addSubGoal(goal.id)}
                    >
                      + Додати підціль
                    </button>
                  </div>

                  {goal.subGoals.length === 0 ? (
                    <p className={styles.noSubGoals}>Додайте підцілі, щоб розбити велику ціль</p>
                  ) : (
                    <div className={styles.subGoalsList}>
                      {goal.subGoals.map(subGoal => (
                        <div key={subGoal.id} className={`${styles.subGoal} ${subGoal.completed ? styles.subGoalCompleted : ''}`}>
                          <div className={styles.subGoalInfo}>
                            <div className={styles.subGoalHeader}>
                              <input
                                type="text"
                                value={subGoal.title}
                                onChange={(e) => updateSubGoal(goal.id, subGoal.id, { title: e.target.value })}
                                className={styles.subGoalTitleInput}
                                placeholder="Назва підцілі"
                              />
                              {subGoal.completed && (
                                <span className={styles.subGoalBadge}>✅ Виконано!</span>
                              )}
                            </div>

                            <input
                              type="text"
                              value={subGoal.description || ''}
                              onChange={(e) => updateSubGoal(goal.id, subGoal.id, { description: e.target.value })}
                              className={styles.subGoalDescriptionInput}
                              placeholder="Опис підцілі (опціонально)"
                            />

                            <div className={styles.subGoalStats}>
                              <span>
                                🎯 {subGoal.currentSessions} / {subGoal.targetSessions} тренувань
                              </span>
                              <span className={styles.subGoalProgress}>
                                {Math.round((subGoal.currentSessions / subGoal.targetSessions) * 100)}%
                              </span>
                            </div>

                            <div className={styles.subGoalBar}>
                              <div 
                                className={styles.subGoalFill}
                                style={{ 
                                  width: `${(subGoal.currentSessions / subGoal.targetSessions) * 100}%`,
                                  background: subGoal.completed ? '#22c55e' : '#2563eb',
                                }}
                              />
                            </div>

                            <div className={styles.subGoalAreas}>
                              <span className={styles.subGoalLabel}>Оберіть напрямки для цієї підцілі:</span>
                              <div className={styles.areaSelection}>
                                {areas.length === 0 ? (
                                  <span className={styles.noAreasWarning}>
                                    ⚠️ Немає напрямків. Створіть їх на сторінці &quot;Фокус&quot;
                                  </span>
                                ) : (
                                  areas.map(area => {
                                    const isSelected = subGoal.focusAreaIds.includes(area.id);
                                    return (
                                      <button
                                        key={area.id}
                                        className={`${styles.areaSelectButton} ${isSelected ? styles.selected : ''}`}
                                        style={{
                                          borderColor: isSelected ? area.color : '#e5e7eb',
                                          background: isSelected ? area.color + '20' : 'transparent',
                                        }}
                                        onClick={() => {
                                          const newIds = isSelected
                                            ? subGoal.focusAreaIds.filter(id => id !== area.id)
                                            : [...subGoal.focusAreaIds, area.id];
                                          updateSubGoal(goal.id, subGoal.id, { focusAreaIds: newIds });
                                        }}
                                      >
                                        <span 
                                          className={styles.areaDot}
                                          style={{ background: area.color }}
                                        />
                                        <span className={styles.areaName}>{area.name}</span>
                                        {isSelected && <span className={styles.checkmark}>✓</span>}
                                      </button>
                                    );
                                  })
                                )}
                              </div>
                              {subGoal.focusAreaIds.length > 0 && (
                                <span className={styles.selectedCount}>
                                  Вибрано: {subGoal.focusAreaIds.length} напрямків
                                </span>
                              )}
                            </div>

                            <div className={styles.subGoalControls}>
                              <div className={styles.targetControl}>
                                <label>Ціль тренувань:</label>
                                <div className={styles.targetInputGroup}>
                                  <button 
                                    className={styles.targetAdjustButton}
                                    onClick={() => adjustTarget(goal.id, subGoal.id, subGoal.targetSessions, -1)}
                                    disabled={subGoal.targetSessions <= 1}
                                    aria-label="Зменшити на 1"
                                  >
                                    −
                                  </button>
                                  <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={subGoal.targetSessions}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value);
                                      if (!isNaN(val) && val >= 0) {
                                        handleTargetChange(goal.id, subGoal.id, val);
                                      }
                                    }}
                                    onBlur={(e) => {
                                      const val = parseInt(e.target.value);
                                      if (isNaN(val) || val < 1) {
                                        handleTargetChange(goal.id, subGoal.id, 1);
                                      } else if (val > 100) {
                                        handleTargetChange(goal.id, subGoal.id, 100);
                                      }
                                    }}
                                    className={styles.subGoalTargetInput}
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                  />
                                  <button 
                                    className={styles.targetAdjustButton}
                                    onClick={() => adjustTarget(goal.id, subGoal.id, subGoal.targetSessions, 1)}
                                    disabled={subGoal.targetSessions >= 100}
                                    aria-label="Збільшити на 1"
                                  >
                                    +
                                  </button>
                                </div>
                                <span className={styles.targetRange}>1-100</span>
                              </div>
                              <button 
                                className={styles.deleteSubGoalButton}
                                onClick={() => deleteSubGoal(goal.id, subGoal.id)}
                                aria-label="Видалити підціль"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}