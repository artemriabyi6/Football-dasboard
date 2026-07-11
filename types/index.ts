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
    question1: string; // 0-10 min
    question2: string; // 10-30 min
    question3: string; // 30-45 min
    question4: string; // 45-60 min
    question5: string; // 60-75 min
    question6: string; // 75-90 min
  };
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