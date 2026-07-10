'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VideoGrid from '@/components/VideoGrid';
import { exercisesData } from '@/data/exercises';
import styles from './page.module.css';

export default function Home() {
  const [activeTab, setActiveTab] = useState('finishing');

  return (
    <div className={styles.container}>
      <Header />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className={styles.main}>
        <div className={styles.content}>
          <VideoGrid exercises={exercisesData[activeTab] || []} />
        </div>
        <Footer />
      </main>
    </div>
  );
}