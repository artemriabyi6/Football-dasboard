// app/theory/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Theory } from '@/types';
import styles from './page.module.css';

const questionLabels = [
  { id: 'question1', label: '0-10 хв', emoji: '👀', title: 'LET THE GAME PLAY' },
  { id: 'question2', label: '10-30 хв', emoji: '📐', title: 'IDENTIFY THE STRUCTURES' },
  { id: 'question3', label: '30-45 хв', emoji: '🔄', title: 'FIND THE REPEATED PATTERNS' },
  { id: 'question4', label: '45-60 хв', emoji: '🔧', title: 'CHECK THE ADJUSTMENTS' },
  { id: 'question5', label: '60-75 хв', emoji: '📊', title: 'READ THE GAME STATE' },
  { id: 'question6', label: '75-90 хв', emoji: '🎯', title: 'DID THE PLAN WORK?' },
];

export default function TheoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [theory, setTheory] = useState<Theory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Отримуємо дані з localStorage
    const saved = localStorage.getItem('theories');
    if (saved) {
      try {
        const theories = JSON.parse(saved);
        const found = theories.find((t: Theory) => t.id === params.id);
        setTheory(found || null);
      } catch {
        setTheory(null);
      }
    }
    setLoading(false);
  }, [params.id]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('uk-UA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Завантаження...</div>
      </div>
    );
  }

  if (!theory) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h2>Аналіз не знайдено</h2>
          <Link href="/theory" className={styles.backLink}>← Повернутися до списку</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/theory" className={styles.backButton}>
          ← Назад до списку
        </Link>
        <div className={styles.headerActions}>
          {/* <Link href={`/theory/${theory.id}/edit`} className={styles.editButton}>
            ✏️ Редагувати
          </Link> */}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.paper}>
          <div className={styles.paperHeader}>
            <h1 className={styles.title}>{theory.title}</h1>
            <div className={styles.meta}>
              <span className={styles.match}>⚽ {theory.match}</span>
              <span className={styles.date}>📅 {formatDate(theory.date)}</span>
              <span className={styles.time}>🕐 {formatTime(theory.createdAt)}</span>
            </div>
          </div>

          <div className={styles.questions}>
            {questionLabels.map((q) => {
              const answer = theory.questions[q.id as keyof typeof theory.questions];
              if (!answer) return null;
              return (
                <div key={q.id} className={styles.questionBlock}>
                  <div className={styles.questionHeader}>
                    <span className={styles.questionEmoji}>{q.emoji}</span>
                    <div>
                      <span className={styles.questionLabel}>{q.label}</span>
                      <span className={styles.questionTitle}>{q.title}</span>
                    </div>
                  </div>
                  <p className={styles.questionAnswer}>{answer}</p>
                </div>
              );
            })}
          </div>

          <div className={styles.paperFooter}>
            <span>Створено: {formatDate(theory.createdAt)} о {formatTime(theory.createdAt)}</span>
            {theory.updatedAt && (
              <span>• Оновлено: {formatDate(theory.updatedAt)} о {formatTime(theory.updatedAt)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}