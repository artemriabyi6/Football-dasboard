import type { Metadata } from 'next';
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
      <body>{children}</body>
    </html>
  );
}