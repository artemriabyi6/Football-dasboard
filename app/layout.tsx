// app/layout.tsx
import type { Metadata } from 'next';
import Header from '@/components/Header';
import { GoalsProvider } from '@/context/GoalsContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Football Pro - Тренувальний центр',
  description: 'Сучасний тренувальний центр для футболістів',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body>
        <GoalsProvider>
          <Header />
          {children}
        </GoalsProvider>
      </body>
    </html>
  );
}