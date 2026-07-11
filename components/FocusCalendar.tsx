// components/FocusCalendar.tsx
'use client';

import { useState, useEffect } from 'react';
import { FocusArea, FocusDay } from '@/types';
import styles from './FocusCalendar.module.css';

interface FocusCalendarProps {
  areas: FocusArea[];
  focusDays: FocusDay[];
  onToggleDay: (date: string, areaId: string) => void;
}

export default function FocusCalendar({ areas, focusDays, onToggleDay }: FocusCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const getToday = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const isToday = (date: string) => {
    return date === getToday();
  };

  const getDayFocus = (date: string) => {
    const day = focusDays.find(d => d.date === date);
    if (!day) return null;
    return day.areaIds.map(id => areas.find(a => a.id === id)).filter(Boolean);
  };

  const handleDayClick = (date: string) => {
    if (selectedDate === date) {
      setSelectedDate(null);
    } else {
      setSelectedDate(date);
    }
  };

  const handleToggleArea = (areaId: string) => {
    if (selectedDate) {
      onToggleDay(selectedDate, areaId);
    }
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];
    const today = getToday();

    // Пусті клітинки для першого тижня
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className={styles.emptyDay} />);
    }

    // Дні місяця
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayFocus = getDayFocus(dateStr);
      const isTodayDate = isToday(dateStr);
      const isSelected = selectedDate === dateStr;

      days.push(
        <div
          key={dateStr}
          className={`${styles.day} ${isTodayDate ? styles.today : ''} ${isSelected ? styles.selected : ''}`}
          onClick={() => handleDayClick(dateStr)}
        >
          <span className={styles.dayNumber}>{day}</span>
          {dayFocus && dayFocus.length > 0 && (
            <div className={styles.dayColors}>
              {dayFocus.map((area) => (
                <span
                  key={area!.id}
                  className={styles.dayColorDot}
                  style={{ background: area!.color }}
                  title={area!.name}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const changeMonth = (delta: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
    setSelectedDate(null);
  };

  const monthNames = [
    'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
    'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
  ];

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

  const dayFocus = selectedDate ? getDayFocus(selectedDate) : null;

  return (
    <div className={styles.container}>
      <div className={styles.calendar}>
        <div className={styles.header}>
          <button onClick={() => changeMonth(-1)} className={styles.navButton}>
            ‹
          </button>
          <h3 className={styles.monthTitle}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button onClick={() => changeMonth(1)} className={styles.navButton}>
            ›
          </button>
        </div>

        <div className={styles.weekDays}>
          {weekDays.map((day) => (
            <div key={day} className={styles.weekDay}>
              {day}
            </div>
          ))}
        </div>

        <div className={styles.daysGrid}>
          {renderCalendar()}
        </div>
      </div>

      {selectedDate && (
        <div className={styles.selectedDayInfo}>
          <h4 className={styles.selectedDate}>
            {new Date(selectedDate).toLocaleDateString('uk-UA', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })}
          </h4>
          <div className={styles.selectedDayAreas}>
            <p className={styles.selectedDayLabel}>Напрямки розвитку:</p>
            {areas.length === 0 ? (
              <p className={styles.noAreas}>Додайте напрямки розвитку</p>
            ) : (
              <div className={styles.areaToggleList}>
                {areas.map((area) => {
                  const isActive = dayFocus?.some(a => a?.id === area.id) || false;
                  return (
                    <button
                      key={area.id}
                      className={`${styles.areaToggle} ${isActive ? styles.active : ''}`}
                      style={{
                        borderColor: isActive ? area.color : '#e5e7eb',
                        background: isActive ? area.color + '20' : 'transparent',
                      }}
                      onClick={() => handleToggleArea(area.id)}
                    >
                      <span 
                        className={styles.toggleDot}
                        style={{ background: area.color }}
                      />
                      <span className={styles.toggleName}>{area.name}</span>
                      {isActive && <span className={styles.toggleCheck}>✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}