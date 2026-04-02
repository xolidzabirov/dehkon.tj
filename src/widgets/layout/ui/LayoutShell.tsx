'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';

const noShellRoutes = ['/auth', '/dashboard', '/admin'];

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideShell = noShellRoutes.some((route) => pathname.startsWith(route));

  if (hideShell) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
