'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, FolderTree, Users, ShoppingBag,
  Store, Megaphone, Star, Menu, X, ChevronLeft,
  Search, Bell, Sun, Moon, LogOut, ExternalLink,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/shared/store/hooks';
import { fetchCurrentUser, logout } from '@/features/auth';
import { useTheme } from '@/features/theme';
import { cn } from '@/shared/lib/utils';

const ADMIN_LINKS = [
  { href: '/admin', icon: LayoutDashboard, label: 'Главная' },
  { href: '/admin/products', icon: Package, label: 'Товары' },
  { href: '/admin/categories', icon: FolderTree, label: 'Категории' },
  { href: '/admin/users', icon: Users, label: 'Пользователи' },
  { href: '/admin/orders', icon: ShoppingBag, label: 'Заказы' },
  { href: '/admin/markets', icon: Store, label: 'Рынки' },
  { href: '/admin/announcements', icon: Megaphone, label: 'Объявления' },
  { href: '/admin/reviews', icon: Star, label: 'Отзывы' },
];

function isActiveLink(pathname: string, href: string) {
  if (href === '/admin') return pathname === '/admin';
  return pathname.startsWith(href);
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, isLoading } = useAppSelector((s) => s.auth);
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (token && !user && !isLoading) {
      dispatch(fetchCurrentUser());
    }
  }, [token, user, isLoading, dispatch]);

  useEffect(() => {
    if (!isLoading && !token) {
      router.replace('/auth?redirect=/admin');
    }
  }, [token, isLoading, router]);

  useEffect(() => {
    if (!isLoading && user && user.roleName !== 'Admin') {
      router.replace('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/auth');
  };

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-50 dark:bg-surface-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
          <p className="text-sm text-surface-500">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (user.roleName !== 'Admin') {
    return null;
  }

  const displayUser = user;

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className={cn(
        'flex h-16 items-center border-b border-surface-700/50 px-4',
        collapsed ? 'justify-center' : 'gap-3'
      )}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-500 text-white font-bold text-lg">
          D
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="overflow-hidden whitespace-nowrap"
          >
            <span className="text-lg font-bold text-white">Dehkon</span>
            <span className="text-xs text-surface-400 ml-1">Admin</span>
          </motion.div>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {ADMIN_LINKS.map(({ href, icon: Icon, label }) => {
          const active = isActiveLink(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-primary-500/15 text-primary-400'
                  : 'text-surface-400 hover:bg-surface-800 hover:text-surface-200',
                collapsed && 'justify-center px-2'
              )}
            >
              <Icon className={cn(
                'h-5 w-5 shrink-0 transition-colors',
                active ? 'text-primary-400' : 'text-surface-500 group-hover:text-surface-300'
              )} />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-surface-700/50 p-3 space-y-2">
        <Link
          href="/"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-surface-400 hover:bg-surface-800 hover:text-surface-200 transition-colors',
            collapsed && 'justify-center px-2'
          )}
        >
          <ExternalLink className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Вернуться на сайт</span>}
        </Link>
        <button
          onClick={handleLogout}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors',
            collapsed && 'justify-center px-2'
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Выйти</span>}
        </button>

        {/* User info */}
        {!collapsed && (
          <div className="mt-2 flex items-center gap-3 rounded-lg bg-surface-800/50 px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-500/20 text-primary-400 text-sm font-bold">
              {displayUser.fullName?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-surface-200">{displayUser.fullName}</p>
              <p className="truncate text-xs text-surface-500">{displayUser.email}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-surface-50 dark:bg-surface-950">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col bg-surface-900 dark:bg-surface-900 border-r border-surface-800 transition-all duration-300',
          collapsed ? 'w-[72px]' : 'w-64'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-surface-900 lg:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-4 rounded-lg p-1.5 text-surface-400 hover:bg-surface-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 px-4 lg:px-6">
          {/* Mobile menu + collapse toggle */}
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden rounded-lg p-2 text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 lg:flex"
          >
            <ChevronLeft className={cn('h-5 w-5 transition-transform', collapsed && 'rotate-180')} />
          </button>

          {/* Search */}
          <div className="relative hidden sm:block flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск..."
              className="h-9 w-full rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 pl-9 pr-4 text-sm text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Notifications */}
            <button className="relative rounded-lg p-2 text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary-500" />
            </button>

            {/* User avatar */}
            <div className="hidden sm:flex items-center gap-2 ml-2 pl-2 border-l border-surface-200 dark:border-surface-700">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-sm font-bold">
                {displayUser.fullName?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="text-sm">
                <p className="font-medium text-surface-900 dark:text-surface-100">{displayUser.fullName}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' as const }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
