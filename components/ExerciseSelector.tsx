// components/ExerciseSelector.tsx
'use client';

import { useState } from 'react';
import { exercisesData } from '@/data/exercises';
import styles from './ExerciseSelector.module.css';

interface ExerciseSelectorProps {
  selectedIds: string[];
  onToggle: (exerciseId: string) => void;
  areaIds?: string[]; // Фільтр за напрямками
}

export default function ExerciseSelector({ 
  selectedIds, 
  onToggle,
  areaIds = [] 
}: ExerciseSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Отримуємо всі вправи з усіх категорій
  const allExercises = Object.entries(exercisesData).flatMap(([category, exercises]) =>
    exercises.map(ex => ({ ...ex, category }))
  );

  // Фільтруємо за напрямками (якщо вибрані)
  const filteredByArea = areaIds.length > 0
    ? allExercises.filter(ex => {
        // Перевіряємо чи категорія вправи відповідає вибраним напрямкам
        const categoryMap: Record<string, string[]> = {
          'finishing': ['finishing'],
          'passing': ['passing'],
          'dribbling': ['dribbling'],
          'ball-control': ['ball-control'],
          'heading': ['heading'],
          'defending': ['defending'],
          'goalkeeping': ['goalkeeping'],
          'tactics': ['tactics'],
        };
        return areaIds.some(areaId => 
          categoryMap[ex.category]?.includes(areaId) || 
          areaId === ex.category
        );
      })
    : allExercises;

  // Фільтруємо за пошуком та категорією
  const filteredExercises = filteredByArea.filter(ex => {
    const matchesSearch = ex.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ex.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ex.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Отримуємо унікальні категорії для фільтра
  const categories = ['all', ...new Set(filteredByArea.map(ex => ex.category))];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h4 className={styles.title}>🏋️ Вправи для підцілі</h4>
        <span className={styles.count}>
          Вибрано: {selectedIds.length}
        </span>
      </div>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="🔍 Пошук вправ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={styles.categoryFilter}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'Всі категорії' : cat}
            </option>
          ))}
        </select>
      </div>

      {filteredExercises.length === 0 ? (
        <p className={styles.noExercises}>
          {areaIds.length > 0 
            ? 'Немає вправ для вибраних напрямків' 
            : 'Немає вправ у цій категорії'}
        </p>
      ) : (
        <div className={styles.exerciseList}>
          {filteredExercises.map(exercise => {
            const isSelected = selectedIds.includes(exercise.id.toString());
            return (
              <button
                key={exercise.id}
                className={`${styles.exerciseItem} ${isSelected ? styles.selected : ''}`}
                onClick={() => onToggle(exercise.id.toString())}
              >
                <div className={styles.exerciseInfo}>
                  <span className={styles.exerciseTitle}>{exercise.title}</span>
                  <span className={styles.exerciseCategory}>{exercise.category}</span>
                </div>
                <div className={styles.exerciseMeta}>
                  <span className={styles.exerciseDuration}>⏱️ {exercise.duration}</span>
                  <span className={styles.exerciseLevel}>⭐ {exercise.level}</span>
                  {isSelected && (
                    <span className={styles.checkmark}>✓</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}