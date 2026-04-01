'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Edit2, Trash2, X, Upload,
  ChevronLeft, ChevronRight, Package, Loader2, ImageIcon,
} from 'lucide-react';
import { productService } from '@/entities/product';
import { categoryService } from '@/entities/category';
import { marketService } from '@/entities/market';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { cn } from '@/shared/lib/utils';
import type { Product } from '@/entities/product';
import type { Category } from '@/entities/category';
import type { Market } from '@/entities/market';

export const dynamic = 'force-dynamic';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'TJS', maximumFractionDigits: 0 }).format(n);
}

interface ProductFormData {
  name: string;
  description: string;
  pricePerKg: string;
  categoryId: string;
  marketId: string;
  inStock: boolean;
  image: File | null;
}

const emptyForm: ProductFormData = {
  name: '',
  description: '',
  pricePerKg: '',
  categoryId: '',
  marketId: '',
  inStock: true,
  image: null,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filterCategoryId, setFilterCategoryId] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete confirm
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const pageSize = 10;

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, any> = { PageSize: pageSize, PageNumber: page };
      if (search.trim()) params.Name = search.trim();
      if (filterCategoryId) params.CategoryId = Number(filterCategoryId);
      const raw = await productService.getAll(params);
      const items = Array.isArray(raw) ? raw : Array.isArray(raw?.items) ? raw.items : [];
      setProducts(items);
      setTotalPages(raw?.totalPages ?? (Math.ceil((raw?.totalCount ?? items.length) / pageSize) || 1));
    } catch (err: any) {
      setError(err?.message || 'Ошибка загрузки товаров');
    } finally {
      setLoading(false);
    }
  }, [page, search, filterCategoryId]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    async function loadMeta() {
      try {
        const [catRaw, mktRaw] = await Promise.all([
          categoryService.getAll({ PageSize: 100 }),
          marketService.getAll({ PageSize: 100 }),
        ]);
        setCategories(Array.isArray(catRaw) ? catRaw : Array.isArray(catRaw?.items) ? catRaw.items : []);
        setMarkets(Array.isArray(mktRaw) ? mktRaw : Array.isArray(mktRaw?.items) ? mktRaw.items : []);
      } catch {
        // non-critical
      }
    }
    loadMeta();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setFormErrors({});
    setImagePreview(null);
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description || '',
      pricePerKg: String(product.pricePerKg),
      categoryId: String(product.categoryId),
      marketId: String(product.marketId),
      inStock: product.inStock,
      image: null,
    });
    setFormErrors({});
    setImagePreview(product.imageUrl || null);
    setModalOpen(true);
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof ProductFormData, string>> = {};
    if (!form.name.trim()) errors.name = 'Введите название';
    if (!form.pricePerKg || Number(form.pricePerKg) <= 0) errors.pricePerKg = 'Введите корректную цену';
    if (!form.categoryId) errors.categoryId = 'Выберите категорию';
    if (!form.marketId) errors.marketId = 'Выберите рынок';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setSaving(true);
    try {
      const fd = new FormData();
      if (editingProduct) fd.append('Id', String(editingProduct.id));
      fd.append('Name', form.name.trim());
      fd.append('Description', form.description.trim());
      fd.append('PricePerKg', form.pricePerKg);
      fd.append('CategoryId', form.categoryId);
      fd.append('MarketId', form.marketId);
      fd.append('InStock', String(form.inStock));
      if (form.image) fd.append('Image', form.image);

      if (editingProduct) {
        await productService.update(fd);
      } else {
        await productService.create(fd);
      }
      setModalOpen(false);
      loadProducts();
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
      await productService.delete(deleteId);
      setDeleteId(null);
      loadProducts();
    } catch (err: any) {
      setError(err?.message || 'Ошибка удаления');
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((f) => ({ ...f, image: file }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Товары</h1>
          <p className="text-sm text-surface-500 mt-1">Управление каталогом товаров</p>
        </div>
        <Button onClick={openCreateModal} size="md">
          <Plus className="h-4 w-4" />
          Добавить товар
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Поиск по названию..."
            className="h-10 w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 pl-9 pr-4 text-sm text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          value={filterCategoryId}
          onChange={(e) => { setFilterCategoryId(e.target.value); setPage(1); }}
          className="h-10 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 px-3 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Все категории</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
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
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-800/50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-surface-500">Фото</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-surface-500">Название</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-surface-500">Категория</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-surface-500">Цена</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-surface-500">Продавец</th>
                <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-surface-500">В наличии</th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-surface-500">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 w-20 animate-pulse rounded bg-surface-200 dark:bg-surface-700" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <Package className="mx-auto h-12 w-12 text-surface-300 dark:text-surface-600" />
                    <p className="mt-3 text-surface-500">Товары не найдены</p>
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="h-10 w-10 overflow-hidden rounded-lg bg-surface-100 dark:bg-surface-800">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-surface-400" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-surface-900 dark:text-surface-100">{p.name}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex rounded-full bg-surface-100 dark:bg-surface-800 px-2.5 py-0.5 text-xs font-medium text-surface-600 dark:text-surface-300">
                        {p.categoryName}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm font-semibold text-surface-900 dark:text-surface-100">
                      {formatCurrency(p.pricePerKg)}/кг
                    </td>
                    <td className="px-5 py-3 text-sm text-surface-600 dark:text-surface-400">{p.sellerName}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={cn(
                        'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
                        p.inStock
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      )}>
                        {p.inStock ? '✓' : '✕'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(p)}
                          className="rounded-lg p-2 text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-primary-500 transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(p.id)}
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
              className="fixed inset-4 z-50 m-auto max-h-[90vh] max-w-lg overflow-y-auto rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-6 shadow-xl"
              style={{ height: 'fit-content' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">
                  {editingProduct ? 'Редактировать товар' : 'Новый товар'}
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
                  placeholder="Введите название товара"
                />
                <div className="w-full">
                  <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                    Описание
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    rows={3}
                    placeholder="Описание товара"
                    className="flex w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 px-4 py-2.5 text-sm text-surface-900 dark:text-surface-100 placeholder:text-surface-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  />
                </div>
                <Input
                  label="Цена за кг (TJS)"
                  type="number"
                  value={form.pricePerKg}
                  onChange={(e) => setForm((f) => ({ ...f, pricePerKg: e.target.value }))}
                  error={formErrors.pricePerKg}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="w-full">
                    <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                      Категория
                    </label>
                    <select
                      value={form.categoryId}
                      onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                      className={cn(
                        'flex h-11 w-full rounded-xl border bg-white dark:bg-surface-900 px-4 py-2 text-sm text-surface-900 dark:text-surface-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                        formErrors.categoryId ? 'border-red-500' : 'border-surface-200 dark:border-surface-700'
                      )}
                    >
                      <option value="">Выберите</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    {formErrors.categoryId && <p className="mt-1.5 text-sm text-red-500">{formErrors.categoryId}</p>}
                  </div>
                  <div className="w-full">
                    <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                      Рынок
                    </label>
                    <select
                      value={form.marketId}
                      onChange={(e) => setForm((f) => ({ ...f, marketId: e.target.value }))}
                      className={cn(
                        'flex h-11 w-full rounded-xl border bg-white dark:bg-surface-900 px-4 py-2 text-sm text-surface-900 dark:text-surface-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                        formErrors.marketId ? 'border-red-500' : 'border-surface-200 dark:border-surface-700'
                      )}
                    >
                      <option value="">Выберите</option>
                      {markets.map((m) => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                    {formErrors.marketId && <p className="mt-1.5 text-sm text-red-500">{formErrors.marketId}</p>}
                  </div>
                </div>

                {/* In Stock toggle */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, inStock: !f.inStock }))}
                    className={cn(
                      'relative h-6 w-11 rounded-full transition-colors',
                      form.inStock ? 'bg-primary-500' : 'bg-surface-300 dark:bg-surface-600'
                    )}
                  >
                    <span className={cn(
                      'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
                      form.inStock && 'translate-x-5'
                    )} />
                  </button>
                  <span className="text-sm text-surface-700 dark:text-surface-300">В наличии</span>
                </div>

                {/* Image Upload */}
                <div className="w-full">
                  <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                    Изображение
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-surface-300 dark:border-surface-600 bg-surface-50 dark:bg-surface-800/50 p-6 hover:border-primary-500 transition-colors"
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="h-24 w-24 rounded-lg object-cover" />
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-surface-400 mb-2" />
                        <p className="text-sm text-surface-500">Нажмите для загрузки</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 justify-end">
                <Button variant="ghost" onClick={() => !saving && setModalOpen(false)} disabled={saving}>
                  Отмена
                </Button>
                <Button onClick={handleSave} loading={saving}>
                  {editingProduct ? 'Сохранить' : 'Создать'}
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
              <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-2">Удалить товар?</h3>
              <p className="text-sm text-surface-500 mb-6">
                Это действие нельзя отменить. Товар будет удалён навсегда.
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
