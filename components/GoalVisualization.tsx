// components/GoalVisualization.tsx
'use client';

import { useMemo } from 'react';
import { FocusGoal } from '@/types';
import styles from './GoalVisualization.module.css';

interface GoalVisualizationProps {
  goals: FocusGoal[];
}

export default function GoalVisualization({ goals }: GoalVisualizationProps) {
  const stats = useMemo(() => {
    const totalGoals = goals.length;
    const completedGoals = goals.filter(g => g.completed).length;
    const totalSubGoals = goals.reduce((sum, g) => sum + g.subGoals.length, 0);
    const completedSubGoals = goals.reduce((sum, g) => 
      sum + g.subGoals.filter(sg => sg.completed).length, 0
    );
    const totalSessionsNeeded = goals.reduce((sum, g) => 
      sum + g.subGoals.reduce((s, sg) => s + sg.targetSessions, 0), 0
    );
    const totalSessionsCompleted = goals.reduce((sum, g) => 
      sum + g.subGoals.reduce((s, sg) => s + sg.currentSessions, 0), 0
    );

    return {
      totalGoals,
      completedGoals,
      totalSubGoals,
      completedSubGoals,
      totalSessionsNeeded,
      totalSessionsCompleted,
      goalProgress: totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0,
      subGoalProgress: totalSubGoals > 0 ? (completedSubGoals / totalSubGoals) * 100 : 0,
      sessionProgress: totalSessionsNeeded > 0 ? (totalSessionsCompleted / totalSessionsNeeded) * 100 : 0,
    };
  }, [goals]);

  if (goals.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>📊 Візуалізація прогресу</h4>
      
      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{stats.totalGoals}</span>
          <span className={styles.statLabel}>Всього цілей</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{stats.completedGoals}</span>
          <span className={styles.statLabel}>Виконано</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{stats.totalSubGoals}</span>
          <span className={styles.statLabel}>Підцілей</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{stats.completedSubGoals}</span>
          <span className={styles.statLabel}>Підцілей виконано</span>
        </div>
      </div>

      <div className={styles.progressBars}>
        <div className={styles.progressItem}>
          <div className={styles.progressLabel}>
            <span>Прогрес цілей</span>
            <span>{Math.round(stats.goalProgress)}%</span>
          </div>
          <div className={styles.progressTrack}>
            <div 
              className={styles.progressFill}
              style={{ 
                width: `${stats.goalProgress}%`,
                background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
              }}
            />
          </div>
        </div>

        <div className={styles.progressItem}>
          <div className={styles.progressLabel}>
            <span>Прогрес підцілей</span>
            <span>{Math.round(stats.subGoalProgress)}%</span>
          </div>
          <div className={styles.progressTrack}>
            <div 
              className={styles.progressFill}
              style={{ 
                width: `${stats.subGoalProgress}%`,
                background: 'linear-gradient(90deg, #7c3aed, #ec4899)',
              }}
            />
          </div>
        </div>

        <div className={styles.progressItem}>
          <div className={styles.progressLabel}>
            <span>Прогрес тренувань</span>
            <span>{Math.round(stats.sessionProgress)}%</span>
          </div>
          <div className={styles.progressTrack}>
            <div 
              className={styles.progressFill}
              style={{ 
                width: `${stats.sessionProgress}%`,
                background: 'linear-gradient(90deg, #ec4899, #f59e0b)',
              }}
            />
          </div>
        </div>
      </div>

      <div className={styles.goalsTimeline}>
        <h5 className={styles.timelineTitle}>⏳ Хронологія цілей</h5>
        <div className={styles.timeline}>
          {goals.sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()).map((goal, index) => {
            const progress = goal.subGoals.length > 0 
              ? (goal.subGoals.filter(sg => sg.completed).length / goal.subGoals.length) * 100 
              : 0;
            
            return (
              <div key={goal.id} className={styles.timelineItem}>
                <div className={styles.timelineDot}>
                  <span className={styles.timelineNumber}>{index + 1}</span>
                </div>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineHeader}>
                    <span className={styles.timelineTitle}>{goal.title}</span>
                    <span className={styles.timelineDate}>
                      {new Date(goal.targetDate).toLocaleDateString('uk-UA')}
                    </span>
                  </div>
                  <div className={styles.timelineProgress}>
                    <div 
                      className={styles.timelineFill}
                      style={{ 
                        width: `${progress}%`,
                        background: goal.completed ? '#22c55e' : '#2563eb',
                      }}
                    />
                  </div>
                  <div className={styles.timelineStats}>
                    <span>{goal.subGoals.filter(sg => sg.completed).length}/{goal.subGoals.length} підцілей</span>
                    <span>{goal.completed ? '✅ Виконано' : `⏳ ${Math.round(progress)}%`}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}