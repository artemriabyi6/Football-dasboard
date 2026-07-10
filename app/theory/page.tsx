'use client';

import { useState, useMemo } from 'react';
import { useTheories } from '@/hooks/useTheories';
import TheoryForm from '@/components/TheoryForm';
import TheoryCard from '@/components/TheoryCard';
import Footer from '@/components/Footer';
import { Theory } from '@/types';
import styles from './page.module.css';

export default function TheoryPage() {
  const { theories, loading, error, addTheory, editTheory, removeTheory } = useTheories();
  const [showForm, setShowForm] = useState(false);
  const [editingTheory, setEditingTheory] = useState<Theory | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 4;

  const filteredTheories = useMemo(() => {
    if (!searchQuery.trim()) return theories;
    const query = searchQuery.toLowerCase().trim();
    return theories.filter(t => 
      t.title.toLowerCase().includes(query) ||
      t.match.toLowerCase().includes(query) ||
      t.date.includes(query)
    );
  }, [theories, searchQuery]);

  const totalPages = Math.ceil(filteredTheories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTheories = filteredTheories.slice(startIndex, startIndex + itemsPerPage);

  const handleAddTheory = async (theory: Omit<Theory, 'id' | 'createdAt' | 'updatedAt'>) => {
    const result = await addTheory(theory);
    if (result) {
      setShowForm(false);
      setSearchQuery('');
    }
  };

  const handleEditTheory = async (id: string, updates: Partial<Theory>) => {
    const result = await editTheory(id, updates);
    if (result) {
      setEditingTheory(null);
      setShowForm(false);
    }
  };

  const handleDeleteTheory = async (id: string) => {
    if (!confirm('Ви впевнені, що хочете видалити цей аналіз?')) return;
    await removeTheory(id);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Завантаження...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>Помилка: {error}</p>
          <button onClick={() => window.location.reload()}>Спробувати знову</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>📚 Теорія</h1>
            <p className={styles.subtitle}>Аналіз матчів та тактичні розбори</p>
          </div>
          <button 
            className={styles.addButton}
            onClick={() => {
              setEditingTheory(null);
              setShowForm(!showForm);
            }}
          >
            {showForm ? '✕ Закрити' : '+ Додати аналіз'}
          </button>
        </div>

        <div className={styles.searchSection}>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="🔍 Пошук за назвою, командою або датою..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className={styles.clearSearch}
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>
          <span className={styles.resultsCount}>
            Знайдено: {filteredTheories.length} {filteredTheories.length === 1 ? 'аналіз' : 'аналізів'}
          </span>
        </div>

        {showForm && (
          <div className={styles.formContainer}>
            <TheoryForm
              onSubmit={editingTheory ? 
                (data) => handleEditTheory(editingTheory.id, data) : 
                handleAddTheory
              }
              initialData={editingTheory || undefined}
              onCancel={() => {
                setShowForm(false);
                setEditingTheory(null);
              }}
            />
          </div>
        )}

        {filteredTheories.length === 0 ? (
          <div className={styles.emptyState}>
            <p>{searchQuery ? 'Нічого не знайдено за вашим запитом' : 'Немає жодного аналізу'}</p>
            <p className={styles.emptySubtext}>
              {searchQuery ? 'Спробуйте змінити запит' : 'Додайте свій перший аналіз матчу'}
            </p>
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {currentTheories.map((theory, index) => (
                <TheoryCard
                  key={theory.id}
                  theory={theory}
                  onEdit={setEditingTheory}
                  onDelete={handleDeleteTheory}
                  index={index}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={styles.pageButton}
                >
                  ← Назад
                </button>
                <div className={styles.pageNumbers}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`${styles.pageNumber} ${currentPage === page ? styles.activePage : ''}`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={styles.pageButton}
                >
                  Вперед →
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
}