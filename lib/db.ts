// lib/db.ts
import { sql } from '@vercel/postgres';
import { Theory } from '@/types';

// Перетворення даних з бази в наш формат
const mapDbRowToTheory = (row: any): Theory => {
  return {
    id: row.id,
    title: row.title,
    match: row.match,
    date: row.date,
    questions: typeof row.questions === 'string' ? JSON.parse(row.questions) : row.questions,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

// Отримати всі теорії
export async function getTheories(): Promise<Theory[]> {
  try {
    const result = await sql`
      SELECT * FROM theories 
      ORDER BY created_at DESC
    `;
    return result.rows.map(mapDbRowToTheory);
  } catch (error) {
    console.error('Error fetching theories:', error);
    return [];
  }
}

// Додати нову теорію
export async function createTheory(theory: Omit<Theory, 'id' | 'createdAt' | 'updatedAt'>): Promise<Theory | null> {
  try {
    const id = Date.now().toString();
    const result = await sql`
      INSERT INTO theories (id, title, match, date, questions, created_at, updated_at)
      VALUES (${id}, ${theory.title}, ${theory.match}, ${theory.date}, ${JSON.stringify(theory.questions)}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;
    return result.rows.length > 0 ? mapDbRowToTheory(result.rows[0]) : null;
  } catch (error) {
    console.error('Error creating theory:', error);
    return null;
  }
}

// Оновити теорію
export async function updateTheory(id: string, theory: Partial<Theory>): Promise<Theory | null> {
  try {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (theory.title !== undefined) {
      updates.push(`title = $${paramIndex++}`);
      values.push(theory.title);
    }
    if (theory.match !== undefined) {
      updates.push(`match = $${paramIndex++}`);
      values.push(theory.match);
    }
    if (theory.date !== undefined) {
      updates.push(`date = $${paramIndex++}`);
      values.push(theory.date);
    }
    if (theory.questions !== undefined) {
      updates.push(`questions = $${paramIndex++}`);
      values.push(JSON.stringify(theory.questions));
    }
    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    values.push(id);

    const result = await sql`
      UPDATE theories 
      SET ${sql.raw(updates.join(', '))}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    return result.rows.length > 0 ? mapDbRowToTheory(result.rows[0]) : null;
  } catch (error) {
    console.error('Error updating theory:', error);
    return null;
  }
}

// Видалити теорію
export async function deleteTheory(id: string): Promise<boolean> {
  try {
    const result = await sql`
      DELETE FROM theories 
      WHERE id = ${id}
      RETURNING id
    `;
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error deleting theory:', error);
    return false;
  }
}