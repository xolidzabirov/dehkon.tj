'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, Trash2, ChevronLeft, ChevronRight,
  MapPin, X, AlertTriangle, Loader2, Store,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { cn } from '@/shared/lib/utils';
import { marketService } from '@/entities/market';
import type { Market } from '@/entities/market';

const PAGE_SIZE = 10;

function transliterate(str: string): string {
  const map: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    ' ': '-',
  };
  return str.toLowerCase().split('').map((c) => map[c] ?? c).join('').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

interface MarketForm {
  name: string;
  slug: string;
  address: string;
  latitude: string;
  longitude: string;
}

const emptyForm: MarketForm = { name: '', slug: '', address: '', latitude: '', longitude: '' };

export default function AdminMarketsPage() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<MarketForm>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof MarketForm, string>>>({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Market | null>(null);
  const [deleting, setDeleting] = useState(false);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const fetchMarkets = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const raw = await marketService.getAll({ PageSize: PAGE_SIZE, PageNumber: page });
      const items = Array.isArray(raw) ? raw : Array.isArray(raw?.items) ? raw.items : [];
      const count = Array.isArray(raw) ? raw.length : (raw?.totalCount ?? 0);
      setMarkets(items);
      setTotalCount(count);
    } catch {
      setError('Не удалось загрузить рынки');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchMarkets(); }, [fetchMarkets]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (m: Market) => {
    setEditingId(m.id);
    setForm({
      name: m.name,
      slug: m.slug,
      address: m.address,
      latitude: m.latitude != null ? String(m.latitude) : '',
      longitude: m.longitude != null ? String(m.longitude) : '',
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleNameChange = (v: string) => {
    setForm((f) => ({
      ...f,
      name: v,
      slug: editingId ? f.slug : transliterate(v),
    }));
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof MarketForm, string>> = {};
    if (!form.name.trim()) errs.name = 'Введите название';
    if (!form.slug.trim()) errs.slug = 'Введите slug';
    if (!form.address.trim()) errs.address = 'Введите адрес';
    if (form.latitude && isNaN(Number(form.latitude))) errs.latitude = 'Неверный формат';
    if (form.longitude && isNaN(Number(form.longitude))) errs.longitude = 'Неверный формат';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const data = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        address: form.address.trim(),
        latitude: form.latitude ? Number(form.latitude) : undefined,
        longitude: form.longitude ? Number(form.longitude) : undefined,
      };
      if (editingId) {
        await marketService.update(editingId, data);
      } else {
        await marketService.create(data);
      }
      setModalOpen(false);
      fetchMarkets();
    } catch {
      setError(editingId ? 'Не удалось обновить рынок' : 'Не удалось создать рынок');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await marketService.delete(deleteTarget.id);
      setDeleteTarget(null);
      fetchMarkets();
    } catch {
      setError('Не удалось удалить рынок');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Рынки</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
            Управление рынками платформы
          </p>
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus className="h-4 w-4" />
          Добавить рынок
        </Button>
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
                <th className="text-left px-4 py-3 font-medium text-surface-500 dark:text-surface-400">Название</th>
                <th className="text-left px-4 py-3 font-medium text-surface-500 dark:text-surface-400 hidden sm:table-cell">Slug</th>
                <th className="text-left px-4 py-3 font-medium text-surface-500 dark:text-surface-400 hidden md:table-cell">Адрес</th>
                <th className="text-left px-4 py-3 font-medium text-surface-500 dark:text-surface-400 hidden lg:table-cell">Координаты</th>
                <th className="text-right px-4 py-3 font-medium text-surface-500 dark:text-surface-400">Действия</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-surface-100 dark:border-surface-800">
                    {Array.from({ length: 5 }).map((__, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-surface-200 dark:bg-surface-700 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : markets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-surface-400">
                    <Store className="h-10 w-10 mx-auto mb-3 text-surface-300 dark:text-surface-600" />
                    Рынки не найдены
                  </td>
                </tr>
              ) : (
                markets.map((m) => (
                  <motion.tr
                    key={m.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-surface-100 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                          <MapPin className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                        </div>
                        <span className="font-medium text-surface-900 dark:text-surface-100">{m.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-surface-500 dark:text-surface-400 font-mono text-xs hidden sm:table-cell">{m.slug}</td>
                    <td className="px-4 py-3 text-surface-600 dark:text-surface-300 hidden md:table-cell max-w-[250px] truncate">{m.address}</td>
                    <td className="px-4 py-3 text-surface-500 dark:text-surface-400 text-xs hidden lg:table-cell">
                      {m.latitude != null && m.longitude != null ? `${m.latitude}, ${m.longitude}` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(m)}
                          className="p-2 rounded-lg text-surface-400 hover:text-primary-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                          title="Редактировать"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(m)}
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

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-surface-200 dark:border-surface-800">
            <p className="text-sm text-surface-500">Страница {page} из {totalPages}</p>
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

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => !saving && setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' as const }}
              className="bg-white dark:bg-surface-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200 dark:border-surface-800">
                <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                  {editingId ? 'Редактировать рынок' : 'Новый рынок'}
                </h2>
                <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800">
                  <X className="h-5 w-5 text-surface-400" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <Input
                  label="Название"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  error={formErrors.name}
                  placeholder="Рынок Мехргон"
                />
                <Input
                  label="Slug"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  error={formErrors.slug}
                  placeholder="rynok-mehrgon"
                />
                <Input
                  label="Адрес"
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  error={formErrors.address}
                  placeholder="г. Душанбе, ул. ..."
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Широта"
                    value={form.latitude}
                    onChange={(e) => setForm((f) => ({ ...f, latitude: e.target.value }))}
                    error={formErrors.latitude}
                    placeholder="38.5598"
                  />
                  <Input
                    label="Долгота"
                    value={form.longitude}
                    onChange={(e) => setForm((f) => ({ ...f, longitude: e.target.value }))}
                    error={formErrors.longitude}
                    placeholder="68.7870"
                  />
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <Button variant="ghost" size="sm" type="button" onClick={() => setModalOpen(false)} disabled={saving}>
                    Отмена
                  </Button>
                  <Button type="submit" size="sm" loading={saving}>
                    {editingId ? 'Сохранить' : 'Создать'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">Удалить рынок?</h3>
              </div>
              <p className="text-sm text-surface-500 dark:text-surface-400 mb-6">
                Вы уверены, что хотите удалить рынок <strong className="text-surface-900 dark:text-surface-100">{deleteTarget.name}</strong>?
              </p>
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
