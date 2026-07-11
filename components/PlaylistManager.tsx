// components/PlaylistManager.tsx
'use client';

import { useState, useRef } from 'react';
import { Playlist, VideoFile } from '@/types';
import VideoViewer from './VideoViewer';
import styles from './PlaylistManager.module.css';

interface PlaylistManagerProps {
  playlists: Playlist[];
  videos: VideoFile[];
  onAddPlaylist: (name: string, description?: string) => void;
  onEditPlaylist: (id: string, name: string, description?: string) => void;
  onDeletePlaylist: (id: string) => void;
  onAddVideoToPlaylist: (playlistId: string, videoId: string) => void;
  onRemoveVideoFromPlaylist: (playlistId: string, videoId: string) => void;
  onAddVideo: (file: File) => void;
  onDeleteVideo: (videoId: string) => void;
}

export default function PlaylistManager({
  playlists,
  videos,
  onAddPlaylist,
  onEditPlaylist,
  onDeletePlaylist,
  onAddVideoToPlaylist,
  onRemoveVideoFromPlaylist,
  onAddVideo,
  onDeleteVideo,
}: PlaylistManagerProps) {
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [showVideoUpload, setShowVideoUpload] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('video/')) {
        onAddVideo(file);
      }
    }
    setShowVideoUpload(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const getPlaylistVideos = (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return [];
    return videos.filter(v => playlist.videoIds.includes(v.id));
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>🎬 Плейлисти</h3>
        <button 
          className={styles.addButton}
          onClick={() => setShowCreatePlaylist(!showCreatePlaylist)}
        >
          {showCreatePlaylist ? '✕' : '+ Новий плейлист'}
        </button>
      </div>

      {showCreatePlaylist && (
        <div className={styles.createForm}>
          <input
            type="text"
            placeholder="Назва плейлиста"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Опис (опціонально)"
            value={newPlaylistDescription}
            onChange={(e) => setNewPlaylistDescription(e.target.value)}
            className={styles.input}
          />
          <div className={styles.formActions}>
            <button 
              className={styles.cancelButton}
              onClick={() => {
                setShowCreatePlaylist(false);
                setNewPlaylistName('');
                setNewPlaylistDescription('');
              }}
            >
              Скасувати
            </button>
            <button 
              className={styles.saveButton}
              onClick={() => {
                if (newPlaylistName.trim()) {
                  onAddPlaylist(newPlaylistName.trim(), newPlaylistDescription.trim());
                  setNewPlaylistName('');
                  setNewPlaylistDescription('');
                  setShowCreatePlaylist(false);
                }
              }}
              disabled={!newPlaylistName.trim()}
            >
              Створити
            </button>
          </div>
        </div>
      )}

      <div className={styles.uploadSection}>
        <button 
          className={styles.uploadButton}
          onClick={() => setShowVideoUpload(!showVideoUpload)}
        >
          {showVideoUpload ? '✕ Закрити' : '📤 Додати відео'}
        </button>
        
        {showVideoUpload && (
          <div 
            className={`${styles.uploadArea} ${isDragging ? styles.dragging : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className={styles.uploadContent}>
              <span className={styles.uploadIcon}>🎥</span>
              <p>Перетягніть відеофайли сюди або</p>
              <button 
                className={styles.uploadFileButton}
                onClick={() => fileInputRef.current?.click()}
              >
                Оберіть файли
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        )}
      </div>

      {playlists.length === 0 && videos.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Немає плейлистів та відео</p>
          <p className={styles.emptySubtext}>Створіть плейлист та додайте відео</p>
        </div>
      ) : (
        <div className={styles.playlistsGrid}>
          {playlists.map(playlist => {
            const playlistVideos = getPlaylistVideos(playlist.id);
            const isEditing = editingPlaylistId === playlist.id;

            return (
              <div key={playlist.id} className={styles.playlistCard}>
                <div className={styles.playlistHeader}>
                  {isEditing ? (
                    <div className={styles.editForm}>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className={styles.editInput}
                        placeholder="Назва"
                      />
                      <input
                        type="text"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className={styles.editInput}
                        placeholder="Опис"
                      />
                      <div className={styles.editActions}>
                        <button 
                          className={styles.saveButton}
                          onClick={() => {
                            if (editName.trim()) {
                              onEditPlaylist(playlist.id, editName.trim(), editDescription.trim());
                              setEditingPlaylistId(null);
                              setEditName('');
                              setEditDescription('');
                            }
                          }}
                        >
                          💾
                        </button>
                        <button 
                          className={styles.cancelButton}
                          onClick={() => {
                            setEditingPlaylistId(null);
                            setEditName('');
                            setEditDescription('');
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className={styles.playlistInfo}>
                        <h4 className={styles.playlistName}>{playlist.name}</h4>
                        {playlist.description && (
                          <p className={styles.playlistDescription}>{playlist.description}</p>
                        )}
                        <span className={styles.videoCount}>
                          {playlistVideos.length} {playlistVideos.length === 1 ? 'відео' : 'відео'}
                        </span>
                      </div>
                      <div className={styles.playlistActions}>
                        <button 
                          className={styles.editPlaylistButton}
                          onClick={() => {
                            setEditingPlaylistId(playlist.id);
                            setEditName(playlist.name);
                            setEditDescription(playlist.description || '');
                          }}
                        >
                          ✏️
                        </button>
                        <button 
                          className={styles.deletePlaylistButton}
                          onClick={() => {
                            if (confirm(`Ви впевнені, що хочете видалити плейлист "${playlist.name}"?`)) {
                              onDeletePlaylist(playlist.id);
                            }
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <div className={styles.playlistContent}>
                  <div className={styles.videoGrid}>
                    {playlistVideos.map(video => (
                      <div 
                        key={video.id} 
                        className={styles.videoItem}
                        onClick={() => setSelectedVideo(video)}
                      >
                        <div className={styles.videoThumbnail}>
                          {video.thumbnail ? (
                            <img src={video.thumbnail} alt={video.name} />
                          ) : (
                            <div className={styles.videoPlaceholder}>
                              <span>🎬</span>
                            </div>
                          )}
                        </div>
                        <div className={styles.videoInfo}>
                          <span className={styles.videoName}>{video.name}</span>
                          <span className={styles.videoSize}>{formatFileSize(video.size)}</span>
                        </div>
                        <button 
                          className={styles.removeVideoButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveVideoFromPlaylist(playlist.id, video.id);
                          }}
                          title="Видалити з плейлиста"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    
                    <button 
                      className={styles.addVideoButton}
                      onClick={() => setSelectedPlaylist(selectedPlaylist === playlist.id ? null : playlist.id)}
                    >
                      {selectedPlaylist === playlist.id ? '✕ Закрити' : '+ Додати відео'}
                    </button>
                  </div>

                  {selectedPlaylist === playlist.id && (
                    <div className={styles.videoSelector}>
                      <div className={styles.availableVideos}>
                        <h5>Доступні відео</h5>
                        {videos.filter(v => !playlist.videoIds.includes(v.id)).length === 0 ? (
                          <p className={styles.noVideos}>Немає доступних відео</p>
                        ) : (
                          <div className={styles.videoList}>
                            {videos
                              .filter(v => !playlist.videoIds.includes(v.id))
                              .map(video => (
                                <button
                                  key={video.id}
                                  className={styles.videoSelectItem}
                                  onClick={() => onAddVideoToPlaylist(playlist.id, video.id)}
                                >
                                  <span>{video.name}</span>
                                  <span className={styles.addVideoIcon}>+</span>
                                </button>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Відео без плейлиста */}
                {playlists.indexOf(playlist) === playlists.length - 1 && videos.filter(v => 
                  !playlists.some(p => p.videoIds.includes(v.id))
                ).length > 0 && (
                  <div className={styles.orphanVideos}>
                    <h5 className={styles.orphanTitle}>📁 Відео без плейлиста</h5>
                    <div className={styles.orphanGrid}>
                      {videos
                        .filter(v => !playlists.some(p => p.videoIds.includes(v.id)))
                        .map(video => (
                          <div 
                            key={video.id} 
                            className={styles.orphanVideo}
                            onClick={() => setSelectedVideo(video)}
                          >
                            <span>{video.name}</span>
                            <button 
                              className={styles.deleteVideoButton}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Видалити відео "${video.name}"?`)) {
                                  onDeleteVideo(video.id);
                                }
                              }}
                            >
                              🗑️
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Модальне вікно для перегляду відео */}
      {selectedVideo && (
        <div className={styles.modalOverlay} onClick={() => setSelectedVideo(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{selectedVideo.name}</h3>
              <button 
                className={styles.closeModal}
                onClick={() => setSelectedVideo(null)}
              >
                ✕
              </button>
            </div>
            <VideoViewer
              videoUrl={selectedVideo.url}
              videoName={selectedVideo.name}
              onClose={() => setSelectedVideo(null)}
              autoPlay={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}