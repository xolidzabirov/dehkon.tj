'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit2, Trash2, X, FolderTree,
  ChevronLeft, ChevronRight, Search, Package,
} from 'lucide-react';
import { categoryService } from '@/entities/category';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { cn } from '@/shared/lib/utils';
import type { Category } from '@/entities/category';

export const dynamic = 'force-dynamic';

interface CategoryFormData {
  name: string;
  description: string;
}

const emptyForm: CategoryFormData = { name: '', description: '' };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryFormData>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CategoryFormData, string>>>({});
  const [saving, setSaving] = useState(false);

  // Delete
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const pageSize = 10;

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const raw = await categoryService.getAll({ PageSize: pageSize, PageNumber: page });
      const items = Array.isArray(raw) ? raw : Array.isArray(raw?.items) ? raw.items : [];
      setCategories(items);
      setTotalPages(raw?.totalPages ?? (Math.ceil((raw?.totalCount ?? items.length) / pageSize) || 1));
    } catch (err: any) {
      setError(err?.message || 'Ошибка загрузки категорий');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const filteredCategories = search.trim()
    ? categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : categories;

  const openCreateModal = () => {
    setEditingCategory(null);
    setForm(emptyForm);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setForm({ name: cat.name, description: cat.description || '' });
    setFormErrors({});
    setModalOpen(true);
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof CategoryFormData, string>> = {};
    if (!form.name.trim()) errors.name = 'Введите название категории';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setSaving(true);
    try {
      const data = { name: form.name.trim(), description: form.description.trim() || undefined };
      if (editingCategory) {
        await categoryService.update(editingCategory.id, data);
      } else {
        await categoryService.create(data);
      }
      setModalOpen(false);
      loadCategories();
    } catch (err: any) {
      setFormErrors({ name: err?.response?.data?.message || err?.message || 'Ошибка сохранения' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    setDeleting(true);
    try {
      await categoryService.delete(deleteId);
      setDeleteId(null);
      loadCategories();
    } catch (err: any) {
      setError(err?.message || 'Ошибка удаления');
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Категории</h1>
          <p className="text-sm text-surface-500 mt-1">Управление категориями товаров</p>
        </div>
        <Button onClick={openCreateModal} size="md">
          <Plus className="h-4 w-4" />
          Добавить категорию
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по названию..."
          className="h-10 w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 pl-9 pr-4 text-sm text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-800/50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-surface-500">ID</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-surface-500">Название</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-surface-500">Описание</th>
                <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-surface-500">Товаров</th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-surface-500">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((__, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 w-20 animate-pulse rounded bg-surface-200 dark:bg-surface-700" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <FolderTree className="mx-auto h-12 w-12 text-surface-300 dark:text-surface-600" />
                    <p className="mt-3 text-surface-500">Категории не найдены</p>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
                    <td className="px-5 py-3.5 text-sm text-surface-500">#{cat.id}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-500/10">
                          <FolderTree className="h-4 w-4 text-primary-500" />
                        </div>
                        <span className="text-sm font-medium text-surface-900 dark:text-surface-100">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-surface-500 max-w-xs truncate">
                      {cat.description || '—'}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="inline-flex items-center gap-1 rounded-full bg-surface-100 dark:bg-surface-800 px-2.5 py-0.5 text-xs font-medium text-surface-600 dark:text-surface-300">
                        <Package className="h-3 w-3" />
                        {cat.productCount}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="rounded-lg p-2 text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-primary-500 transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(cat.id)}
                          className="rounded-lg p-2 text-surface-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-surface-200 dark:border-surface-800 px-5 py-3">
            <p className="text-sm text-surface-500">
              Страница {page} из {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-lg p-2 text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                const pg = i + 1;
                return (
                  <button
                    key={pg}
                    onClick={() => setPage(pg)}
                    className={cn(
                      'h-8 min-w-[2rem] rounded-lg px-2 text-sm font-medium transition-colors',
                      pg === page
                        ? 'bg-primary-500 text-white'
                        : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
                    )}
                  >
                    {pg}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="rounded-lg p-2 text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !saving && setModalOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-4 z-50 m-auto max-h-[90vh] max-w-md overflow-y-auto rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-6 shadow-xl"
              style={{ height: 'fit-content' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">
                  {editingCategory ? 'Редактировать категорию' : 'Новая категория'}
                </h2>
                <button
                  onClick={() => !saving && setModalOpen(false)}
                  className="rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <Input
                  label="Название"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  error={formErrors.name}
                  placeholder="Введите название категории"
                />
                <div className="w-full">
                  <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                    Описание
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    rows={3}
                    placeholder="Описание категории (необязательно)"
                    className="flex w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 px-4 py-2.5 text-sm text-surface-900 dark:text-surface-100 placeholder:text-surface-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 justify-end">
                <Button variant="ghost" onClick={() => !saving && setModalOpen(false)} disabled={saving}>
                  Отмена
                </Button>
                <Button onClick={handleSave} loading={saving}>
                  {editingCategory ? 'Сохранить' : 'Создать'}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteId !== null && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !deleting && setDeleteId(null)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 z-50 m-auto max-w-sm rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-6 shadow-xl"
              style={{ height: 'fit-content' }}
            >
              <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-2">Удалить категорию?</h3>
              <p className="text-sm text-surface-500 mb-6">
                Это действие нельзя отменить. Все товары в этой категории останутся без категории.
              </p>
              <div className="flex items-center gap-3 justify-end">
                <Button variant="ghost" onClick={() => setDeleteId(null)} disabled={deleting}>
                  Отмена
                </Button>
                <Button variant="destructive" onClick={handleDelete} loading={deleting}>
                  Удалить
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
