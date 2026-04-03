'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/features/i18n';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-surface-200 dark:border-surface-700 bg-surface-900 dark:bg-surface-950 text-surface-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="text-2xl font-bold gradient-text">Dehqon.tj</span>
            <p className="mt-3 text-sm text-surface-400">{t.footer.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-surface-100">
              {t.nav.products}
            </h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/catalog" className="text-sm text-surface-400 transition-colors hover:text-primary-400">{t.nav.products}</Link></li>
              <li><Link href="/catalog?category=fruits" className="text-sm text-surface-400 transition-colors hover:text-primary-400">{t.categories.fruits}</Link></li>
              <li><Link href="/catalog?category=vegetables" className="text-sm text-surface-400 transition-colors hover:text-primary-400">{t.categories.vegetables}</Link></li>
              <li><Link href="/catalog?category=dairy" className="text-sm text-surface-400 transition-colors hover:text-primary-400">{t.categories.dairy}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-surface-100">
              {t.about.title}
            </h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/about" className="text-sm text-surface-400 transition-colors hover:text-primary-400">{t.nav.about}</Link></li>
              <li><Link href="/contact" className="text-sm text-surface-400 transition-colors hover:text-primary-400">{t.nav.contact}</Link></li>
              <li><Link href="/faq" className="text-sm text-surface-400 transition-colors hover:text-primary-400">{t.footer.faq}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-surface-100">
              {t.footer.legal}
            </h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/privacy" className="text-sm text-surface-400 transition-colors hover:text-primary-400">{t.footer.privacy}</Link></li>
              <li><Link href="/terms" className="text-sm text-surface-400 transition-colors hover:text-primary-400">{t.footer.terms}</Link></li>
              <li><Link href="/help" className="text-sm text-surface-400 transition-colors hover:text-primary-400">{t.footer.helpCenter}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-surface-800 pt-8 text-center">
          <p className="text-sm text-surface-500">{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
