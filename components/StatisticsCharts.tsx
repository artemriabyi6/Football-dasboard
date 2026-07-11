// components/StatisticsCharts.tsx
'use client';

import { useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler, // Додаємо Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { FocusArea, FocusDay } from '@/types';
import styles from './StatisticsCharts.module.css';

// Реєструємо всі плагіни включаючи Filler
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler // Реєструємо Filler
);



interface StatisticsChartsProps {
  areas: FocusArea[];
  focusDays: FocusDay[];
}

export default function StatisticsCharts({ areas, focusDays }: StatisticsChartsProps) {
  const [activeChart, setActiveChart] = useState<'all' | 'weekly' | 'monthly'>('all');

  // Статистика по напрямках
  const areaStats = useMemo(() => {
    const stats: Record<string, number> = {};
    areas.forEach(area => {
      stats[area.id] = 0;
    });

    focusDays.forEach(day => {
      day.areaIds.forEach(areaId => {
        if (stats[areaId] !== undefined) {
          stats[areaId]++;
        }
      });
    });

    return stats;
  }, [areas, focusDays]);

  // Дані для кругової діаграми (розподіл часу)
  const doughnutData = useMemo(() => {
    const labels = areas.map(a => a.name);
    const data = areas.map(a => areaStats[a.id] || 0);
    const colors = areas.map(a => a.color);
    const total = data.reduce((sum, val) => sum + val, 0);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors.map(c => c + '80'),
          borderColor: colors,
          borderWidth: 2,
        },
      ],
    };
  }, [areas, areaStats]);

  // Дані для стовпчастої діаграми (по днях з кольорами напрямків)
  const barData = useMemo(() => {
    const last30Days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const day = focusDays.find(d => d.date === dateStr);
      
      // Отримуємо напрямки для цього дня
      const dayAreas = day ? day.areaIds.map(id => areas.find(a => a.id === id)).filter(Boolean) : [];
      
      last30Days.push({
        date: dateStr,
        day: date.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' }),
        count: dayAreas.length,
        areas: dayAreas,
        // Визначаємо колір для стовпця
        color: dayAreas.length === 0 ? '#e5e7eb' : dayAreas[0]!.color,
        // Якщо декілька напрямків - робимо градієнт
        gradient: dayAreas.length > 1 ? dayAreas.map(a => a!.color) : undefined,
      });
    }

    return {
      labels: last30Days.map(d => d.day),
      datasets: [
        {
          label: 'Кількість напрямків',
          data: last30Days.map(d => d.count),
          backgroundColor: last30Days.map(d => d.count > 0 ? d.color + '80' : '#e5e7eb'),
          borderColor: last30Days.map(d => d.count > 0 ? d.color : '#d1d5db'),
          borderWidth: 2,
          borderRadius: 4,
        },
      ],
    };
  }, [focusDays, areas]);

  // Дані для лінійної діаграми (прогрес по напрямках)
  const lineData = useMemo(() => {
    const last30Days = [];
    const today = new Date();
    const areaMap: Record<string, { name: string; color: string; data: number[] }> = {};
    
    areas.forEach(area => {
      areaMap[area.id] = {
        name: area.name,
        color: area.color,
        data: [],
      };
    });

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const day = focusDays.find(d => d.date === dateStr);
      
      areas.forEach(area => {
        const count = day ? (day.areaIds.includes(area.id) ? 1 : 0) : 0;
        const prevData = areaMap[area.id].data;
        const prevValue = prevData.length > 0 ? prevData[prevData.length - 1] : 0;
        areaMap[area.id].data.push(prevValue + count);
      });
    }

    return {
      labels: Array.from({ length: 30 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - (29 - i));
        return date.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' });
      }),
      datasets: areas.map(area => ({
        label: area.name,
        data: areaMap[area.id]?.data || [],
        borderColor: area.color,
        backgroundColor: area.color + '20',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: area.color,
      })),
    };
  }, [areas, focusDays]);

  // Отримуємо топ напрямків
  const topAreas = useMemo(() => {
    return [...areas]
      .map(area => ({
        ...area,
        count: areaStats[area.id] || 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [areas, areaStats]);

  const totalSessions = focusDays.reduce((sum, day) => sum + day.areaIds.length, 0);
  const totalDays = focusDays.length;
  const averagePerDay = totalDays > 0 ? (totalSessions / totalDays).toFixed(1) : 0;
  const maxStreak = useMemo(() => {
    if (focusDays.length === 0) return 0;
    const sortedDays = [...focusDays].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    let streak = 1;
    let maxStreak = 1;
    for (let i = 1; i < sortedDays.length; i++) {
      const prevDate = new Date(sortedDays[i-1].date);
      const currDate = new Date(sortedDays[i].date);
      const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        streak++;
        maxStreak = Math.max(maxStreak, streak);
      } else if (diffDays > 1) {
        streak = 1;
      }
    }
    return maxStreak;
  }, [focusDays]);

  if (areas.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>📊 Додайте напрямки розвитку, щоб побачити статистику</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.statsOverview}>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>📚</span>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{areas.length}</span>
            <span className={styles.statLabel}>Напрямків</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>📅</span>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{totalDays}</span>
            <span className={styles.statLabel}>Днів тренувань</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>🏃</span>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{totalSessions}</span>
            <span className={styles.statLabel}>Всього тренувань</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>⚡</span>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{averagePerDay}</span>
            <span className={styles.statLabel}>В середньому за день</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>🔥</span>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{maxStreak}</span>
            <span className={styles.statLabel}>Макс. стрік днів</span>
          </div>
        </div>
      </div>

      {/* Топ напрямків */}
      <div className={styles.topAreas}>
        <h4 className={styles.sectionTitle}>🏆 Топ напрямків</h4>
        <div className={styles.topAreasList}>
          {topAreas.map((area, index) => (
            <div key={area.id} className={styles.topAreaItem}>
              <span className={styles.topAreaRank}>{index + 1}</span>
              <span 
                className={styles.topAreaDot}
                style={{ background: area.color }}
              />
              <span className={styles.topAreaName}>{area.name}</span>
              <span className={styles.topAreaCount}>{area.count} тренувань</span>
              <div className={styles.topAreaBar}>
                <div 
                  className={styles.topAreaFill}
                  style={{ 
                    width: `${(area.count / (topAreas[0]?.count || 1)) * 100}%`,
                    background: area.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h4 className={styles.chartTitle}>Розподіл напрямків</h4>
          <div className={styles.chartWrapper}>
            <Doughnut 
              data={doughnutData} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      padding: 16,
                      usePointStyle: true,
                      pointStyle: 'circle',
                    },
                  },
                },
                cutout: '60%',
                animation: {
                  animateRotate: true,
                  duration: 1000,
                },
              }}
            />
          </div>
        </div>

        <div className={styles.chartCard}>
          <h4 className={styles.chartTitle}>Активність за останні 30 днів</h4>
          <div className={styles.chartWrapper}>
            <Bar 
              data={barData} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    callbacks: {
                      afterBody: (context) => {
                        const index = context[0].dataIndex;
                        const day = focusDays.find(d => {
                          const date = new Date();
                          date.setDate(date.getDate() - (29 - index));
                          return d.date === date.toISOString().split('T')[0];
                        });
                        if (day) {
                          const areaNames = day.areaIds
                            .map(id => areas.find(a => a.id === id)?.name)
                            .filter(Boolean);
                          return areaNames.length > 0 ? `Напрямки: ${areaNames.join(', ')}` : '';
                        }
                        return '';
                      },
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: Math.max(5, ...barData.datasets[0].data) + 1,
                    ticks: {
                      stepSize: 1,
                    },
                  },
                },
                animation: {
                  duration: 800,
                },
              }}
            />
          </div>
        </div>

        <div className={`${styles.chartCard} ${styles.fullWidth}`}>
          <h4 className={styles.chartTitle}>Прогрес за напрямками (накопичувально)</h4>
          <div className={styles.chartWrapper}>
            <Line 
              data={lineData} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                    labels: {
                      padding: 16,
                      usePointStyle: true,
                      pointStyle: 'circle',
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1,
                    },
                  },
                },
                animation: {
                  duration: 1000,
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Детальна таблиця статистики */}
      <div className={styles.detailsTable}>
        <h4 className={styles.tableTitle}>📋 Детальна статистика</h4>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Напрямок</th>
                <th>Кількість тренувань</th>
                <th>Відсоток</th>
                <th>Прогрес</th>
                <th>Останнє тренування</th>
              </tr>
            </thead>
            <tbody>
              {areas.map(area => {
                const count = areaStats[area.id] || 0;
                const percentage = totalSessions > 0 ? ((count / totalSessions) * 100).toFixed(1) : 0;
                const maxCount = Math.max(...Object.values(areaStats), 1);
                const progress = (count / maxCount) * 100;
                
                // Знаходимо останнє тренування
                const lastDay = focusDays
                  .filter(day => day.areaIds.includes(area.id))
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                const lastDate = lastDay 
                  ? new Date(lastDay.date).toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' })
                  : 'Немає';

                return (
                  <tr key={area.id}>
                    <td>
                      <div className={styles.areaCell}>
                        <span 
                          className={styles.cellDot}
                          style={{ background: area.color }}
                        />
                        <span>{area.name}</span>
                      </div>
                    </td>
                    <td>{count}</td>
                    <td>{percentage}%</td>
                    <td>
                      <div className={styles.progressBar}>
                        <div 
                          className={styles.progressFill}
                          style={{ 
                            width: `${progress}%`,
                            background: area.color,
                          }}
                        />
                      </div>
                    </td>
                    <td>{lastDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Мотиваційний блок */}
      {totalDays > 0 && (
        <div className={styles.motivationBlock}>
          <div className={styles.motivationContent}>
            <span className={styles.motivationEmoji}>💪</span>
            <div className={styles.motivationText}>
              <h4>Чудова робота!</h4>
              <p>
                Ви вже {totalDays} днів працюєте над собою! 
                {totalSessions > 50 && ' Ви неймовірні! 🏆'}
                {totalSessions > 30 && ' Продовжуйте в тому ж дусі! 🔥'}
                {totalSessions > 10 && ' Гарний старт! ⚡'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}