'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, Trash2, X, AlertTriangle, Megaphone, User, Calendar,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { cn } from '@/shared/lib/utils';
import { announcementService } from '@/entities/announcement';
import type { Announcement } from '@/entities/announcement';

interface AnnouncementForm {
  title: string;
  content: string;
}

const emptyForm: AnnouncementForm = { title: '', content: '' };

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AnnouncementForm>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof AnnouncementForm, string>>>({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const raw = await announcementService.getAll({ PageSize: 100 });
      const items = Array.isArray(raw) ? raw : Array.isArray(raw?.items) ? raw.items : [];
      const sorted = [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setAnnouncements(sorted);
    } catch {
      setError('Не удалось загрузить объявления');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAnnouncements(); }, [fetchAnnouncements]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (a: Announcement) => {
    setEditingId(a.id);
    setForm({ title: a.title, content: a.content });
    setFormErrors({});
    setModalOpen(true);
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof AnnouncementForm, string>> = {};
    if (!form.title.trim()) errs.title = 'Введите заголовок';
    if (!form.content.trim()) errs.content = 'Введите содержание';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const data = { title: form.title.trim(), content: form.content.trim() };
      if (editingId) {
        await announcementService.update(editingId, data);
      } else {
        await announcementService.create(data);
      }
      setModalOpen(false);
      fetchAnnouncements();
    } catch {
      setError(editingId ? 'Не удалось обновить объявление' : 'Не удалось создать объявление');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await announcementService.delete(deleteTarget.id);
      setDeleteTarget(null);
      fetchAnnouncements();
    } catch {
      setError('Не удалось удалить объявление');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString('ru-RU', {
        day: 'numeric', month: 'long', year: 'numeric',
      });
    } catch { return d; }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Объявления</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
            Управление новостями и объявлениями
          </p>
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus className="h-4 w-4" />
          Новое объявление
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3 text-red-700 dark:text-red-400">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Cards Grid */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-5 animate-pulse">
              <div className="h-5 w-2/3 bg-surface-200 dark:bg-surface-700 rounded mb-3" />
              <div className="space-y-2">
                <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded" />
                <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded w-4/5" />
              </div>
              <div className="h-3 w-1/3 bg-surface-200 dark:bg-surface-700 rounded mt-4" />
            </div>
          ))}
        </div>
      ) : announcements.length === 0 ? (
        <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-12 text-center">
          <Megaphone className="h-12 w-12 mx-auto mb-4 text-surface-300 dark:text-surface-600" />
          <p className="text-surface-400">Объявления не найдены</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {announcements.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, ease: 'easeOut' as const }}
              className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-5 hover:shadow-lg hover:shadow-surface-200/50 dark:hover:shadow-surface-900/50 transition-shadow group"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                    <Megaphone className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-base font-semibold text-surface-900 dark:text-surface-100 truncate">
                    {a.title}
                  </h3>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => openEdit(a)}
                    className="p-1.5 rounded-lg text-surface-400 hover:text-primary-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                    title="Редактировать"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(a)}
                    className="p-1.5 rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Удалить"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-surface-600 dark:text-surface-300 line-clamp-3 mb-4 leading-relaxed">
                {a.content}
              </p>

              <div className="flex items-center gap-4 text-xs text-surface-400">
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  {a.createdByName}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(a.createdAt)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

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
              className="bg-white dark:bg-surface-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200 dark:border-surface-800">
                <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                  {editingId ? 'Редактировать объявление' : 'Новое объявление'}
                </h2>
                <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800">
                  <X className="h-5 w-5 text-surface-400" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <Input
                  label="Заголовок"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  error={formErrors.title}
                  placeholder="Введите заголовок объявления"
                />
                <div className="w-full">
                  <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                    Содержание
                  </label>
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                    rows={6}
                    placeholder="Введите текст объявления..."
                    className={cn(
                      'flex w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 px-4 py-3 text-sm text-surface-900 dark:text-surface-100 placeholder:text-surface-400 dark:placeholder:text-surface-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none',
                      formErrors.content && 'border-red-500 focus:ring-red-500'
                    )}
                  />
                  {formErrors.content && <p className="mt-1.5 text-sm text-red-500">{formErrors.content}</p>}
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <Button variant="ghost" size="sm" type="button" onClick={() => setModalOpen(false)} disabled={saving}>
                    Отмена
                  </Button>
                  <Button type="submit" size="sm" loading={saving}>
                    {editingId ? 'Сохранить' : 'Опубликовать'}
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
                <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">Удалить объявление?</h3>
              </div>
              <p className="text-sm text-surface-500 dark:text-surface-400 mb-6">
                Вы уверены, что хотите удалить объявление <strong className="text-surface-900 dark:text-surface-100">{deleteTarget.title}</strong>?
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
