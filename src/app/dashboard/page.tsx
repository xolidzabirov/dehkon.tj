'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  TrendingUp,
  ArrowRight,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
} from 'lucide-react';
import { useTranslation } from '@/features/i18n';
import { useAppSelector } from '@/shared/store/hooks';
import { orderService } from '@/entities/order';
import { Button, Skeleton, Badge } from '@/shared/ui';
import type { Order } from '@/entities/order';

const ORDER_STATUS_MAP: Record<number, { key: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' | 'warning' }> = {
  0: { key: 'statusPending', variant: 'warning' },
  1: { key: 'statusConfirmed', variant: 'default' },
  2: { key: 'statusPreparing', variant: 'secondary' },
  3: { key: 'statusShipped', variant: 'outline' },
  4: { key: 'statusDelivered', variant: 'default' },
  5: { key: 'statusCancelled', variant: 'destructive' },
};

export default function DashboardPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);

  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    orderService
      .getMy({ PageSize: 5 })
      .then((res) => {
        setRecentOrders(res.items);
        setTotalOrders(res.totalCount);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [isAuthenticated]);

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: 'easeOut' as const },
  };

  if (!isAuthenticated) {
    router.push('/auth');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950 pt-8">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-64 mb-8" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <Skeleton className="lg:col-span-2 h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const statusLabel = (status: number) => {
    const info = ORDER_STATUS_MAP[status] || ORDER_STATUS_MAP[0];
    const label = (t.orders as Record<string, string>)[info.key] || info.key;
    return <Badge variant={info.variant}>{label}</Badge>;
  };

  const stats = [
    { icon: ShoppingBag, label: t.dashboard.totalOrders, value: totalOrders },
    { icon: Package, label: t.dashboard.totalProducts, value: '—' },
    { icon: TrendingUp, label: t.dashboard.revenue, value: '—' },
    { icon: LayoutDashboard, label: t.dashboard.totalSales, value: '—' },
  ];

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <motion.div {...fadeUp} className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-100">
            {t.dashboard.welcome}, {user?.fullName || user?.userName}!
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">{t.dashboard.title}</p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' as const }}
          className="mb-8"
        >
          <h2 className="font-semibold text-surface-900 dark:text-surface-100 mb-4">
            {t.dashboard.quickStats}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3, ease: 'easeOut' as const }}
                className="glass-card rounded-2xl p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30">
                    <stat.icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm text-surface-500 dark:text-surface-400">{stat.label}</p>
                    <p className="text-xl font-bold text-surface-900 dark:text-surface-100">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3, ease: 'easeOut' as const }}
            className="lg:col-span-2"
          >
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-lg text-surface-900 dark:text-surface-100">
                  {t.dashboard.recentOrders}
                </h2>
                <Link href="/dashboard/orders">
                  <Button variant="ghost" size="sm">
                    {t.dashboard.viewAllOrders}
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <p className="text-center text-surface-400 py-8">{t.orders.empty}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-surface-200 dark:border-surface-700">
                        <th className="text-left py-3 text-surface-500 dark:text-surface-400 font-medium">
                          #
                        </th>
                        <th className="text-left py-3 text-surface-500 dark:text-surface-400 font-medium">
                          {t.orders.orderDate}
                        </th>
                        <th className="text-left py-3 text-surface-500 dark:text-surface-400 font-medium">
                          {t.orders.total}
                        </th>
                        <th className="text-left py-3 text-surface-500 dark:text-surface-400 font-medium">
                          {t.orders.status}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-b border-surface-100 dark:border-surface-800 last:border-0"
                        >
                          <td className="py-3 font-medium text-surface-900 dark:text-surface-100">
                            {order.id}
                          </td>
                          <td className="py-3 text-surface-600 dark:text-surface-400">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 font-medium text-surface-900 dark:text-surface-100">
                            {order.totalPrice.toFixed(0)} {t.common.currency}
                          </td>
                          <td className="py-3">{statusLabel(order.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>

          {/* Profile Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.3, ease: 'easeOut' as const }}
          >
            <div className="glass-card rounded-2xl p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-lg text-surface-900 dark:text-surface-100">
                  {t.dashboard.profileInfo}
                </h2>
                <Link href="/dashboard/profile">
                  <Button variant="ghost" size="sm">
                    {t.dashboard.editProfile}
                  </Button>
                </Link>
              </div>

              <div className="flex flex-col items-center mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 mb-3">
                  <User className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="font-semibold text-surface-900 dark:text-surface-100">
                  {user?.fullName}
                </h3>
                <p className="text-sm text-surface-500 dark:text-surface-400">@{user?.userName}</p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-surface-600 dark:text-surface-400">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="truncate">{user?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-surface-600 dark:text-surface-400">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{user?.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-3 text-surface-600 dark:text-surface-400">
                  <Shield className="h-4 w-4 shrink-0" />
                  <span>{t.dashboard.roleName}: {user?.roleName}</span>
                </div>
                <div className="flex items-center gap-3 text-surface-600 dark:text-surface-400">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span>
                    {t.dashboard.memberSince}: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
