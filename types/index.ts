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