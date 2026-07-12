// components/planner/PlannerCalendar.tsx
'use client';

import { TrainingEvent } from '@/types';
import styles from './PlannerCalendar.module.css';

interface PlannerCalendarProps {
  year: number;
  month: number;
  events: TrainingEvent[];
  selectedDate: string;
  onDateClick: (date: string) => void;
  onMonthChange: (month: number, year: number) => void;
  getAreaColor: (areaId?: string) => string;
}

export default function PlannerCalendar({
  year,
  month,
  events,
  selectedDate,
  onDateClick,
  onMonthChange,
  getAreaColor,
}: PlannerCalendarProps) {
  const monthNames = [
    'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
    'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
  ];

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Перетворюємо для початку з понеділка
  };

  const getEventsForDate = (dateStr: string) => {
    return events.filter(event => event.startTime.startsWith(dateStr));
  };

  const daysInMonth = getDaysInMonth(month, year);
  const firstDay = getFirstDayOfMonth(month, year);

  const handlePrevMonth = () => {
    if (month === 0) {
      onMonthChange(11, year - 1);
    } else {
      onMonthChange(month - 1, year);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      onMonthChange(0, year + 1);
    } else {
      onMonthChange(month + 1, year);
    }
  };

  const isToday = (dateStr: string) => {
    const today = new Date();
    return dateStr === today.toISOString().split('T')[0];
  };

  const isSelected = (dateStr: string) => {
    return dateStr === selectedDate;
  };

  const renderDays = () => {
    const days = [];
    const today = new Date();

    // Пусті дні до початку місяця
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className={styles.emptyDay} />);
    }

    // Дні місяця
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = getEventsForDate(dateStr);
      const isTodayDate = isToday(dateStr);
      const isSelectedDate = isSelected(dateStr);

      days.push(
        <div
          key={dateStr}
          className={`${styles.day} ${isTodayDate ? styles.today : ''} ${isSelectedDate ? styles.selected : ''}`}
          onClick={() => onDateClick(dateStr)}
        >
          <span className={styles.dayNumber}>{day}</span>
          {dayEvents.length > 0 && (
            <div className={styles.dayEvents}>
              {dayEvents.slice(0, 3).map((event, index) => (
                <div
                  key={event.id}
                  className={styles.dayEventDot}
                  style={{ background: getAreaColor(event.areaId) }}
                  title={event.title}
                />
              ))}
              {dayEvents.length > 3 && (
                <span className={styles.moreEvents}>+{dayEvents.length - 3}</span>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.navButton} onClick={handlePrevMonth}>
          ‹
        </button>
        <h2 className={styles.title}>
          {monthNames[month]} {year}
        </h2>
        <button className={styles.navButton} onClick={handleNextMonth}>
          ›
        </button>
      </div>

      <div className={styles.weekDays}>
        {weekDays.map(day => (
          <div key={day} className={styles.weekDay}>
            {day}
          </div>
        ))}
      </div>

      <div className={styles.daysGrid}>
        {renderDays()}
      </div>

      <div className={styles.legend}>
        <span className={styles.legendTitle}>Маркери:</span>
        <div className={styles.legendItems}>
          <span className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#2563eb' }} />
            Тренування
          </span>
          <span className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#dc2626' }} />
            Матч
          </span>
          <span className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#16a34a' }} />
            Відпочинок
          </span>
          <span className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#7c3aed' }} />
            Інше
          </span>
        </div>
      </div>
    </div>
  );
}