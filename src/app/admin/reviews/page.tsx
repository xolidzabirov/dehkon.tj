'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Trash2, ChevronLeft, ChevronRight,
  AlertTriangle, MessageSquare,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { cn } from '@/shared/lib/utils';
import { reviewService } from '@/entities/review';
import type { Review } from '@/entities/review';

const PAGE_SIZE = 10;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            'h-4 w-4',
            i < rating
              ? 'fill-amber-400 text-amber-400'
              : 'fill-surface-200 text-surface-200 dark:fill-surface-700 dark:text-surface-700'
          )}
        />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [ratingFilter, setRatingFilter] = useState<number | ''>('');
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);
  const [deleting, setDeleting] = useState(false);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, unknown> = { PageSize: PAGE_SIZE, PageNumber: page };
      if (ratingFilter !== '') params.Rating = ratingFilter;
      const raw = await reviewService.getAll(params as never);
      const items = Array.isArray(raw) ? raw : Array.isArray(raw?.items) ? raw.items : [];
      const count = Array.isArray(raw) ? raw.length : (raw?.totalCount ?? 0);
      setReviews(items);
      setTotalCount(count);
    } catch {
      setError('Не удалось загрузить отзывы');
    } finally {
      setLoading(false);
    }
  }, [page, ratingFilter]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await reviewService.delete(deleteTarget.id);
      setDeleteTarget(null);
      fetchReviews();
    } catch {
      setError('Не удалось удалить отзыв');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }); } catch { return d; }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Отзывы</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
            Модерация отзывов пользователей
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <span className="text-sm text-surface-500 dark:text-surface-400 shrink-0">Фильтр по рейтингу:</span>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => { setRatingFilter(''); setPage(1); }}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                ratingFilter === '' ? 'bg-primary-500 text-white' : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'
              )}
            >
              Все
            </button>
            {[5, 4, 3, 2, 1].map((r) => (
              <button
                key={r}
                onClick={() => { setRatingFilter(r); setPage(1); }}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1',
                  ratingFilter === r ? 'bg-primary-500 text-white' : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'
                )}
              >
                {r}
                <Star className={cn('h-3.5 w-3.5', ratingFilter === r ? 'fill-white text-white' : 'fill-amber-400 text-amber-400')} />
              </button>
            ))}
          </div>
        </div>
      </div>

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
                <th className="text-left px-4 py-3 font-medium text-surface-500 dark:text-surface-400">Пользователь</th>
                <th className="text-left px-4 py-3 font-medium text-surface-500 dark:text-surface-400">Рейтинг</th>
                <th className="text-left px-4 py-3 font-medium text-surface-500 dark:text-surface-400">Комментарий</th>
                <th className="text-left px-4 py-3 font-medium text-surface-500 dark:text-surface-400 hidden sm:table-cell">Товар ID</th>
                <th className="text-left px-4 py-3 font-medium text-surface-500 dark:text-surface-400 hidden md:table-cell">Дата</th>
                <th className="text-right px-4 py-3 font-medium text-surface-500 dark:text-surface-400">Действия</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-surface-100 dark:border-surface-800">
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-surface-200 dark:bg-surface-700 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-surface-400">
                    <MessageSquare className="h-10 w-10 mx-auto mb-3 text-surface-300 dark:text-surface-600" />
                    Отзывы не найдены
                  </td>
                </tr>
              ) : (
                reviews.map((r) => (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-surface-100 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center shrink-0">
                          <span className="text-xs font-semibold text-surface-500 dark:text-surface-400">
                            {r.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-surface-900 dark:text-surface-100 truncate">{r.userName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StarRating rating={r.rating} />
                    </td>
                    <td className="px-4 py-3 text-surface-600 dark:text-surface-300 max-w-[300px]">
                      <p className="line-clamp-2">{r.comment}</p>
                    </td>
                    <td className="px-4 py-3 text-surface-500 dark:text-surface-400 font-mono text-xs hidden sm:table-cell">
                      #{r.productId}
                    </td>
                    <td className="px-4 py-3 text-surface-500 dark:text-surface-400 hidden md:table-cell whitespace-nowrap">
                      {formatDate(r.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => setDeleteTarget(r)}
                          className="p-2 rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="Удалить"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
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
                if (totalPages <= 5) { pageNum = i + 1; }
                else if (page <= 3) { pageNum = i + 1; }
                else if (page >= totalPages - 2) { pageNum = totalPages - 4 + i; }
                else { pageNum = page - 2 + i; }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={cn(
                      'h-8 w-8 rounded-lg text-sm font-medium transition-colors',
                      page === pageNum ? 'bg-primary-500 text-white' : 'text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800'
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

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => !deleting && setDeleteTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' as const }}
              className="bg-white dark:bg-surface-900 rounded-2xl shadow-xl w-full max-w-sm p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">Удалить отзыв?</h3>
              </div>
              <p className="text-sm text-surface-500 dark:text-surface-400 mb-2">
                Вы уверены, что хотите удалить отзыв от пользователя <strong className="text-surface-900 dark:text-surface-100">{deleteTarget.userName}</strong>?
              </p>
              <div className="bg-surface-50 dark:bg-surface-800/50 rounded-lg p-3 mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <StarRating rating={deleteTarget.rating} />
                </div>
                <p className="text-sm text-surface-600 dark:text-surface-300 line-clamp-2">{deleteTarget.comment}</p>
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(null)} disabled={deleting}>Отмена</Button>
                <Button variant="destructive" size="sm" onClick={handleDelete} loading={deleting}>Удалить</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
