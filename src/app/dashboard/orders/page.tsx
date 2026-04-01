'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Package,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
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

export default function OrdersPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  const [orders, setOrders] = useState<Order[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    orderService
      .getMy({ PageSize: 10, PageNumber: page })
      .then((res) => {
        setOrders(res.items);
        setTotalPages(res.totalPages);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [isAuthenticated, page]);

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: 'easeOut' as const },
  };

  if (!isAuthenticated) {
    router.push('/auth');
    return null;
  }

  const statusLabel = (status: number) => {
    const info = ORDER_STATUS_MAP[status] || ORDER_STATUS_MAP[0];
    const label = (t.orders as Record<string, string>)[info.key] || info.key;
    return <Badge variant={info.variant}>{label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950 pt-8">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <div className="container mx-auto px-4 py-8">
        <motion.h1 {...fadeUp} className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-100 mb-8">
          {t.orders.title}
        </motion.h1>

        {orders.length === 0 ? (
          <motion.div {...fadeUp} className="text-center py-20">
            <Package className="mx-auto h-20 w-20 text-surface-300 dark:text-surface-600 mb-4" />
            <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
              {t.orders.empty}
            </h2>
            <Button onClick={() => router.push('/catalog')} className="mt-4">
              {t.cart.continueShopping}
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3, ease: 'easeOut' as const }}
                className="glass-card rounded-2xl overflow-hidden"
              >
                {/* Order header */}
                <button
                  onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                  className="w-full p-5 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30 shrink-0">
                      <Package className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-semibold text-surface-900 dark:text-surface-100">
                          #{order.id}
                        </span>
                        {statusLabel(order.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-surface-500 dark:text-surface-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          <span className="truncate max-w-[200px]">{order.deliveryAddress}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="font-bold text-primary-600 dark:text-primary-400">
                      {order.totalPrice.toFixed(0)} {t.common.currency}
                    </span>
                    {expandedId === order.id ? (
                      <ChevronUp className="h-5 w-5 text-surface-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-surface-400" />
                    )}
                  </div>
                </button>

                {/* Expanded items */}
                {expandedId === order.id && (
                  <div className="border-t border-surface-200 dark:border-surface-700 px-5 pb-5">
                    <h4 className="text-sm font-medium text-surface-500 dark:text-surface-400 py-3">
                      {t.orders.items}
                    </h4>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between py-2 text-sm"
                        >
                          <div className="min-w-0">
                            <p className="font-medium text-surface-900 dark:text-surface-100 truncate">
                              {item.productName}
                            </p>
                            <p className="text-surface-500 dark:text-surface-400">
                              {item.quantityKg} {t.common.kg} × {item.pricePerKg.toFixed(0)} {t.common.currency}
                            </p>
                          </div>
                          <span className="font-medium text-surface-900 dark:text-surface-100 shrink-0 ml-4">
                            {item.totalPrice.toFixed(0)} {t.common.currency}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`h-10 w-10 rounded-xl text-sm font-medium transition-colors ${
                      p === page
                        ? 'bg-primary-600 text-white'
                        : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
