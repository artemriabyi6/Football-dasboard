// components/planner/PlannerDay.tsx
'use client';

import { TrainingEvent } from '@/types';
import styles from './PlannerDay.module.css';

interface PlannerDayProps {
  date: string;
  events: TrainingEvent[];
  onEditEvent: (event: TrainingEvent) => void;
  onDeleteEvent: (id: string) => void;
  getAreaColor: (areaId?: string) => string;
  getAreaName: (areaId?: string) => string;
  onAddEvent: () => void;
}

export default function PlannerDay({
  date,
  events,
  onEditEvent,
  onDeleteEvent,
  getAreaColor,
  getAreaName,
  onAddEvent,
}: PlannerDayProps) {
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('uk-UA', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'training': return '🏃';
      case 'match': return '⚽';
      case 'rest': return '🧘';
      default: return '📌';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'training': return 'Тренування';
      case 'match': return 'Матч';
      case 'rest': return 'Відпочинок';
      default: return 'Інше';
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('uk-UA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventDuration = (event: TrainingEvent) => {
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    if (diffHrs > 0) {
      return `${diffHrs}г ${diffMins}хв`;
    }
    return `${diffMins}хв`;
  };

  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  const isToday = () => {
    const today = new Date();
    return date === today.toISOString().split('T')[0];
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.date}>
          {formatDate(date)}
          {isToday() && <span className={styles.todayBadge}>Сьогодні</span>}
        </h3>
      </div>

      {sortedEvents.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📭</div>
          <p className={styles.emptyTitle}>Немає тренувань на цей день</p>
          <p className={styles.emptySubtext}>Додайте тренування, щоб розпочати планування</p>
          <button className={styles.emptyButton} onClick={onAddEvent}>
            + Додати тренування
          </button>
        </div>
      ) : (
        <div className={styles.eventsList}>
          {sortedEvents.map(event => (
            <div 
              key={event.id} 
              className={styles.eventCard}
              style={{ borderLeftColor: getAreaColor(event.areaId) }}
            >
              <div className={styles.eventTime}>
                <span className={styles.eventStartTime}>{formatTime(event.startTime)}</span>
                <span className={styles.eventEndTime}>{formatTime(event.endTime)}</span>
                <span className={styles.eventDuration}>{getEventDuration(event)}</span>
              </div>

              <div className={styles.eventContent}>
                <div className={styles.eventHeader}>
                  <div className={styles.eventTitleRow}>
                    <span className={styles.eventTypeIcon}>{getTypeIcon(event.type)}</span>
                    <h4 className={styles.eventTitle}>{event.title}</h4>
                  </div>
                  <div className={styles.eventActions}>
                    <button 
                      className={styles.editButton}
                      onClick={() => onEditEvent(event)}
                      aria-label="Редагувати"
                    >
                      ✏️
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => onDeleteEvent(event.id)}
                      aria-label="Видалити"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {event.description && (
                  <p className={styles.eventDescription}>{event.description}</p>
                )}

                <div className={styles.eventMeta}>
                  <span className={styles.eventType}>
                    <span 
                      className={styles.eventTypeDot}
                      style={{ background: getAreaColor(event.areaId) }}
                    />
                    {getTypeLabel(event.type)}
                  </span>
                  {event.areaId && (
                    <span className={styles.eventArea}>
                      🎯 {getAreaName(event.areaId)}
                    </span>
                  )}
                  {event.location && (
                    <span className={styles.eventLocation}>
                      📍 {event.location}
                    </span>
                  )}
                </div>

                {event.completed && (
                  <span className={styles.completedBadge}>✅ Виконано</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}