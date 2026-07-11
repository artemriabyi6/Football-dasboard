// components/FocusAreaManager.tsx
'use client';

import { useState } from 'react';
import { FocusArea } from '@/types';
import { presetColors } from '@/data/colors';
import styles from './FocusAreaManager.module.css';

interface FocusAreaManagerProps {
  areas: FocusArea[];
  onAdd: (name: string, color: string) => void;
  onEdit: (id: string, name: string, color: string) => void;
  onDelete: (id: string) => void;
}

export default function FocusAreaManager({ 
  areas, 
  onAdd, 
  onEdit, 
  onDelete 
}: FocusAreaManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(presetColors[0].value);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');

  const handleAdd = () => {
    if (newName.trim() && areas.length < 5) {
      onAdd(newName.trim(), newColor);
      setNewName('');
      setNewColor(presetColors[0].value);
      setIsAdding(false);
    }
  };

  const handleEdit = (id: string) => {
    const area = areas.find(a => a.id === id);
    if (area) {
      setEditingId(id);
      setEditName(area.name);
      setEditColor(area.color);
    }
  };

  const handleSaveEdit = (id: string) => {
    if (editName.trim()) {
      onEdit(id, editName.trim(), editColor);
      setEditingId(null);
      setEditName('');
      setEditColor('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditColor('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>🎯 Напрямки розвитку</h3>
        <span className={styles.count}>
          {areas.length}/5
        </span>
      </div>

      <div className={styles.list}>
        {areas.map((area) => (
          <div key={area.id} className={styles.areaItem}>
            {editingId === area.id ? (
              <div className={styles.editForm}>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={styles.editInput}
                  placeholder="Назва напрямку"
                  autoFocus
                />
                <div className={styles.colorPicker}>
                  {presetColors.map((color) => (
                    <button
                      key={color.id}
                      className={`${styles.colorOption} ${editColor === color.value ? styles.selected : ''}`}
                      style={{ background: color.value }}
                      onClick={() => setEditColor(color.value)}
                      title={color.name}
                    />
                  ))}
                </div>
                <div className={styles.editActions}>
                  <button 
                    className={styles.saveButton}
                    onClick={() => handleSaveEdit(area.id)}
                  >
                    💾
                  </button>
                  <button 
                    className={styles.cancelButton}
                    onClick={handleCancelEdit}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className={styles.areaInfo}>
                  <span 
                    className={styles.colorDot}
                    style={{ background: area.color }}
                  />
                  <span className={styles.areaName}>{area.name}</span>
                </div>
                <div className={styles.areaActions}>
                  <button 
                    className={styles.editButton}
                    onClick={() => handleEdit(area.id)}
                  >
                    ✏️
                  </button>
                  <button 
                    className={styles.deleteButton}
                    onClick={() => onDelete(area.id)}
                  >
                    🗑️
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {areas.length < 5 && !isAdding && (
        <button 
          className={styles.addButton}
          onClick={() => setIsAdding(true)}
        >
          + Додати напрямок
        </button>
      )}

      {isAdding && (
        <div className={styles.addForm}>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className={styles.addInput}
            placeholder="Назва напрямку"
            autoFocus
          />
          <div className={styles.colorPicker}>
            {presetColors.map((color) => (
              <button
                key={color.id}
                className={`${styles.colorOption} ${newColor === color.value ? styles.selected : ''}`}
                style={{ background: color.value }}
                onClick={() => setNewColor(color.value)}
                title={color.name}
              />
            ))}
          </div>
          <div className={styles.addActions}>
            <button 
              className={styles.saveButton}
              onClick={handleAdd}
              disabled={!newName.trim()}
            >
              Додати
            </button>
            <button 
              className={styles.cancelButton}
              onClick={() => {
                setIsAdding(false);
                setNewName('');
                setNewColor(presetColors[0].value);
              }}
            >
              Скасувати
            </button>
          </div>
        </div>
      )}
    </div>
  );
}