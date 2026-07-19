export interface Exercise {
  id: number;
  title: string;
  description: string;
  category: string;
  duration: string;
  level: 'Початковий' | 'Середній' | 'Складний';
  sets: number;
  videoUrl?: string; // URL відео
  thumbnail?: string; // URL прев'ю (опціонально)
}
export interface Category {
  id: string;
  label: string;
  icon: string;
}


export interface Theory {
  id: string;
  title: string;
  match: string;
  date: string;
  questions: {
    question1: string;
    question2: string;
    question3: string;
    question4: string;
    question5: string;
    question6: string;
  };
  personalAnalysis?: string; // Додаємо поле для аналізу власних дій
  createdAt: string;
  updatedAt?: string;
}

export interface FocusArea {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface FocusDay {
  date: string; // Формат: YYYY-MM-DD
  areaIds: string[]; // ID напрямків, які були в цей день
}

export interface FocusGoal {
  id: string;
  title: string;
  description?: string;
  targetDate: string;
  createdAt: string;
  completed: boolean;
  completedAt?: string;
  subGoals: FocusSubGoal[];
}

export interface FocusSubGoal {
  id: string;
  title: string; // Назва підцілі
  description?: string; // Опис підцілі
  targetSessions: number;
  currentSessions: number;
  completed: boolean;
  completedAt?: string;
  focusAreaIds: string[]; // Які напрямки розвитку використовувати
  exerciseIds?: string[]; // ID конкретних вправ з exercises.ts
}

// types/index.ts
export interface VideoFile {
  id: string;
  name: string;
  url: string;
  duration?: string;
  thumbnail?: string;
  size?: number;
  uploadedAt: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  videoIds: string[];
  createdAt: string;
  updatedAt?: string;
  coverImage?: string;
}

// types/index.ts
export interface TrainingEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string; // ISO datetime
  endTime: string; // ISO datetime
  areaId?: string; // ID напрямку з focus
  type: 'training' | 'match' | 'rest' | 'other';
  location?: string;
  completed: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface DailyNote {
  date: string; // YYYY-MM-DD
  note: string;
}
// types/index.ts
export interface Player {
  id: string;
  name: string;
  team: 'home' | 'away';
  number: number;
  x: number; // позиція на полі (0-100)
  y: number; // позиція на полі (0-100)
  position: 'GK' | 'LB' | 'CB' | 'RB' | 'LM' | 'CM' | 'RM' | 'LW' | 'CF' | 'RW' | 'ST';
  isGoalkeeper: boolean;
}

// types/index.ts - формації для горизонтального поля (ворота зліва/справа)

// Формації для команди господарів (атакують зліва направо)
export const HOME_FORMATIONS = {
  '4-4-2': {
    name: '4-4-2',
    positions: [
      { position: 'GK', x: 6, y: 50 },
      { position: 'LB', x: 15, y: 20 },
      { position: 'CB', x: 22, y: 35 },
      { position: 'CB', x: 22, y: 65 },
      { position: 'RB', x: 15, y: 80 },
      { position: 'LM', x: 35, y: 18 },
      { position: 'CM', x: 45, y: 35 },
      { position: 'CM', x: 45, y: 65 },
      { position: 'RM', x: 35, y: 82 },
      { position: 'ST', x: 78, y: 35 },
      { position: 'ST', x: 78, y: 65 },
    ]
  },
  '4-3-3': {
    name: '4-3-3',
    positions: [
      { position: 'GK', x: 6, y: 50 },
      { position: 'LB', x: 15, y: 20 },
      { position: 'CB', x: 22, y: 35 },
      { position: 'CB', x: 22, y: 65 },
      { position: 'RB', x: 15, y: 80 },
      { position: 'LM', x: 35, y: 18 },
      { position: 'CM', x: 45, y: 50 },
      { position: 'RM', x: 35, y: 82 },
      { position: 'LW', x: 72, y: 18 },
      { position: 'ST', x: 82, y: 50 },
      { position: 'RW', x: 72, y: 82 },
    ]
  },
  '3-5-2': {
    name: '3-5-2',
    positions: [
      { position: 'GK', x: 6, y: 50 },
      { position: 'CB', x: 20, y: 22 },
      { position: 'CB', x: 25, y: 50 },
      { position: 'CB', x: 20, y: 78 },
      { position: 'LM', x: 32, y: 12 },
      { position: 'CM', x: 42, y: 30 },
      { position: 'CM', x: 45, y: 50 },
      { position: 'CM', x: 42, y: 70 },
      { position: 'RM', x: 32, y: 88 },
      { position: 'ST', x: 78, y: 32 },
      { position: 'ST', x: 78, y: 68 },
    ]
  },
  '4-2-3-1': {
    name: '4-2-3-1',
    positions: [
      { position: 'GK', x: 6, y: 50 },
      { position: 'LB', x: 15, y: 20 },
      { position: 'CB', x: 22, y: 35 },
      { position: 'CB', x: 22, y: 65 },
      { position: 'RB', x: 15, y: 80 },
      { position: 'CM', x: 32, y: 32 },
      { position: 'CM', x: 32, y: 68 },
      { position: 'LW', x: 62, y: 18 },
      { position: 'CF', x: 68, y: 50 },
      { position: 'RW', x: 62, y: 82 },
      { position: 'ST', x: 84, y: 50 },
    ]
  },
  '5-3-2': {
    name: '5-3-2',
    positions: [
      { position: 'GK', x: 6, y: 50 },
      { position: 'LB', x: 12, y: 16 },
      { position: 'CB', x: 20, y: 28 },
      { position: 'CB', x: 25, y: 50 },
      { position: 'CB', x: 20, y: 72 },
      { position: 'RB', x: 12, y: 84 },
      { position: 'CM', x: 35, y: 28 },
      { position: 'CM', x: 38, y: 50 },
      { position: 'CM', x: 35, y: 72 },
      { position: 'ST', x: 78, y: 32 },
      { position: 'ST', x: 78, y: 68 },
    ]
  },
  '4-1-2-1-2': {
    name: '4-1-2-1-2',
    positions: [
      { position: 'GK', x: 6, y: 50 },
      { position: 'LB', x: 15, y: 20 },
      { position: 'CB', x: 22, y: 35 },
      { position: 'CB', x: 22, y: 65 },
      { position: 'RB', x: 15, y: 80 },
      { position: 'CM', x: 32, y: 50 },
      { position: 'LM', x: 42, y: 22 },
      { position: 'RM', x: 42, y: 78 },
      { position: 'CF', x: 65, y: 50 },
      { position: 'ST', x: 80, y: 32 },
      { position: 'ST', x: 80, y: 68 },
    ]
  }
};

// Формації для команди гостей (атакують справа наліво - дзеркальне відображення)
export const AWAY_FORMATIONS = {
  '4-4-2': {
    name: '4-4-2',
    positions: [
      { position: 'GK', x: 94, y: 50 },
      { position: 'LB', x: 85, y: 80 },
      { position: 'CB', x: 78, y: 65 },
      { position: 'CB', x: 78, y: 35 },
      { position: 'RB', x: 85, y: 20 },
      { position: 'LM', x: 65, y: 82 },
      { position: 'CM', x: 55, y: 65 },
      { position: 'CM', x: 55, y: 35 },
      { position: 'RM', x: 65, y: 18 },
      { position: 'ST', x: 22, y: 65 },
      { position: 'ST', x: 22, y: 35 },
    ]
  },
  '4-3-3': {
    name: '4-3-3',
    positions: [
      { position: 'GK', x: 94, y: 50 },
      { position: 'LB', x: 85, y: 80 },
      { position: 'CB', x: 78, y: 65 },
      { position: 'CB', x: 78, y: 35 },
      { position: 'RB', x: 85, y: 20 },
      { position: 'LM', x: 65, y: 82 },
      { position: 'CM', x: 55, y: 50 },
      { position: 'RM', x: 65, y: 18 },
      { position: 'LW', x: 28, y: 82 },
      { position: 'ST', x: 18, y: 50 },
      { position: 'RW', x: 28, y: 18 },
    ]
  },
  '3-5-2': {
    name: '3-5-2',
    positions: [
      { position: 'GK', x: 94, y: 50 },
      { position: 'CB', x: 80, y: 78 },
      { position: 'CB', x: 75, y: 50 },
      { position: 'CB', x: 80, y: 22 },
      { position: 'LM', x: 68, y: 88 },
      { position: 'CM', x: 58, y: 70 },
      { position: 'CM', x: 55, y: 50 },
      { position: 'CM', x: 58, y: 30 },
      { position: 'RM', x: 68, y: 12 },
      { position: 'ST', x: 22, y: 68 },
      { position: 'ST', x: 22, y: 32 },
    ]
  },
  '4-2-3-1': {
    name: '4-2-3-1',
    positions: [
      { position: 'GK', x: 94, y: 50 },
      { position: 'LB', x: 85, y: 80 },
      { position: 'CB', x: 78, y: 65 },
      { position: 'CB', x: 78, y: 35 },
      { position: 'RB', x: 85, y: 20 },
      { position: 'CM', x: 68, y: 68 },
      { position: 'CM', x: 68, y: 32 },
      { position: 'LW', x: 38, y: 82 },
      { position: 'CF', x: 32, y: 50 },
      { position: 'RW', x: 38, y: 18 },
      { position: 'ST', x: 16, y: 50 },
    ]
  },
  '5-3-2': {
    name: '5-3-2',
    positions: [
      { position: 'GK', x: 94, y: 50 },
      { position: 'LB', x: 88, y: 84 },
      { position: 'CB', x: 80, y: 72 },
      { position: 'CB', x: 75, y: 50 },
      { position: 'CB', x: 80, y: 28 },
      { position: 'RB', x: 88, y: 16 },
      { position: 'CM', x: 65, y: 72 },
      { position: 'CM', x: 62, y: 50 },
      { position: 'CM', x: 65, y: 28 },
      { position: 'ST', x: 22, y: 68 },
      { position: 'ST', x: 22, y: 32 },
    ]
  },
  '4-1-2-1-2': {
    name: '4-1-2-1-2',
    positions: [
      { position: 'GK', x: 94, y: 50 },
      { position: 'LB', x: 85, y: 80 },
      { position: 'CB', x: 78, y: 65 },
      { position: 'CB', x: 78, y: 35 },
      { position: 'RB', x: 85, y: 20 },
      { position: 'CM', x: 68, y: 50 },
      { position: 'LM', x: 58, y: 78 },
      { position: 'RM', x: 58, y: 22 },
      { position: 'CF', x: 35, y: 50 },
      { position: 'ST', x: 20, y: 68 },
      { position: 'ST', x: 20, y: 32 },
    ]
  }
};

export const POSITIONS = {
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

export const FORMATIONS = {
  ...HOME_FORMATIONS,
  ...AWAY_FORMATIONS
};