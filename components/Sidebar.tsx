'use client';

import { useState } from 'react';
import { categories } from '@/data/exercises';
import styles from './Sidebar.module.css';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [isHovered, setIsHovered] = useState<string | null>(null);

  return (
    <aside className={styles.sidebar}>
      
      <nav className={styles.nav}>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveTab(category.id)}
            onMouseEnter={() => setIsHovered(category.id)}
            onMouseLeave={() => setIsHovered(null)}
            className={`${styles.navItem} ${activeTab === category.id ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>{category.icon}</span>
            <span className={styles.navLabel}>{category.label}</span>
            {activeTab === category.id && (
              <span className={styles.navIndicator} />
            )}
          </button>
        ))}
      </nav>
      
      <div className={styles.footer}>
        <div className={styles.version}>v1.0.0</div>
      </div>
    </aside>
  );
}