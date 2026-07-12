// components/planner/EventForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { TrainingEvent, FocusArea } from '@/types';
import styles from './EventForm.module.css';

interface EventFormProps {
  areas: FocusArea[];
  initialDate: string;
  event?: TrainingEvent;
  onSubmit: (data: Omit<TrainingEvent, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const eventTypes = [
  { value: 'training', label: '🏃 Тренування' },
  { value: 'match', label: '⚽ Матч' },
  { value: 'rest', label: '🧘 Відпочинок' },
  { value: 'other', label: '📌 Інше' },
];

export default function EventForm({
  areas,
  initialDate,
  event,
  onSubmit,
  onCancel,
}: EventFormProps) {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    startTime: event?.startTime || `${initialDate}T09:00`,
    endTime: event?.endTime || `${initialDate}T10:00`,
    areaId: event?.areaId || '',
    type: event?.type || 'training' as TrainingEvent['type'],
    location: event?.location || '',
    completed: event?.completed || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const setStartTime = (value: string) => {
    setFormData(prev => ({ ...prev, startTime: value }));
    // Автоматично встановлюємо час закінчення на 1 годину пізніше
    if (!event) {
      const start = new Date(value);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      setFormData(prev => ({ 
        ...prev, 
        startTime: value,
        endTime: end.toISOString().slice(0, 16)
      }));
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <h3>{event ? '✏️ Редагувати тренування' : '➕ Нове тренування'}</h3>
        <button type="button" className={styles.closeButton} onClick={onCancel}>
          ✕
        </button>
      </div>

      <div className={styles.fields}>
        <div className={styles.field}>
          <label>Назва *</label>
          <input
            type="text"
            placeholder="Наприклад: Тренування дриблінгу"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label>Тип *</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as TrainingEvent['type'] })}
            className={styles.select}
            required
          >
            {eventTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label>Початок *</label>
            <input
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.field}>
            <label>Кінець *</label>
            <input
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className={styles.input}
              required
            />
          </div>
        </div>

        <div className={styles.field}>
          <label>Напрямок (опціонально)</label>
          <select
            value={formData.areaId}
            onChange={(e) => setFormData({ ...formData, areaId: e.target.value })}
            className={styles.select}
          >
            <option value="">Без напрямку</option>
            {areas.map(area => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
          {areas.length === 0 && (
            <p className={styles.hint}>Створіть напрямки на сторінці "Фокус"</p>
          )}
        </div>

        <div className={styles.field}>
          <label>Опис (опціонально)</label>
          <textarea
            placeholder="Опишіть тренування..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={styles.textarea}
            rows={3}
          />
        </div>

        <div className={styles.field}>
          <label>Місце (опціонально)</label>
          <input
            type="text"
            placeholder="Стадіон, зал, майданчик..."
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={formData.completed}
              onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
              className={styles.checkbox}
            />
            <span>Тренування виконано</span>
          </label>
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.cancelButton} onClick={onCancel}>
          Скасувати
        </button>
        <button type="submit" className={styles.submitButton}>
          {event ? '💾 Зберегти зміни' : '➕ Додати тренування'}
        </button>
      </div>
    </form>
  );
}