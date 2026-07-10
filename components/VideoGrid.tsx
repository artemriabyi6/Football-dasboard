'use client';

import { useState, useEffect } from 'react';
import { Exercise } from '@/types';
import VideoPlayer from './VideoPlayer';
import styles from './VideoGrid.module.css';

interface VideoGridProps {
  exercises: Exercise[];
}

export default function VideoGrid({ exercises }: VideoGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  const totalPages = Math.max(1, Math.ceil(exercises.length / itemsPerPage));
  
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, exercises.length);
  const currentExercises = exercises.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (exercises.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Вправи відсутні</p>
      </div>
    );
  }

  // Функція для рендерингу картки
  const renderCard = (exercise: Exercise, index: number) => (
    <div 
      key={exercise.id} 
      className={styles.card}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className={styles.videoWrapper}>
        {exercise.videoUrl ? (
          <VideoPlayer 
            videoUrl={exercise.videoUrl}
            title={exercise.title}
            thumbnail={exercise.thumbnail}
          />
        ) : (
          <div className={styles.videoOverlay}>
            <div className={styles.playButton}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        )}
        <div className={styles.duration}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '4px' }}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-.5-13v4l-2.5 1.5.5.83 3-1.8V7h-1z"/>
          </svg>
          {exercise.duration}
        </div>
        <div className={styles.levelBadge}>
          {exercise.level}
        </div>
      </div>
      
      <div className={styles.info}>
        <h3 className={styles.title}>{exercise.title}</h3>
        <p className={styles.description}>{exercise.description}</p>
        <div className={styles.meta}>
          <span>{exercise.sets} підходи</span>
          <span className={styles.metaSeparator}>•</span>
          <span>⭐ {exercise.level}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className={styles.header}>
        <h2 className={styles.title}>{exercises[0]?.category || 'Вправи'}</h2>
        <span className={styles.count}>
          {exercises.length} вправ {exercises.length > itemsPerPage && `• Сторінка ${currentPage} з ${totalPages}`}
        </span>
      </div>
      
      <div className={styles.grid}>
        {currentExercises.map((exercise, index) => renderCard(exercise, index))}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.pageButton}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            Назад
          </button>
          
          <div className={styles.pageNumbers}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`${styles.pageNumber} ${currentPage === page ? styles.activePage : ''}`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={styles.pageButton}
          >
            Вперед
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}