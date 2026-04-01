'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Package, Users, ShoppingBag, TrendingUp,
  ArrowUpRight, ArrowDownRight, Eye,
} from 'lucide-react';
import { productService } from '@/entities/product';
import { userService } from '@/entities/user';
import { orderService } from '@/entities/order';
import { cn } from '@/shared/lib/utils';
import type { Product } from '@/entities/product';
import type { User } from '@/entities/user';
import type { Order } from '@/entities/order';

export const dynamic = 'force-dynamic';

const ORDER_STATUS_LABELS: Record<number, string> = {
  0: 'Ожидает',
  1: 'Подтверждён',
  2: 'Готовится',
  3: 'Отправлен',
  4: 'Доставлен',
  5: 'Отменён',
};

const ORDER_STATUS_COLORS: Record<number, string> = {
  0: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  1: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  2: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  3: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  4: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  5: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ElementType;
  trend: number;
  color: string;
  bg: string;
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'TJS', maximumFractionDigits: 0 }).format(n);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [productsRaw, usersRaw, ordersRaw] = await Promise.all([
          productService.getAll({ PageSize: 1 }).catch(() => null),
          userService.getAll({ PageSize: 5 }).catch(() => null),
          orderService.getAll({ PageSize: 5 }).catch(() => null),
        ]);

        const productCount = productsRaw?.totalCount ?? (Array.isArray(productsRaw) ? (productsRaw as unknown as Product[]).length : 0);
        const usersArr = Array.isArray(usersRaw) ? usersRaw : Array.isArray(usersRaw?.items) ? usersRaw.items : [];
        const userCount = usersRaw?.totalCount ?? usersArr.length;
        const ordersArr = Array.isArray(ordersRaw) ? ordersRaw : Array.isArray(ordersRaw?.items) ? ordersRaw.items : [];
        const orderCount = ordersRaw?.totalCount ?? ordersArr.length;
        const revenue = ordersArr.reduce((sum: number, o: Order) => sum + (o.totalPrice || 0), 0);

        setStats([
          { label: 'Всего товаров', value: productCount, icon: Package, trend: 12.5, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
          { label: 'Пользователей', value: userCount, icon: Users, trend: 8.2, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
          { label: 'Заказов', value: orderCount, icon: ShoppingBag, trend: -3.1, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' },
          { label: 'Выручка', value: formatCurrency(revenue), icon: TrendingUp, trend: 15.7, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' },
        ]);

        setRecentOrders(ordersArr.slice(0, 5));
        setRecentUsers(usersArr.slice(0, 5));
      } catch (err: any) {
        setError(err?.message || 'Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-red-500 text-lg mb-2">Ошибка</p>
        <p className="text-surface-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Панель управления</h1>
        <p className="text-sm text-surface-500 mt-1">Обзор основных показателей</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-surface-200 dark:bg-surface-800" />
            ))
          : stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, ease: 'easeOut' as const }}
                className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-5"
              >
                <div className="flex items-center justify-between">
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', stat.bg)}>
                    <stat.icon className={cn('h-5 w-5', stat.color)} />
                  </div>
                  <div className={cn(
                    'flex items-center gap-0.5 text-xs font-medium',
                    stat.trend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'
                  )}>
                    {stat.trend >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                    {Math.abs(stat.trend)}%
                  </div>
                </div>
                <p className="mt-3 text-2xl font-bold text-surface-900 dark:text-surface-100">{stat.value}</p>
                <p className="text-sm text-surface-500 mt-0.5">{stat.label}</p>
              </motion.div>
            ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, ease: 'easeOut' as const }}
          className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900"
        >
          <div className="flex items-center justify-between border-b border-surface-200 dark:border-surface-800 px-5 py-4">
            <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">Последние заказы</h2>
            <Link href="/admin/orders" className="text-sm text-primary-500 hover:text-primary-600 font-medium">
              Все заказы →
            </Link>
          </div>
          <div className="divide-y divide-surface-100 dark:divide-surface-800">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  <div className="h-10 w-10 animate-pulse rounded-full bg-surface-200 dark:bg-surface-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 animate-pulse rounded bg-surface-200 dark:bg-surface-700" />
                    <div className="h-3 w-20 animate-pulse rounded bg-surface-200 dark:bg-surface-700" />
                  </div>
                </div>
              ))
            ) : recentOrders.length === 0 ? (
              <div className="px-5 py-10 text-center text-surface-400">Нет заказов</div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-100 dark:bg-surface-800 text-sm font-bold text-surface-600 dark:text-surface-300">
                    #{order.id}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-surface-900 dark:text-surface-100">{order.buyerName}</p>
                    <p className="text-xs text-surface-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium', ORDER_STATUS_COLORS[order.status] || ORDER_STATUS_COLORS[0])}>
                    {ORDER_STATUS_LABELS[order.status] || 'Неизвестно'}
                  </span>
                  <p className="text-sm font-semibold text-surface-900 dark:text-surface-100 whitespace-nowrap">
                    {formatCurrency(order.totalPrice)}
                  </p>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Users */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, ease: 'easeOut' as const }}
          className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900"
        >
          <div className="flex items-center justify-between border-b border-surface-200 dark:border-surface-800 px-5 py-4">
            <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">Новые пользователи</h2>
            <Link href="/admin/users" className="text-sm text-primary-500 hover:text-primary-600 font-medium">
              Все пользователи →
            </Link>
          </div>
          <div className="divide-y divide-surface-100 dark:divide-surface-800">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  <div className="h-10 w-10 animate-pulse rounded-full bg-surface-200 dark:bg-surface-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 animate-pulse rounded bg-surface-200 dark:bg-surface-700" />
                    <div className="h-3 w-20 animate-pulse rounded bg-surface-200 dark:bg-surface-700" />
                  </div>
                </div>
              ))
            ) : recentUsers.length === 0 ? (
              <div className="px-5 py-10 text-center text-surface-400">Нет пользователей</div>
            ) : (
              recentUsers.map((u) => (
                <div key={u.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-sm font-bold">
                    {u.fullName?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-surface-900 dark:text-surface-100">{u.fullName}</p>
                    <p className="truncate text-xs text-surface-500">{u.email}</p>
                  </div>
                  <span className="inline-flex rounded-full bg-surface-100 dark:bg-surface-800 px-2.5 py-0.5 text-xs font-medium text-surface-600 dark:text-surface-300">
                    {u.roleName}
                  </span>
                  <Link
                    href={`/admin/users`}
                    className="rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-600 dark:hover:text-surface-200"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
