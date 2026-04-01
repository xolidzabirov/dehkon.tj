'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  Package, Loader2, AlertTriangle, Calendar,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { cn } from '@/shared/lib/utils';
import { orderService } from '@/entities/order';
import type { Order } from '@/entities/order';

const PAGE_SIZE = 10;

const ORDER_STATUS: Record<number, { label: string; color: string }> = {
  1: { label: 'Новый', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  2: { label: 'Подтверждён', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400' },
  3: { label: 'В обработке', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  4: { label: 'Собран', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
  5: { label: 'В доставке', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  6: { label: 'Доставлен', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  7: { label: 'Завершён', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  8: { label: 'Отменён', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState<number | ''>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, unknown> = { PageSize: PAGE_SIZE, PageNumber: page };
      if (statusFilter !== '') params.Status = statusFilter;
      if (dateFrom) params.DateFrom = dateFrom;
      if (dateTo) params.DateTo = dateTo;
      const raw = await orderService.getAll(params as never);
      const items = Array.isArray(raw) ? raw : Array.isArray(raw?.items) ? raw.items : [];
      const count = Array.isArray(raw) ? raw.length : (raw?.totalCount ?? 0);
      setOrders(items);
      setTotalCount(count);
    } catch {
      setError('Не удалось загрузить заказы');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, dateFrom, dateTo]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusChange = async (orderId: number, newStatus: number) => {
    setUpdatingStatus(orderId);
    try {
      await orderService.updateStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch {
      setError('Не удалось обновить статус заказа');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch { return d; }
  };

  const formatCurrency = (n: number) => `${n.toLocaleString('ru-RU')} сом.`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Заказы</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
            Управление заказами и статусами
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value ? Number(e.target.value) : ''); setPage(1); }}
            className="h-11 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 px-3 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Все статусы</option>
            {Object.entries(ORDER_STATUS).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-surface-400 shrink-0" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
              className="h-11 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 px-3 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="От"
            />
            <span className="text-surface-400">—</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
              className="h-11 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 px-3 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="До"
            />
          </div>
          {(statusFilter !== '' || dateFrom || dateTo) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setStatusFilter(''); setDateFrom(''); setDateTo(''); setPage(1); }}
            >
              Сбросить
            </Button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3 text-red-700 dark:text-red-400">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-800/50">
                <th className="text-left px-4 py-3 font-medium text-surface-500 dark:text-surface-400 w-8" />
                <th className="text-left px-4 py-3 font-medium text-surface-500 dark:text-surface-400">ID</th>
                <th className="text-left px-4 py-3 font-medium text-surface-500 dark:text-surface-400">Покупатель</th>
                <th className="text-left px-4 py-3 font-medium text-surface-500 dark:text-surface-400 hidden md:table-cell">Продавец</th>
                <th className="text-left px-4 py-3 font-medium text-surface-500 dark:text-surface-400 hidden lg:table-cell">Адрес</th>
                <th className="text-left px-4 py-3 font-medium text-surface-500 dark:text-surface-400">Статус</th>
                <th className="text-right px-4 py-3 font-medium text-surface-500 dark:text-surface-400">Сумма</th>
                <th className="text-left px-4 py-3 font-medium text-surface-500 dark:text-surface-400 hidden sm:table-cell">Дата</th>
                <th className="text-left px-4 py-3 font-medium text-surface-500 dark:text-surface-400">Изменить статус</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-surface-100 dark:border-surface-800">
                    {Array.from({ length: 9 }).map((__, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-surface-200 dark:bg-surface-700 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-surface-400">
                    Заказы не найдены
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <React.Fragment key={order.id}>
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={cn(
                        'border-b border-surface-100 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors cursor-pointer',
                        expandedId === order.id && 'bg-surface-50 dark:bg-surface-800/30'
                      )}
                      onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                    >
                      <td className="px-4 py-3">
                        {expandedId === order.id ? (
                          <ChevronUp className="h-4 w-4 text-surface-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-surface-400" />
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-surface-600 dark:text-surface-300">#{order.id}</td>
                      <td className="px-4 py-3 font-medium text-surface-900 dark:text-surface-100">{order.buyerName}</td>
                      <td className="px-4 py-3 text-surface-600 dark:text-surface-300 hidden md:table-cell">{order.sellerName}</td>
                      <td className="px-4 py-3 text-surface-600 dark:text-surface-300 hidden lg:table-cell max-w-[200px] truncate">{order.deliveryAddress}</td>
                      <td className="px-4 py-3">
                        <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', ORDER_STATUS[order.status]?.color || 'bg-surface-100 text-surface-600')}>
                          {ORDER_STATUS[order.status]?.label || `Статус ${order.status}`}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-surface-900 dark:text-surface-100 whitespace-nowrap">
                        {formatCurrency(order.totalPrice)}
                      </td>
                      <td className="px-4 py-3 text-surface-500 dark:text-surface-400 hidden sm:table-cell whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
                          {updatingStatus === order.id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-primary-500" />
                          ) : (
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, Number(e.target.value))}
                              className="h-8 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 px-2 text-xs text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                              {Object.entries(ORDER_STATUS).map(([k, v]) => (
                                <option key={k} value={k}>{v.label}</option>
                              ))}
                            </select>
                          )}
                        </div>
                      </td>
                    </motion.tr>

                    {/* Expanded Row — Order Items */}
                    <AnimatePresence>
                      {expandedId === order.id && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2, ease: 'easeOut' as const }}
                        >
                          <td colSpan={9} className="px-4 py-0">
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="py-4 pl-8"
                            >
                              <h4 className="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-3 flex items-center gap-2">
                                <Package className="h-4 w-4 text-primary-500" />
                                Товары в заказе
                              </h4>
                              {order.items && order.items.length > 0 ? (
                                <div className="bg-surface-50 dark:bg-surface-800/50 rounded-lg overflow-hidden">
                                  <table className="w-full text-sm">
                                    <thead>
                                      <tr className="border-b border-surface-200 dark:border-surface-700">
                                        <th className="text-left px-3 py-2 text-xs font-medium text-surface-400">Товар</th>
                                        <th className="text-right px-3 py-2 text-xs font-medium text-surface-400">Цена/кг</th>
                                        <th className="text-right px-3 py-2 text-xs font-medium text-surface-400">Кол-во (кг)</th>
                                        <th className="text-right px-3 py-2 text-xs font-medium text-surface-400">Сумма</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {order.items.map((item) => (
                                        <tr key={item.id} className="border-b border-surface-100 dark:border-surface-800 last:border-0">
                                          <td className="px-3 py-2 text-surface-900 dark:text-surface-100">{item.productName}</td>
                                          <td className="px-3 py-2 text-right text-surface-600 dark:text-surface-300">{formatCurrency(item.pricePerKg)}</td>
                                          <td className="px-3 py-2 text-right text-surface-600 dark:text-surface-300">{item.quantityKg}</td>
                                          <td className="px-3 py-2 text-right font-medium text-surface-900 dark:text-surface-100">{formatCurrency(item.totalPrice)}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <p className="text-sm text-surface-400">Нет данных о товарах</p>
                              )}
                              {order.courierName && (
                                <p className="mt-3 text-sm text-surface-500">
                                  Курьер: <span className="font-medium text-surface-900 dark:text-surface-100">{order.courierName}</span>
                                </p>
                              )}
                            </motion.div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-surface-200 dark:border-surface-800">
            <p className="text-sm text-surface-500">
              Страница {page} из {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={cn(
                      'h-8 w-8 rounded-lg text-sm font-medium transition-colors',
                      page === pageNum
                        ? 'bg-primary-500 text-white'
                        : 'text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800'
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
