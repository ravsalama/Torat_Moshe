import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sinagoga Rambam',
  description: 'Gestión de donativos, congregantes y calendario de Sinagoga Rambam',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
