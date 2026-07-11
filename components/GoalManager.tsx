// components/GoalManager.tsx
'use client';

import { useState, useEffect } from 'react';
import { FocusArea, FocusDay } from '@/types';
import { useGoals } from '@/hooks/useGoals';
import styles from './GoalManager.module.css';

interface GoalManagerProps {
  areas: FocusArea[];
  focusDays: FocusDay[];
  onUpdate: (goals: any[]) => void;
}

export default function GoalManager({ areas, focusDays, onUpdate }: GoalManagerProps) {
  const { 
    goals, 
    addGoal, 
    addSubGoal, 
    updateSubGoal, 
    deleteSubGoal, 
    deleteGoal 
  } = useGoals(areas, focusDays);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetDate: '',
  });

  // Оновлюємо батьківський компонент при зміні goals через useEffect
  useEffect(() => {
    onUpdate(goals);
  }, [goals, onUpdate]);

  const handleCreateGoal = () => {
    if (!newGoal.title || !newGoal.targetDate) return;

    addGoal({
      title: newGoal.title,
      description: newGoal.description,
      targetDate: newGoal.targetDate,
    });

    setNewGoal({ title: '', description: '', targetDate: '' });
    setShowCreateForm(false);
  };

  const handleAddSubGoal = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    addSubGoal(goalId, {
      title: `Підціль ${goal.subGoals.length + 1}`,
      description: '',
      targetSessions: 5,
      focusAreaIds: areas.slice(0, 1).map(a => a.id),
      exerciseIds: [],
    });
  };

  const getGoalProgress = (goal: any) => {
    if (goal.subGoals.length === 0) return 0;
    const completed = goal.subGoals.filter((sg: any) => sg.completed).length;
    return (completed / goal.subGoals.length) * 100;
  };

  const getTotalSessionsNeeded = (goal: any) => {
    return goal.subGoals.reduce((sum: number, sg: any) => sum + sg.targetSessions, 0);
  };

  const getTotalSessionsCompleted = (goal: any) => {
    return goal.subGoals.reduce((sum: number, sg: any) => sum + sg.currentSessions, 0);
  };

  const hasAreas = areas.length > 0;

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
                      onClick={() => deleteGoal(goal.id)}
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
                      onClick={() => handleAddSubGoal(goal.id)}
                    >
                      + Додати підціль
                    </button>
                  </div>

                  {goal.subGoals.length === 0 ? (
                    <p className={styles.noSubGoals}>Додайте підцілі, щоб розбити велику ціль</p>
                  ) : (
                    <div className={styles.subGoalsList}>
                      {goal.subGoals.map((subGoal: any) => (
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
                                  areas.map((area: any) => {
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
                                            ? subGoal.focusAreaIds.filter((id: string) => id !== area.id)
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
                                <input
                                  type="number"
                                  min="1"
                                  max="100"
                                  value={subGoal.targetSessions}
                                  onChange={(e) => updateSubGoal(goal.id, subGoal.id, { 
                                    targetSessions: parseInt(e.target.value) || 1 
                                  })}
                                  className={styles.subGoalTargetInput}
                                />
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