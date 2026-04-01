'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ChevronLeft, ChevronRight, Trash2, Eye, X,
  User as UserIcon, Shield, Loader2, AlertTriangle,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Badge } from '@/shared/ui/Badge';
import { cn } from '@/shared/lib/utils';
import { userService } from '@/entities/user';
import { authService } from '@/features/auth';
import { roleService } from '@/shared/api';
import type { User } from '@/entities/user';
import type { Role } from '@/shared/types';

const PAGE_SIZE = 10;

const ROLE_COLORS: Record<string, string> = {
  Admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Seller: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Buyer: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Courier: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<number | ''>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, unknown> = { PageSize: PAGE_SIZE, PageNumber: page };
      if (search) params.FullName = search;
      if (roleFilter !== '') params.RoleId = roleFilter;
      if (statusFilter !== '') params.IsActive = statusFilter === 'active';
      const raw = await userService.getAll(params as never);
      const items = Array.isArray(raw) ? raw : Array.isArray(raw?.items) ? raw.items : [];
      const count = Array.isArray(raw) ? raw.length : (raw?.totalCount ?? 0);
      setUsers(items);
      setTotalCount(count);
    } catch {
      setError('Не удалось загрузить пользователей');
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter, statusFilter]);

  const fetchRoles = useCallback(async () => {
    try {
      const raw = await roleService.getAll({ PageSize: 50 });
      const items = Array.isArray(raw) ? raw : Array.isArray(raw?.items) ? raw.items : [];
      setRoles(items);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => { fetchRoles(); }, [fetchRoles]);
  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await authService.deleteUser(deleteTarget.id);
      setDeleteTarget(null);
      fetchUsers();
    } catch {
      setError('Не удалось удалить пользователя');
    } finally {
      setDeleting(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('ru-RU'); } catch { return d; }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Пользователи</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
            Управление пользователями платформы
          </p>
        </div>
        <Badge variant="secondary" className="text-sm px-3 py-1 self-start">
          Всего: {totalCount}
        </Badge>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Поиск по имени..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value ? Number(e.target.value) : ''); setPage(1); }}
            className="h-11 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 px-3 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Все роли</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="h-11 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 px-3 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Все статусы</option>
            <option value="active">Активные</option>
            <option value="blocked">Заблокированные</option>
          </select>
          <Button type="submit" size="sm">Найти</Button>
        </form>
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
                <th className="text-left px-4 py-3 font-medium text-surface-500 dark:text-surface-400">Пользователь</th>
                <th className="text-left px-4 py-3 font-medium text-surface-500 dark:text-surface-400 hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 font-medium text-surface-500 dark:text-surface-400 hidden lg:table-cell">Телефон</th>
                <th className="text-left px-4 py-3 font-medium text-surface-500 dark:text-surface-400">Роль</th>
                <th className="text-left px-4 py-3 font-medium text-surface-500 dark:text-surface-400 hidden sm:table-cell">Статус</th>
                <th className="text-left px-4 py-3 font-medium text-surface-500 dark:text-surface-400 hidden lg:table-cell">Дата</th>
                <th className="text-right px-4 py-3 font-medium text-surface-500 dark:text-surface-400">Действия</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-surface-100 dark:border-surface-800">
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-surface-400">
                    Пользователи не найдены
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-surface-100 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                          {u.profilePhotoUrl ? (
                            <img src={u.profilePhotoUrl} alt="" className="h-9 w-9 rounded-full object-cover" />
                          ) : (
                            <UserIcon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-surface-900 dark:text-surface-100 truncate">{u.fullName}</p>
                          <p className="text-xs text-surface-400 truncate">@{u.userName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-surface-600 dark:text-surface-300 hidden md:table-cell">{u.email}</td>
                    <td className="px-4 py-3 text-surface-600 dark:text-surface-300 hidden lg:table-cell">{u.phoneNumber}</td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium', ROLE_COLORS[u.roleName] || 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-300')}>
                        <Shield className="h-3 w-3" />
                        {u.roleName}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                        u.isActive
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      )}>
                        {u.isActive ? 'Активен' : 'Заблокирован'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-surface-500 dark:text-surface-400 hidden lg:table-cell">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="p-2 rounded-lg text-surface-400 hover:text-primary-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                          title="Подробнее"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(u)}
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

      {/* View User Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setSelectedUser(null)}
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
                  Профиль пользователя
                </h2>
                <button onClick={() => setSelectedUser(null)} className="p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800">
                  <X className="h-5 w-5 text-surface-400" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    {selectedUser.profilePhotoUrl ? (
                      <img src={selectedUser.profilePhotoUrl} alt="" className="h-16 w-16 rounded-full object-cover" />
                    ) : (
                      <UserIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">{selectedUser.fullName}</h3>
                    <p className="text-sm text-surface-400">@{selectedUser.userName}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Email', value: selectedUser.email },
                    { label: 'Телефон', value: selectedUser.phoneNumber },
                    { label: 'Роль', value: selectedUser.roleName },
                    { label: 'Статус', value: selectedUser.isActive ? 'Активен' : 'Заблокирован' },
                    { label: 'Дата регистрации', value: formatDate(selectedUser.createdAt) },
                    { label: 'ID', value: String(selectedUser.id) },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between py-2 border-b border-surface-100 dark:border-surface-800 last:border-0">
                      <span className="text-sm text-surface-400">{item.label}</span>
                      <span className="text-sm font-medium text-surface-900 dark:text-surface-100">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
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
                <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">Удалить пользователя?</h3>
              </div>
              <p className="text-sm text-surface-500 dark:text-surface-400 mb-6">
                Вы уверены, что хотите удалить пользователя <strong className="text-surface-900 dark:text-surface-100">{deleteTarget.fullName}</strong>? Это действие нельзя отменить.
              </p>
              <div className="flex gap-3 justify-end">
                <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(null)} disabled={deleting}>
                  Отмена
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDelete} loading={deleting}>
                  Удалить
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
