-- sql/001_create_theories_table.sql
-- Створення таблиці для теорій

CREATE TABLE IF NOT EXISTS theories (
  id VARCHAR(255) PRIMARY KEY,
  title TEXT NOT NULL,
  match TEXT NOT NULL,
  date DATE NOT NULL,
  questions JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Індекси для швидкого пошуку
CREATE INDEX IF NOT EXISTS idx_theories_title ON theories(title);
CREATE INDEX IF NOT EXISTS idx_theories_match ON theories(match);
CREATE INDEX IF NOT EXISTS idx_theories_date ON theories(date);
CREATE INDEX IF NOT EXISTS idx_theories_created_at ON theories(created_at DESC);

-- Коментарі до таблиці
COMMENT ON TABLE theories IS 'Таблиця для збереження аналізів матчів';
COMMENT ON COLUMN theories.questions IS 'JSON з відповідями на 6 запитань';