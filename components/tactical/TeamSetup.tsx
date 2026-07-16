// components/tactical/TeamSetup.tsx
'use client';

import { useState } from 'react';
import { Player, HOME_FORMATIONS, AWAY_FORMATIONS } from '@/types';
import styles from './TeamSetup.module.css';

interface TeamSetupProps {
  teamName: string;
  teamColor: 'home' | 'away';
  players: Player[];
  formation: string;
  onFormationChange: (formation: string) => void;
  onPlayerUpdate: (playerId: string, updates: Partial<Player>) => void;
  onAddPlayer: () => void;
  onRemovePlayer: (playerId: string) => void;
  isEditable: boolean;
}

// Визначаємо POSITIONS локально
const POSITIONS = {
  GK: { label: 'Воротар', short: 'ВР' },
  LB: { label: 'Лівий захисник', short: 'ЛЗ' },
  CB: { label: 'Центральний захисник', short: 'ЦЗ' },
  RB: { label: 'Правий захисник', short: 'ПЗ' },
  LM: { label: 'Лівий півзахисник', short: 'ЛП' },
  CM: { label: 'Центральний півзахисник', short: 'ЦП' },
  RM: { label: 'Правий півзахисник', short: 'ПП' },
  LW: { label: 'Лівий вінгер', short: 'ЛВ' },
  CF: { label: 'Центральний нападник', short: 'ЦН' },
  RW: { label: 'Правий вінгер', short: 'ПВ' },
  ST: { label: 'Нападник', short: 'НП' },
};

export default function TeamSetup({
  teamName,
  teamColor,
  players,
  formation,
  onFormationChange,
  onPlayerUpdate,
  onAddPlayer,
  onRemovePlayer,
  isEditable,
}: TeamSetupProps) {
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);

  // Отримуємо доступні формації для команди
  const getFormations = () => {
    if (teamColor === 'home') {
      return Object.keys(HOME_FORMATIONS);
    } else {
      return Object.keys(AWAY_FORMATIONS);
    }
  };

  const formationOptions = getFormations();

  const getPositionLabel = (position: string) => {
    return POSITIONS[position as keyof typeof POSITIONS]?.label || position;
  };

  const getPositionShort = (position: string) => {
    return POSITIONS[position as keyof typeof POSITIONS]?.short || position;
  };

  const handlePlayerEdit = (playerId: string, field: keyof Player, value: string | number) => {
    onPlayerUpdate(playerId, { [field]: value });
  };

  return (
    <div className={`${styles.container} ${styles[teamColor]}`}>
      <div className={styles.header}>
        <h3 className={styles.teamName}>{teamName}</h3>
        <span className={styles.playerCount}>{players.length} гравців</span>
      </div>

      <div className={styles.formationSelector}>
        <label className={styles.label}>Схема:</label>
        <select
          value={formation}
          onChange={(e) => onFormationChange(e.target.value)}
          className={styles.select}
          disabled={!isEditable}
        >
          {formationOptions.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.playersList}>
        <div className={styles.playersHeader}>
          <span className={styles.headerNumber}>№</span>
          <span className={styles.headerName}>Ім'я</span>
          <span className={styles.headerPosition}>Позиція</span>
          {isEditable && <span className={styles.headerActions}>Дії</span>}
        </div>

        {players.map((player) => {
          const isEditing = editingPlayerId === player.id;

          return (
            <div key={player.id} className={styles.playerRow}>
              <span className={styles.playerNumber}>{player.number}</span>
              
              {isEditing && isEditable ? (
                <>
                  <input
                    type="text"
                    value={player.name}
                    onChange={(e) => handlePlayerEdit(player.id, 'name', e.target.value)}
                    className={styles.editInput}
                    onBlur={() => setEditingPlayerId(null)}
                    onKeyDown={(e) => e.key === 'Enter' && setEditingPlayerId(null)}
                    autoFocus
                  />
                  <select
                    value={player.position}
                    onChange={(e) => handlePlayerEdit(player.id, 'position', e.target.value)}
                    className={styles.editSelect}
                    onBlur={() => setEditingPlayerId(null)}
                  >
                    {Object.entries(POSITIONS).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.label} ({value.short})
                      </option>
                    ))}
                  </select>
                  <button 
                    className={styles.saveButton}
                    onClick={() => setEditingPlayerId(null)}
                  >
                    ✓
                  </button>
                </>
              ) : (
                <>
                  <span 
                    className={styles.playerName}
                    onDoubleClick={() => isEditable && setEditingPlayerId(player.id)}
                  >
                    {player.name}
                  </span>
                  <span className={styles.playerPosition}>
                    {getPositionShort(player.position)}
                  </span>
                  {isEditable && (
                    <div className={styles.playerActions}>
                      <button 
                        className={styles.editButton}
                        onClick={() => setEditingPlayerId(player.id)}
                        title="Редагувати"
                      >
                        ✏️
                      </button>
                      <button 
                        className={styles.removeButton}
                        onClick={() => onRemovePlayer(player.id)}
                        title="Видалити"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}

        {isEditable && (
          <button className={styles.addButton} onClick={onAddPlayer}>
            + Додати гравця
          </button>
        )}
      </div>

      {!isEditable && (
        <div className={styles.viewModeHint}>
          <span>👁️ Режим перегляду</span>
        </div>
      )}
    </div>
  );
}