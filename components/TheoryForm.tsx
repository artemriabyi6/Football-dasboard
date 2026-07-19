// components/TheoryForm.tsx
'use client';

import { useState } from 'react';
import { Theory } from '@/types';
import styles from './TheoryForm.module.css';

interface TheoryFormProps {
  onSubmit: (data: any) => void;
  initialData?: Theory;
  onCancel: () => void;
}

const questionLabels = [
  { id: 'question1', label: '0-10 хв', description: 'LET THE GAME PLAY - Що відбувається на полі?' },
  { id: 'question2', label: '10-30 хв', description: 'IDENTIFY THE STRUCTURES - Які структури команд?' },
  { id: 'question3', label: '30-45 хв', description: 'FIND THE REPEATED PATTERNS - Які патерни повторюються?' },
  { id: 'question4', label: '45-60 хв', description: 'CHECK THE ADJUSTMENTS - Що змінилося після перерви?' },
  { id: 'question5', label: '60-75 хв', description: 'READ THE GAME STATE - Який стан гри?' },
  { id: 'question6', label: '75-90 хв', description: 'DID THE PLAN WORK? - Чи спрацював план?' },
];

export default function TheoryForm({ onSubmit, initialData, onCancel }: TheoryFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    match: initialData?.match || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    personalAnalysis: initialData?.personalAnalysis || '',
    questions: {
      question1: initialData?.questions?.question1 || '',
      question2: initialData?.questions?.question2 || '',
      question3: initialData?.questions?.question3 || '',
      question4: initialData?.questions?.question4 || '',
      question5: initialData?.questions?.question5 || '',
      question6: initialData?.questions?.question6 || '',
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <h3>{initialData ? 'Редагувати аналіз' : 'Новий аналіз матчу'}</h3>
        <button type="button" className={styles.closeButton} onClick={onCancel}>
          ✕
        </button>
      </div>

      <div className={styles.fields}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Назва аналізу</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Наприклад: Аналіз матчу Динамо - Шахтар"
              required
            />
          </div>
          <div className={styles.field}>
            <label>Матч</label>
            <input
              type="text"
              value={formData.match}
              onChange={(e) => setFormData({ ...formData, match: e.target.value })}
              placeholder="Динамо Київ - Шахтар Донецьк"
              required
            />
          </div>
          <div className={styles.field}>
            <label>Дата</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
        </div>

        {questionLabels.map((q) => (
          <div key={q.id} className={styles.questionField}>
            <div className={styles.questionHeader}>
              <span className={styles.questionLabel}>{q.label}</span>
              <span className={styles.questionDescription}>{q.description}</span>
            </div>
            <textarea
              value={formData.questions[q.id as keyof typeof formData.questions]}
              onChange={(e) => setFormData({
                ...formData,
                questions: { ...formData.questions, [q.id]: e.target.value }
              })}
              placeholder="Введіть ваш аналіз..."
              rows={3}
              required
            />
          </div>
        ))}

        {/* Додаємо поле для аналізу власних дій */}
        <div className={styles.personalAnalysisField}>
          <div className={styles.personalAnalysisHeader}>
            <span className={styles.personalAnalysisLabel}>👤 Аналіз власних дій</span>
            <span className={styles.personalAnalysisDescription}>
              Оцініть свої дії на полі, що вдалося, а над чим потрібно працювати
            </span>
          </div>
          <textarea
            value={formData.personalAnalysis}
            onChange={(e) => setFormData({ ...formData, personalAnalysis: e.target.value })}
            placeholder="Наприклад: Добре працював у відборі, але потрібно покращити перший дотик..."
            rows={4}
            className={styles.personalAnalysisTextarea}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.cancelButton} onClick={onCancel}>
          Скасувати
        </button>
        <button type="submit" className={styles.submitButton}>
          {initialData ? '💾 Зберегти зміни' : '➕ Додати аналіз'}
        </button>
      </div>
    </form>
  );
}