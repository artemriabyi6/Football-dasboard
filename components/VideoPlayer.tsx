'use client';

import { useState } from 'react';
import styles from './VideoPlayer.module.css';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  thumbnail?: string;
}

export default function VideoPlayer({ videoUrl, title, thumbnail }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
  const isLocal = videoUrl.startsWith('/videos/') || videoUrl.startsWith('/');

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <div className={styles.player}>
      {!isPlaying ? (
        <div className={styles.placeholder} onClick={handlePlay}>
          {thumbnail && (
            <img 
              src={thumbnail} 
              alt={title}
              className={styles.thumbnail}
            />
          )}
          <div className={styles.playOverlay}>
            <div className={styles.playButton}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
          <div className={styles.titleOverlay}>
            <span>{title}</span>
          </div>
        </div>
      ) : (
        <div className={styles.videoContainer}>
          {isYouTube ? (
            <iframe
              src={videoUrl}
              title={title}
              className={styles.iframe}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={videoUrl}
              controls
              autoPlay
              className={styles.video}
              controlsList="nodownload"
            />
          )}
        </div>
      )}
    </div>
  );
}