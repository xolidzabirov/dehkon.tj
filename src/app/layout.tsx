import type { Metadata, Viewport } from 'next';
import { Providers } from '@/shared/providers';
import { LayoutShell } from '@/widgets/layout';
import './globals.css';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Dehqon.tj — Маркетплейс свежих продуктов Таджикистана',
  description: 'Свежие фрукты, овощи и продукты напрямую от фермеров и продавцов рынков Таджикистана. Быстрая доставка по Душанбе.',
  keywords: ['Deqkon', 'Таджикистан', 'маркетплейс', 'фрукты', 'овощи', 'фермеры', 'рынок', 'доставка'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Dehqon.tj',
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#22c55e',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>
        <Providers>
          <LayoutShell>{children}</LayoutShell>
        </Providers>
        <Script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
