'use client';

import Link from 'next/link';
import { Theory } from '@/types';
import styles from './TheoryCard.module.css';

interface TheoryCardProps {
  theory: Theory;
  onEdit: (theory: Theory) => void;
  onDelete: (id: string) => void;
  index: number;
}

const questionLabels = [
  { id: 'question1', label: '0-10 хв', emoji: '👀' },
  { id: 'question2', label: '10-30 хв', emoji: '📐' },
  { id: 'question3', label: '30-45 хв', emoji: '🔄' },
  { id: 'question4', label: '45-60 хв', emoji: '🔧' },
  { id: 'question5', label: '60-75 хв', emoji: '📊' },
  { id: 'question6', label: '75-90 хв', emoji: '🎯' },
];

export default function TheoryCard({ theory, onEdit, onDelete, index }: TheoryCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getTruncatedText = (text: string, maxLength: number = 80) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  return (
    <div 
      className={styles.card}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className={styles.cardHeader}>
        <div className={styles.cardTitleSection}>
          <h3 className={styles.cardTitle}>{theory.title}</h3>
          <span className={styles.cardMatch}>⚽ {theory.match}</span>
        </div>
        <div className={styles.cardActions}>
          <button 
            className={styles.editButton}
            onClick={() => onEdit(theory)}
            aria-label="Редагувати"
          >
            ✏️
          </button>
          <button 
            className={styles.deleteButton}
            onClick={() => onDelete(theory.id)}
            aria-label="Видалити"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          <span className={styles.cardDate}>📅 {formatDate(theory.date)}</span>
          <span className={styles.cardDate}>🕐 {new Date(theory.createdAt).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>

        <div className={styles.questionsGrid}>
          {questionLabels.map((q) => {
            const answer = theory.questions[q.id as keyof typeof theory.questions];
            if (!answer) return null;
            return (
              <div key={q.id} className={styles.questionItem}>
                <div className={styles.questionLabel}>
                  <span>{q.emoji}</span>
                  <span>{q.label}</span>
                </div>
                <p className={styles.questionAnswer}>{getTruncatedText(answer)}</p>
              </div>
            );
          })}
        </div>
      </div>

      <Link href={`/theory/${theory.id}`} className={styles.cardFooter}>
        <span className={styles.fullAnswer}>📖 Переглянути повний аналіз →</span>
      </Link>
    </div>
  );
}