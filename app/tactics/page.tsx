// app/tactics/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Field from '@/components/tactical/Field';
import TeamSetup from '@/components/tactical/TeamSetup';
import { Player, HOME_FORMATIONS, AWAY_FORMATIONS } from '@/types';
import styles from './page.module.css';

export default function TacticsPage() {
  const [isEditable, setIsEditable] = useState(true);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [homePlayers, setHomePlayers] = useState<Player[]>([]);
  const [awayPlayers, setAwayPlayers] = useState<Player[]>([]);
  const [homeFormation, setHomeFormation] = useState('4-4-2');
  const [awayFormation, setAwayFormation] = useState('4-4-2');
  const [homeTeamName, setHomeTeamName] = useState('Господарі');
  const [awayTeamName, setAwayTeamName] = useState('Гості');
  
  // Стан для позиції м'яча
  const [ballPosition, setBallPosition] = useState({ x: 50, y: 50 });

  // Ініціалізація гравців при зміні формації господарів
  useEffect(() => {
    const formationData = HOME_FORMATIONS[homeFormation as keyof typeof HOME_FORMATIONS];
    if (!formationData) return;

    const newPlayers: Player[] = formationData.positions.map((pos, index) => ({
      id: `home-${Date.now()}-${index}`,
      name: `Гравець ${index + 1}`,
      team: 'home',
      number: index + 1,
      x: pos.x,
      y: pos.y,
      position: pos.position as Player['position'],
      isGoalkeeper: pos.position === 'GK',
    }));

    setHomePlayers(newPlayers);
  }, [homeFormation]);

  // Ініціалізація гравців при зміні формації гостей
  useEffect(() => {
    const formationData = AWAY_FORMATIONS[awayFormation as keyof typeof AWAY_FORMATIONS];
    if (!formationData) return;

    const newPlayers: Player[] = formationData.positions.map((pos, index) => ({
      id: `away-${Date.now()}-${index}`,
      name: `Гравець ${index + 1}`,
      team: 'away',
      number: index + 1,
      x: pos.x,
      y: pos.y,
      position: pos.position as Player['position'],
      isGoalkeeper: pos.position === 'GK',
    }));

    setAwayPlayers(newPlayers);
  }, [awayFormation]);

  // Збереження даних
  useEffect(() => {
    const data = {
      homePlayers,
      awayPlayers,
      homeFormation,
      awayFormation,
      homeTeamName,
      awayTeamName,
      ballPosition,
    };
    localStorage.setItem('tacticsData', JSON.stringify(data));
  }, [homePlayers, awayPlayers, homeFormation, awayFormation, homeTeamName, awayTeamName, ballPosition]);

  // Завантаження даних
  useEffect(() => {
    const saved = localStorage.getItem('tacticsData');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.homePlayers) setHomePlayers(data.homePlayers);
        if (data.awayPlayers) setAwayPlayers(data.awayPlayers);
        if (data.homeFormation) setHomeFormation(data.homeFormation);
        if (data.awayFormation) setAwayFormation(data.awayFormation);
        if (data.homeTeamName) setHomeTeamName(data.homeTeamName);
        if (data.awayTeamName) setAwayTeamName(data.awayTeamName);
        if (data.ballPosition) setBallPosition(data.ballPosition);
      } catch {
        console.error('Error loading tactics data');
      }
    }
  }, []);

  const handlePlayerMove = (playerId: string, x: number, y: number) => {
    const updatePlayer = (players: Player[]) =>
      players.map(p => p.id === playerId ? { ...p, x, y } : p);

    if (homePlayers.some(p => p.id === playerId)) {
      setHomePlayers(updatePlayer(homePlayers));
    } else if (awayPlayers.some(p => p.id === playerId)) {
      setAwayPlayers(updatePlayer(awayPlayers));
    }
  };

  const handlePlayerSelect = (playerId: string | null) => {
    setSelectedPlayerId(playerId);
  };

  const handleBallMove = (x: number, y: number) => {
    setBallPosition({ x, y });
  };

  const handleAddPlayer = (team: 'home' | 'away') => {
    const players = team === 'home' ? homePlayers : awayPlayers;
    const setPlayers = team === 'home' ? setHomePlayers : setAwayPlayers;
    const maxNumber = players.reduce((max, p) => Math.max(max, p.number), 0);

    const newPlayer: Player = {
      id: `${team}-${Date.now()}`,
      name: `Гравець ${maxNumber + 1}`,
      team,
      number: maxNumber + 1,
      x: 50,
      y: 50,
      position: 'CM',
      isGoalkeeper: false,
    };

    setPlayers([...players, newPlayer]);
  };

  const handleRemovePlayer = (team: 'home' | 'away', playerId: string) => {
    const players = team === 'home' ? homePlayers : awayPlayers;
    const setPlayers = team === 'home' ? setHomePlayers : setAwayPlayers;

    if (players.length <= 1) {
      alert('В команді має бути хоча б один гравець!');
      return;
    }

    setPlayers(players.filter(p => p.id !== playerId));
    if (selectedPlayerId === playerId) {
      setSelectedPlayerId(null);
    }
  };

  const handlePlayerUpdate = (team: 'home' | 'away', playerId: string, updates: Partial<Player>) => {
    const setPlayers = team === 'home' ? setHomePlayers : setAwayPlayers;
    setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, ...updates } : p));
  };

  const resetPositions = () => {
    const homeFormationData = HOME_FORMATIONS[homeFormation as keyof typeof HOME_FORMATIONS];
    if (homeFormationData) {
      const newHomePlayers = homePlayers.map((player, index) => ({
        ...player,
        x: homeFormationData.positions[index]?.x || 50,
        y: homeFormationData.positions[index]?.y || 50,
      }));
      setHomePlayers(newHomePlayers);
    }

    const awayFormationData = AWAY_FORMATIONS[awayFormation as keyof typeof AWAY_FORMATIONS];
    if (awayFormationData) {
      const newAwayPlayers = awayPlayers.map((player, index) => ({
        ...player,
        x: awayFormationData.positions[index]?.x || 50,
        y: awayFormationData.positions[index]?.y || 50,
      }));
      setAwayPlayers(newAwayPlayers);
    }

    // Скидаємо м'яч в центр
    setBallPosition({ x: 50, y: 50 });
  };

  return (
    <>
      <div className={styles.container}>
        <Header />
        <div className={styles.content}>
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>🧠 Тактична дошка</h1>
              <p className={styles.subtitle}>Створюй та аналізуй тактичні схеми</p>
            </div>
            <div className={styles.headerActions}>
              <button 
                className={styles.editToggle}
                onClick={() => setIsEditable(!isEditable)}
              >
                {isEditable ? '🔒 Заблокувати' : '🔓 Редагувати'}
              </button>
              <button 
                className={styles.resetButton}
                onClick={resetPositions}
              >
                🔄 Скинути позиції
              </button>
            </div>
          </div>

          <div className={styles.fieldWrapper}>
            <Field
              homePlayers={homePlayers}
              awayPlayers={awayPlayers}
              ballPosition={ballPosition}
              onPlayerMove={handlePlayerMove}
              onPlayerSelect={handlePlayerSelect}
              onBallMove={handleBallMove}
              selectedPlayerId={selectedPlayerId}
              isEditable={isEditable}
            />
          </div>

          <div className={styles.teamsWrapper}>
            <TeamSetup
              teamName={homeTeamName}
              teamColor="home"
              players={homePlayers}
              formation={homeFormation}
              onFormationChange={setHomeFormation}
              onPlayerUpdate={(id, updates) => handlePlayerUpdate('home', id, updates)}
              onAddPlayer={() => handleAddPlayer('home')}
              onRemovePlayer={(id) => handleRemovePlayer('home', id)}
              isEditable={isEditable}
            />

            <TeamSetup
              teamName={awayTeamName}
              teamColor="away"
              players={awayPlayers}
              formation={awayFormation}
              onFormationChange={setAwayFormation}
              onPlayerUpdate={(id, updates) => handlePlayerUpdate('away', id, updates)}
              onAddPlayer={() => handleAddPlayer('away')}
              onRemovePlayer={(id) => handleRemovePlayer('away', id)}
              isEditable={isEditable}
            />
          </div>

          <div className={styles.statsBar}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Всього гравців:</span>
              <span className={styles.statValue}>{homePlayers.length + awayPlayers.length}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Господарі:</span>
              <span className={styles.statValue}>{homePlayers.length}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Гості:</span>
              <span className={styles.statValue}>{awayPlayers.length}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Схема:</span>
              <span className={styles.statValue}>{homeFormation} vs {awayFormation}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>⚽ М'яч:</span>
              <span className={styles.statValue}>
                {Math.round(ballPosition.x)}%, {Math.round(ballPosition.y)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}