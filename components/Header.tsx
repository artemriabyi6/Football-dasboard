'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>⚽</span>
          <span className={styles.logoText}>Football Pro</span>
        </Link>

        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>Головна</Link>
          <Link href="/" className={styles.navLink}>Тренування</Link>
          <Link href="/theory" className={styles.navLink}>Теорія</Link>
          <Link href="/focus" className={styles.navLink}>Фокус</Link>
          <Link href="/planner" className={styles.navLink}>Планер</Link>
          <Link href="/tactics" className={styles.navLink}>Тактика</Link>

        </nav>

        <div className={styles.actions}>
          <button className={styles.searchButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </button>
          <button className={styles.profileButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </button>
        </div>

        <button 
          className={styles.mobileMenuButton}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {isMobileMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12"/>
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18"/>
            )}
          </svg>
        </button>
      </div>

      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
        <Link href="/" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Головна</Link>
        <Link href="/" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Тренування</Link>
        <Link href="/theory" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Теорія</Link>
        <Link href="/focus" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Фокус</Link>
        <Link href="/planner" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Планер</Link>
        <Link href="/tactics" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Тактика</Link>
      </div>
    </header>
  );
}