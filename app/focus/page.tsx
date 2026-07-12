// app/focus/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { FocusArea, FocusDay } from '@/types';
import { useGoals } from '@/context/GoalsContext';
import FocusAreaManager from '@/components/FocusAreaManager';
import FocusCalendar from '@/components/FocusCalendar';
import StatisticsCharts from '@/components/StatisticsCharts';
import GoalManager from '@/components/GoalManager';
import GoalVisualization from '@/components/GoalVisualization';
import Footer from '@/components/Footer';
import styles from './page.module.css';

export default function FocusPage() {
  const [areas, setAreas] = useState<FocusArea[]>([]);
  const [focusDays, setFocusDays] = useState<FocusDay[]>([]);
  const { goals } = useGoals();

  // Завантаження даних з localStorage
  useEffect(() => {
    const savedAreas = localStorage.getItem('focusAreas');
    if (savedAreas) {
      try {
        setAreas(JSON.parse(savedAreas));
      } catch {
        setAreas([]);
      }
    }

    const savedDays = localStorage.getItem('focusDays');
    if (savedDays) {
      try {
        setFocusDays(JSON.parse(savedDays));
      } catch {
        setFocusDays([]);
      }
    }
  }, []);

  // Збереження даних
  useEffect(() => {
    if (areas.length > 0) {
      localStorage.setItem('focusAreas', JSON.stringify(areas));
    } else {
      localStorage.removeItem('focusAreas');
    }
  }, [areas]);

  useEffect(() => {
    if (focusDays.length > 0) {
      localStorage.setItem('focusDays', JSON.stringify(focusDays));
    } else {
      localStorage.removeItem('focusDays');
    }
  }, [focusDays]);

  // Додати напрямок
  const addArea = (name: string, color: string) => {
    if (areas.length >= 5) return;
    const newArea: FocusArea = {
      id: Date.now().toString(),
      name,
      color,
      createdAt: new Date().toISOString(),
    };
    setAreas([...areas, newArea]);
  };

  // Редагувати напрямок
  const editArea = (id: string, name: string, color: string) => {
    setAreas(areas.map(a => 
      a.id === id ? { ...a, name, color } : a
    ));
  };

  // Видалити напрямок
  const deleteArea = (id: string) => {
    if (!confirm(`Ви впевнені, що хочете видалити цей напрямок?`)) return;
    setAreas(areas.filter(a => a.id !== id));
    setFocusDays(focusDays.map(day => ({
      ...day,
      areaIds: day.areaIds.filter(areaId => areaId !== id)
    })).filter(day => day.areaIds.length > 0));
  };

  // Переключити день
  const toggleDay = (date: string, areaId: string) => {
    const existingDay = focusDays.find(d => d.date === date);
    
    if (existingDay) {
      if (existingDay.areaIds.includes(areaId)) {
        const newAreaIds = existingDay.areaIds.filter(id => id !== areaId);
        if (newAreaIds.length === 0) {
          setFocusDays(focusDays.filter(d => d.date !== date));
        } else {
          setFocusDays(focusDays.map(d => 
            d.date === date ? { ...d, areaIds: newAreaIds } : d
          ));
        }
      } else {
        setFocusDays(focusDays.map(d => 
          d.date === date ? { ...d, areaIds: [...d.areaIds, areaId] } : d
        ));
      }
    } else {
      setFocusDays([...focusDays, { date, areaIds: [areaId] }]);
    }
  };

  const totalSessions = focusDays.reduce((sum, day) => sum + day.areaIds.length, 0);
  const totalDays = focusDays.length;

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>🎯 Фокус</h1>
            <p className={styles.subtitle}>
              Обери до 5 напрямків розвитку та відстежуй свій прогрес
            </p>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.areaSection}>
            <FocusAreaManager
              areas={areas}
              onAdd={addArea}
              onEdit={editArea}
              onDelete={deleteArea}
            />
          </div>

          <div className={styles.calendarSection}>
            <FocusCalendar
              areas={areas}
              focusDays={focusDays}
              onToggleDay={toggleDay}
            />
          </div>
        </div>

        {areas.length === 0 && (
          <div className={styles.emptyState}>
            <p>👋 Додайте свої напрямки розвитку, щоб почати відстежувати прогрес</p>
          </div>
        )}

        {areas.length > 0 && (
          <div className={styles.goalsSection}>
            <GoalManager 
              areas={areas} 
              focusDays={focusDays}
            />
          </div>
        )}

        {goals.length > 0 && (
          <div className={styles.visualizationSection}>
            <GoalVisualization goals={goals} />
          </div>
        )}

        {areas.length > 0 && (
          <div className={styles.statsSection}>
            <StatisticsCharts areas={areas} focusDays={focusDays} />
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}