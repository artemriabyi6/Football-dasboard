// app/theory/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import TheoryForm from '../../components/TheoryForm';
import TheoryCard from '../../components/TheoryCard';
import PlaylistManager from '@/components/PlaylistManager';
import Header from '@/components/Header';
import { Theory, Playlist, VideoFile } from '@/types';
import { initialTheoryData } from '@/data/theoryData';
import styles from './page.module.css';

export default function TheoryPage() {
  const [theories, setTheories] = useState<Theory[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTheory, setEditingTheory] = useState<Theory | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 4;

  // Стани для плейлистів
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [videos, setVideos] = useState<VideoFile[]>([]);

  // Завантаження даних з localStorage
  useEffect(() => {
    const saved = localStorage.getItem('theories');
    if (saved) {
      try {
        setTheories(JSON.parse(saved));
      } catch {
        setTheories(initialTheoryData);
      }
    } else {
      setTheories(initialTheoryData);
      localStorage.setItem('theories', JSON.stringify(initialTheoryData));
    }

    // Завантаження плейлистів
    const savedPlaylists = localStorage.getItem('playlists');
    if (savedPlaylists) {
      try {
        setPlaylists(JSON.parse(savedPlaylists));
      } catch {
        setPlaylists([]);
      }
    }

    // Завантаження відео
    const savedVideos = localStorage.getItem('videos');
    if (savedVideos) {
      try {
        setVideos(JSON.parse(savedVideos));
      } catch {
        setVideos([]);
      }
    }
  }, []);

  // Збереження даних
  useEffect(() => {
    if (theories.length > 0) {
      localStorage.setItem('theories', JSON.stringify(theories));
    }
  }, [theories]);

  useEffect(() => {
    if (playlists.length > 0) {
      localStorage.setItem('playlists', JSON.stringify(playlists));
    } else {
      localStorage.removeItem('playlists');
    }
  }, [playlists]);

  useEffect(() => {
    if (videos.length > 0) {
      localStorage.setItem('videos', JSON.stringify(videos));
    } else {
      localStorage.removeItem('videos');
    }
  }, [videos]);

  // Фільтрація за пошуком
  const filteredTheories = useMemo(() => {
    if (!searchQuery.trim()) return theories;
    
    const query = searchQuery.toLowerCase().trim();
    return theories.filter(t => 
      t.title.toLowerCase().includes(query) ||
      t.match.toLowerCase().includes(query) ||
      t.date.includes(query)
    );
  }, [theories, searchQuery]);

  // Пагінація (4 картки на сторінку)
  const totalPages = Math.ceil(filteredTheories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTheories = filteredTheories.slice(startIndex, startIndex + itemsPerPage);

  // Скидаємо сторінку при зміні пошуку
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Функції для роботи з теоріями
  const addTheory = (theory: Omit<Theory, 'id' | 'createdAt'>) => {
    const newTheory: Theory = {
      ...theory,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTheories([newTheory, ...theories]);
    setShowForm(false);
    setSearchQuery('');
  };

  const updateTheory = (id: string, updatedTheory: Partial<Theory>) => {
    setTheories(theories.map(t => 
      t.id === id 
        ? { ...t, ...updatedTheory, updatedAt: new Date().toISOString() }
        : t
    ));
    setEditingTheory(null);
    setShowForm(false);
  };

  const deleteTheory = (id: string) => {
    if (confirm('Ви впевнені, що хочете видалити цей аналіз?')) {
      setTheories(theories.filter(t => t.id !== id));
    }
  };

  const startEdit = (theory: Theory) => {
    setEditingTheory(theory);
    setShowForm(true);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Функції для роботи з плейлистами
  const addPlaylist = (name: string, description?: string) => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      description,
      videoIds: [],
      createdAt: new Date().toISOString(),
    };
    setPlaylists([...playlists, newPlaylist]);
  };

  const editPlaylist = (id: string, name: string, description?: string) => {
    setPlaylists(playlists.map(p => 
      p.id === id 
        ? { ...p, name, description, updatedAt: new Date().toISOString() }
        : p
    ));
  };

  const deletePlaylist = (id: string) => {
    if (confirm('Ви впевнені, що хочете видалити цей плейлист?')) {
      setPlaylists(playlists.filter(p => p.id !== id));
    }
  };

  const addVideoToPlaylist = (playlistId: string, videoId: string) => {
    setPlaylists(playlists.map(p => 
      p.id === playlistId && !p.videoIds.includes(videoId)
        ? { ...p, videoIds: [...p.videoIds, videoId], updatedAt: new Date().toISOString() }
        : p
    ));
  };

  const removeVideoFromPlaylist = (playlistId: string, videoId: string) => {
    setPlaylists(playlists.map(p => 
      p.id === playlistId
        ? { ...p, videoIds: p.videoIds.filter(id => id !== videoId), updatedAt: new Date().toISOString() }
        : p
    ));
  };

  const addVideo = (file: File) => {
    const video: VideoFile = {
      id: Date.now().toString(),
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
      uploadedAt: new Date().toISOString(),
    };
    setVideos([...videos, video]);
  };

  const deleteVideo = (videoId: string) => {
    if (confirm('Ви впевнені, що хочете видалити це відео?')) {
      setVideos(videos.filter(v => v.id !== videoId));
      // Також видаляємо з плейлистів
      setPlaylists(playlists.map(p => ({
        ...p,
        videoIds: p.videoIds.filter(id => id !== videoId)
      })));
    }
  };

  return (
    <div className={styles.container}>
      <Header />
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

      {/* Пошук */}
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
              (data) => updateTheory(editingTheory.id, data) : 
              addTheory
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
                onEdit={startEdit}
                onDelete={deleteTheory}
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

      {/* Плейлисти */}
      <PlaylistManager
        playlists={playlists}
        videos={videos}
        onAddPlaylist={addPlaylist}
        onEditPlaylist={editPlaylist}
        onDeletePlaylist={deletePlaylist}
        onAddVideoToPlaylist={addVideoToPlaylist}
        onRemoveVideoFromPlaylist={removeVideoFromPlaylist}
        onAddVideo={addVideo}
        onDeleteVideo={deleteVideo}
      />
    </div>
  );
}