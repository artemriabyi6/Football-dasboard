// app/planner/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import PlannerCalendar from '@/components/planner/PlannerCalendar';
import PlannerDay from '@/components/planner/PlannerDay';
import EventForm from '@/components/planner/EventForm';
import { TrainingEvent, FocusArea } from '@/types';
import styles from './page.module.css';

export default function PlannerPage() {
  const [events, setEvents] = useState<TrainingEvent[]>([]);
  const [areas, setAreas] = useState<FocusArea[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return today.getMonth();
  });
  const [currentYear, setCurrentYear] = useState(() => {
    const today = new Date();
    return today.getFullYear();
  });
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TrainingEvent | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'day'>('month');

  // Завантаження даних
  useEffect(() => {
    const savedEvents = localStorage.getItem('plannerEvents');
    if (savedEvents) {
      try {
        setEvents(JSON.parse(savedEvents));
      } catch {
        setEvents([]);
      }
    }

    const savedAreas = localStorage.getItem('focusAreas');
    if (savedAreas) {
      try {
        setAreas(JSON.parse(savedAreas));
      } catch {
        setAreas([]);
      }
    }
  }, []);

  // Збереження даних
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem('plannerEvents', JSON.stringify(events));
    } else {
      localStorage.removeItem('plannerEvents');
    }
  }, [events]);

  // Фільтруємо події для вибраної дати
  const selectedDateEvents = useMemo(() => {
    return events.filter(event => event.startTime.startsWith(selectedDate));
  }, [events, selectedDate]);

  // Події за місяць для календаря
  const monthEvents = useMemo(() => {
    const monthStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    return events.filter(event => event.startTime.startsWith(monthStr));
  }, [events, currentMonth, currentYear]);

  const getAreaColor = (areaId?: string) => {
    if (!areaId) return '#6b7280';
    const area = areas.find(a => a.id === areaId);
    return area?.color || '#6b7280';
  };

  const getAreaName = (areaId?: string) => {
    if (!areaId) return 'Без напрямку';
    const area = areas.find(a => a.id === areaId);
    return area?.name || 'Без напрямку';
  };

  const addEvent = (eventData: Omit<TrainingEvent, 'id' | 'createdAt'>) => {
    const newEvent: TrainingEvent = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setEvents([...events, newEvent]);
    setShowEventForm(false);
  };

  const updateEvent = (id: string, eventData: Partial<TrainingEvent>) => {
    setEvents(events.map(event => 
      event.id === id 
        ? { ...event, ...eventData, updatedAt: new Date().toISOString() }
        : event
    ));
    setEditingEvent(null);
    setShowEventForm(false);
  };

  const deleteEvent = (id: string) => {
    if (confirm('Ви впевнені, що хочете видалити це тренування?')) {
      setEvents(events.filter(event => event.id !== id));
    }
  };

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setViewMode('day');
  };

  const handleMonthChange = (month: number, year: number) => {
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  const handleTodayClick = () => {
    const today = new Date();
    setSelectedDate(today.toISOString().split('T')[0]);
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setViewMode('month');
  };

  const handleEventClick = (event: TrainingEvent) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>📅 Планер</h1>
            <p className={styles.subtitle}>Плануй свої тренування та матчі</p>
          </div>
          <div className={styles.headerActions}>
            <button 
              className={styles.todayButton}
              onClick={handleTodayClick}
            >
              Сьогодні
            </button>
            <button 
              className={styles.addButton}
              onClick={() => {
                setEditingEvent(null);
                setShowEventForm(true);
              }}
            >
              + Додати тренування
            </button>
          </div>
        </div>

        <div className={styles.viewToggle}>
          <button 
            className={`${styles.viewButton} ${viewMode === 'month' ? styles.active : ''}`}
            onClick={() => setViewMode('month')}
          >
            Місяць
          </button>
          <button 
            className={`${styles.viewButton} ${viewMode === 'day' ? styles.active : ''}`}
            onClick={() => setViewMode('day')}
          >
            День
          </button>
        </div>

        <div className={styles.plannerContainer}>
          {viewMode === 'month' ? (
            <PlannerCalendar
              year={currentYear}
              month={currentMonth}
              events={monthEvents}
              selectedDate={selectedDate}
              onDateClick={handleDateClick}
              onMonthChange={handleMonthChange}
              getAreaColor={getAreaColor}
            />
          ) : (
            <PlannerDay
              date={selectedDate}
              events={selectedDateEvents}
              onEditEvent={handleEventClick}
              onDeleteEvent={deleteEvent}
              getAreaColor={getAreaColor}
              getAreaName={getAreaName}
              onAddEvent={() => {
                setEditingEvent(null);
                setShowEventForm(true);
              }}
            />
          )}
        </div>

        {showEventForm && (
          <div className={styles.modalOverlay} onClick={() => {
            setShowEventForm(false);
            setEditingEvent(null);
          }}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <EventForm
                areas={areas}
                initialDate={selectedDate}
                event={editingEvent || undefined}
                onSubmit={editingEvent ? 
                  (data) => updateEvent(editingEvent.id, data) : 
                  addEvent
                }
                onCancel={() => {
                  setShowEventForm(false);
                  setEditingEvent(null);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}