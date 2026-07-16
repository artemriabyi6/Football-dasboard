// components/tactical/Field.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Player } from '@/types';
import styles from './Field.module.css';

interface FieldProps {
  homePlayers: Player[];
  awayPlayers: Player[];
  ballPosition: { x: number; y: number };
  onPlayerMove: (playerId: string, x: number, y: number) => void;
  onPlayerSelect: (playerId: string | null) => void;
  onBallMove: (x: number, y: number) => void;
  selectedPlayerId: string | null;
  isEditable: boolean;
}

export default function Field({
  homePlayers,
  awayPlayers,
  ballPosition,
  onPlayerMove,
  onPlayerSelect,
  onBallMove,
  selectedPlayerId,
  isEditable,
}: FieldProps) {
  const [draggingPlayer, setDraggingPlayer] = useState<string | null>(null);
  const [isDraggingBall, setIsDraggingBall] = useState(false);
  const [touchOffset, setTouchOffset] = useState({ x: 0, y: 0 });
  const fieldRef = useRef<HTMLDivElement>(null);

  const getPositionFromEvent = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = fieldRef.current?.getBoundingClientRect();
    if (!rect) return null;

    let clientX: number, clientY: number;

    if ('touches' in e) {
      const touch = e.touches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    let x = ((clientX - rect.left) / rect.width) * 100;
    let y = ((clientY - rect.top) / rect.height) * 100;

    x = Math.max(2, Math.min(98, x));
    y = Math.max(2, Math.min(98, y));

    return { x, y };
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent, playerId: string) => {
    if (!isEditable) return;
    e.preventDefault();

    const pos = getPositionFromEvent(e);
    if (!pos) return;

    const allPlayers = [...homePlayers, ...awayPlayers];
    const player = allPlayers.find(p => p.id === playerId);
    if (!player) return;

    const offsetX = pos.x - player.x;
    const offsetY = pos.y - player.y;

    setDraggingPlayer(playerId);
    setTouchOffset({ x: offsetX, y: offsetY });
    onPlayerSelect(playerId);
  };

  const handleBallPointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isEditable) return;
    e.preventDefault();
    e.stopPropagation();
    
    const pos = getPositionFromEvent(e);
    if (!pos) return;

    const offsetX = pos.x - ballPosition.x;
    const offsetY = pos.y - ballPosition.y;

    setIsDraggingBall(true);
    setTouchOffset({ x: offsetX, y: offsetY });
    onPlayerSelect(null);
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isEditable) return;

    const pos = getPositionFromEvent(e);
    if (!pos) return;

    if (draggingPlayer) {
      const x = Math.max(2, Math.min(98, pos.x - touchOffset.x));
      const y = Math.max(2, Math.min(98, pos.y - touchOffset.y));
      onPlayerMove(draggingPlayer, x, y);
    } else if (isDraggingBall) {
      const x = Math.max(2, Math.min(98, pos.x - touchOffset.x));
      const y = Math.max(2, Math.min(98, pos.y - touchOffset.y));
      onBallMove(x, y);
    }
  };

  const handlePointerUp = () => {
    setDraggingPlayer(null);
    setIsDraggingBall(false);
  };

  // Підтримка миші
  useEffect(() => {
    const handleMouseUp = () => {
      setDraggingPlayer(null);
      setIsDraggingBall(false);
    };
    const handleMouseLeave = () => {
      setDraggingPlayer(null);
      setIsDraggingBall(false);
    };

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Підтримка тач-пристроїв
  useEffect(() => {
    const handleTouchEnd = () => {
      setDraggingPlayer(null);
      setIsDraggingBall(false);
    };
    const handleTouchCancel = () => {
      setDraggingPlayer(null);
      setIsDraggingBall(false);
    };

    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchCancel);

    return () => {
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, []);

  const getPositionLabel = (position: string) => {
    const labels: Record<string, string> = {
      GK: 'ВР',
      LB: 'ЛЗ',
      CB: 'ЦЗ',
      RB: 'ПЗ',
      LM: 'ЛП',
      CM: 'ЦП',
      RM: 'ПП',
      LW: 'ЛВ',
      CF: 'ЦН',
      RW: 'ПВ',
      ST: 'НП',
    };
    return labels[position] || position;
  };

  const renderPlayer = (player: Player, isHome: boolean) => {
    const isSelected = selectedPlayerId === player.id;
    const isDragging = draggingPlayer === player.id;

    return (
      <div
        key={player.id}
        className={`${styles.player} ${isHome ? styles.home : styles.away} ${isSelected ? styles.selected : ''} ${isDragging ? styles.dragging : ''}`}
        style={{
          left: `${player.x}%`,
          top: `${player.y}%`,
          transform: 'translate(-50%, -50%)',
          cursor: isEditable ? 'grab' : 'default',
          touchAction: 'none',
        }}
        onMouseDown={(e) => handlePointerDown(e, player.id)}
        onTouchStart={(e) => handlePointerDown(e, player.id)}
        onClick={() => onPlayerSelect(player.id)}
      >
        <div className={styles.playerNumber}>{player.number}</div>
        <div className={styles.playerPosition}>{getPositionLabel(player.position)}</div>
        {isSelected && isEditable && (
          <div className={styles.playerControls}>
            <div className={styles.playerName}>{player.name}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      className={styles.field}
      ref={fieldRef}
      onMouseMove={handlePointerMove}
      onTouchMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onTouchEnd={handlePointerUp}
      onMouseLeave={handlePointerUp}
    >
      <div className={styles.pitch}>
        <div className={styles.outline} />
        <div className={styles.centerLine} />
        <div className={styles.centerCircle} />
        <div className={styles.centerDot} />
        <div className={styles.penaltyAreaHome} />
        <div className={styles.penaltyAreaAway} />
        <div className={styles.goalAreaHome} />
        <div className={styles.goalAreaAway} />
        <div className={styles.goalHome} />
        <div className={styles.goalAway} />
        <div className={styles.cornerTL} />
        <div className={styles.cornerTR} />
        <div className={styles.cornerBL} />
        <div className={styles.cornerBR} />
        <div className={styles.penaltyMarkHome} />
        <div className={styles.penaltyMarkAway} />
        <div className={styles.penaltyArcHome} />
        <div className={styles.penaltyArcAway} />
        <div className={styles.teamLabelHome}>🏠 {homePlayers.length > 0 && `${homePlayers.length} гравців`}</div>
        <div className={styles.teamLabelAway}>✈️ {awayPlayers.length > 0 && `${awayPlayers.length} гравців`}</div>
        <div className={styles.attackArrowHome}>→</div>
        <div className={styles.attackArrowAway}>←</div>
        
        {/* М'яч - тепер клікабельний та пересувається */}
        <div 
          className={`${styles.ball} ${isDraggingBall ? styles.dragging : ''}`}
          style={{
            left: `${ballPosition.x}%`,
            top: `${ballPosition.y}%`,
            cursor: isEditable ? 'grab' : 'default',
          }}
          onMouseDown={handleBallPointerDown}
          onTouchStart={handleBallPointerDown}
          onClick={(e) => {
            e.stopPropagation();
            onPlayerSelect(null);
          }}
          title="Перетягніть м'яч"
        />
      </div>

      {homePlayers.map(player => renderPlayer(player, true))}
      {awayPlayers.map(player => renderPlayer(player, false))}

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: '#2563eb' }} />
          <span>Господарі →</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: '#dc2626' }} />
          <span>Гості ←</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: '#ffffff', boxShadow: '0 0 4px rgba(255,255,255,0.5)' }} />
          <span>⚽ М'яч</span>
        </div>
      </div>
    </div>
  );
}