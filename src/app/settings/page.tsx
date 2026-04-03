'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Lock, Bell, Trash2, Camera, Eye, EyeOff,
  Check, AlertTriangle, ChevronRight, LogOut, Upload,
} from 'lucide-react';
import { useTranslation } from '@/features/i18n';
import { Skeleton } from '@/shared/ui/Skeleton';
import { userService } from '@/entities/user';
import { authApi } from '@/shared/api/auth';
import type { User as UserType } from '@/entities/user';

/* ─────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────── */
type NavItem = {
  id: 'profile' | 'security' | 'notifications' | 'danger';
  label: string;
  icon: React.ElementType;
  danger?: boolean;
};
type NavId = NavItem['id'];

/* ─────────────────────────────────────────────────────
   ATOMS
───────────────────────────────────────────────────── */
function Field({
  label,
  name,
  type = 'text',
  value,
  onChange,
  hint,
  disabled,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  disabled?: boolean;
}) {
  const [show, setShow] = useState(false);
  const isPw = type === 'password';
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[#1a1a1a] dark:text-white">
        {label}
      </label>
      <div className="relative">
        <input
          name={name}
          type={isPw && !show ? 'password' : 'text'}
          value={value}
          disabled={disabled}
          onChange={e => onChange(e.target.value)}
          className={[
            'w-full rounded-xl border bg-white dark:bg-[#1c1c1c] px-4 py-2.5 text-sm',
            'text-[#1a1a1a] dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30',
            'outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all duration-150',
            disabled
              ? 'opacity-50 cursor-not-allowed border-black/[0.08] dark:border-white/[0.06]'
              : 'border-black/[0.1] dark:border-white/[0.08] hover:border-black/20 dark:hover:border-white/15',
            isPw ? 'pr-10' : '',
          ].join(' ')}
        />
        {isPw && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30 hover:text-black/60 dark:hover:text-white/60 transition-colors"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {hint && <p className="text-xs text-black/40 dark:text-white/40">{hint}</p>}
    </div>
  );
}

function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      className={[
        'fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-3.5 shadow-2xl text-sm font-medium',
        type === 'success' ? 'bg-[#0d1f14] text-green-300' : 'bg-red-950 text-red-300',
      ].join(' ')}
    >
      {type === 'success'
        ? <Check className="h-4 w-4" />
        : <AlertTriangle className="h-4 w-4" />}
      {message}
    </motion.div>
  );
}

function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={[
        'relative h-6 w-11 rounded-full transition-colors duration-200',
        value ? 'bg-primary-500' : 'bg-black/10 dark:bg-white/10',
      ].join(' ')}
    >
      <span
        className={[
          'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200',
          value ? 'translate-x-5' : 'translate-x-0',
        ].join(' ')}
      />
    </button>
  );
}

function Spinner() {
  return (
    <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
  );
}

function SaveBtn({
  loading,
  disabled,
  onClick,
  label = 'Сохранить',
}: {
  loading: boolean;
  disabled?: boolean;
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading || disabled}
      className="flex items-center gap-2 rounded-xl bg-primary-500 hover:bg-primary-400 disabled:opacity-50 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-500/20 transition-all"
    >
      {loading ? <Spinner /> : <Check className="h-4 w-4" />}
      {label}
    </button>
  );
}

/* ─────────────────────────────────────────────────────
   NAV CONFIG — явный тип вместо `as const`
───────────────────────────────────────────────────── */
const NAV: NavItem[] = [
  { id: 'profile',       label: 'Профиль',      icon: User },
  { id: 'security',      label: 'Безопасность', icon: Lock },
  { id: 'notifications', label: 'Уведомления',  icon: Bell },
  { id: 'danger',        label: 'Опасная зона', icon: Trash2, danger: true },
];

/* ─────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────── */
export default function SettingsPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation();
  const fileRef = useRef<HTMLInputElement>(null);

  const [user,      setUser]      = useState<UserType | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [section,   setSection]   = useState<NavId>('profile');
  const [toast,     setToast]     = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  /* profile */
  const [userName,   setUserName]   = useState('');
  const [phone,      setPhone]      = useState('');
  const [avatarPrev, setAvatarPrev] = useState<string | null>(null);

  /* password */
  const [oldPw,     setOldPw]     = useState('');
  const [newPw,     setNewPw]     = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  /* notifications (local — extend via API if needed) */
  const [notifOrder, setNotifOrder] = useState(true);
  const [notifPromo, setNotifPromo] = useState(false);
  const [notifChat,  setNotifChat]  = useState(true);

  /* ── load user ── */
  useEffect(() => {
    userService.getMe()
      .then(u => {
        setUser(u);
        setUserName(u.userName ?? '');
        setPhone(u.phoneNumber ?? '');
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fire = (message: string, type: 'success' | 'error') =>
    setToast({ message, type });

  /* ── save profile ── */
  const saveProfile = async () => {
    setSaving(true);
    try {
      // updateMe принимает поля реального типа User
      await userService.updateMe({
        userName,
        phoneNumber: phone,
      });
      fire('Профиль обновлён', 'success');
    } catch {
      fire('Ошибка при сохранении', 'error');
    } finally {
      setSaving(false);
    }
  };

  /* ── change password ── */
  const changePw = async () => {
    if (newPw !== confirmPw) { fire('Пароли не совпадают', 'error'); return; }
    if (newPw.length < 6)   { fire('Минимум 6 символов',   'error'); return; }
    setSaving(true);
    try {
      await authApi.changePassword({ oldPassword: oldPw, newPassword: newPw });
      setOldPw(''); setNewPw(''); setConfirmPw('');
      fire('Пароль изменён', 'success');
    } catch {
      fire('Неверный текущий пароль', 'error');
    } finally {
      setSaving(false);
    }
  };

  /* ── delete account ── */
  const deleteAccount = async () => {
    if (!window.confirm('Вы уверены? Это нельзя отменить.')) return;
    try {
      await authApi.deleteMe();
      window.location.href = '/';
    } catch {
      fire('Ошибка при удалении', 'error');
    }
  };

  /* ── logout ── */
  const handleLogout = () => {
    authApi.logout();
    window.location.href = '/auth';
  };

  /* ── avatar preview ── */
  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPrev(reader.result as string);
    reader.readAsDataURL(file);
  };

  /* ── password strength ── */
  const pwStrength =
    newPw.length >= 12 ? 4 :
    newPw.length >= 10 ? 3 :
    newPw.length >= 8  ? 2 :
    newPw.length >= 1  ? 1 : 0;

  const strengthColor = ['', 'bg-red-500', 'bg-amber-500', 'bg-yellow-400', 'bg-green-500'][pwStrength];
  const strengthLabel = ['', 'Слабый', 'Средний', 'Хороший', 'Отличный'][pwStrength];

  /* ── loading skeleton ── */
  if (loading) return (
    <div className="min-h-screen bg-[#f8f7f4] dark:bg-[#0f0f0f]">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <Skeleton className="h-7 w-32 mb-8" />
        <div className="flex gap-6">
          <Skeleton className="h-64 w-56 rounded-2xl" />
          <Skeleton className="flex-1 h-64 rounded-2xl" />
        </div>
      </div>
    </div>
  );

  const avatarSrc = avatarPrev ?? user?.profilePhotoUrl ?? null;
  const displayName = user?.userName ?? 'Пользователь';

  return (
    <div className="min-h-screen bg-[#f8f7f4] dark:bg-[#0f0f0f]">
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white">Настройки</h1>
          <p className="mt-1 text-sm text-black/45 dark:text-white/45">
            Управляйте своим профилем и предпочтениями
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* ══ SIDEBAR ══ */}
          <nav className="lg:w-56 shrink-0">
            <div className="rounded-2xl bg-white dark:bg-[#141414] border border-black/[0.06] dark:border-white/[0.06] overflow-hidden">

              {/* user mini card */}
              <div className="p-4 border-b border-black/[0.06] dark:border-white/[0.06] flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl overflow-hidden bg-primary-100 dark:bg-primary-500/10 flex items-center justify-center text-sm font-bold text-primary-600 dark:text-primary-400 shrink-0">
                  {avatarSrc ? (
                    <Image
                      src={avatarSrc}
                      alt="avatar"
                      width={36}
                      height={36}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    displayName.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#1a1a1a] dark:text-white truncate">
                    {displayName}
                  </p>
                  <p className="text-xs text-black/35 dark:text-white/35 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* nav */}
              <div className="p-2">
                {NAV.map(({ id, label, icon: Icon, danger }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSection(id)}
                    className={[
                      'w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                      section === id
                        ? danger
                          ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                          : 'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300'
                        : danger
                          ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10'
                          : 'text-black/55 dark:text-white/55 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-[#1a1a1a] dark:hover:text-white',
                    ].join(' ')}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 text-left">{label}</span>
                    <ChevronRight className="h-3.5 w-3.5 opacity-40" />
                  </button>
                ))}
                <div className="mt-2 border-t border-black/[0.06] dark:border-white/[0.06] pt-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-black/45 dark:text-white/45 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-[#1a1a1a] dark:hover:text-white transition-all"
                  >
                    <LogOut className="h-4 w-4 shrink-0" />
                    Выйти
                  </button>
                </div>
              </div>
            </div>
          </nav>

          {/* ══ MAIN PANEL ══ */}
          <div className="flex-1 min-w-0">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >

              {/* ── PROFILE ── */}
              {section === 'profile' && (
                <div className="rounded-2xl bg-white dark:bg-[#141414] border border-black/[0.06] dark:border-white/[0.06] p-6">
                  <h2 className="text-base font-semibold text-[#1a1a1a] dark:text-white mb-6">
                    Личные данные
                  </h2>

                  {/* avatar uploader */}
                  <div className="flex items-center gap-5 mb-8 pb-8 border-b border-black/[0.06] dark:border-white/[0.06]">
                    <div className="relative group shrink-0">
                      <div className="h-20 w-20 rounded-2xl overflow-hidden bg-primary-100 dark:bg-primary-500/10 flex items-center justify-center text-2xl font-bold text-primary-600 dark:text-primary-400">
                        {avatarSrc ? (
                          <Image
                            src={avatarSrc}
                            alt="avatar"
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          displayName.charAt(0).toUpperCase()
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <Camera className="h-5 w-5 text-white" />
                      </button>
                    </div>
                    <div>
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        onChange={onAvatarChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-medium text-[#1a1a1a] dark:text-white hover:bg-[#f0efeb] dark:hover:bg-[#242424] transition-colors"
                      >
                        <Upload className="h-4 w-4" />
                        Загрузить фото
                      </button>
                      <p className="mt-1.5 text-xs text-black/35 dark:text-white/35">JPG, PNG до 5 МБ</p>
                    </div>
                  </div>

                  {/* fields */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="Имя пользователя"
                      name="userName"
                      value={userName}
                      onChange={setUserName}
                    />
                    <Field
                      label="Email"
                      name="email"
                      value={user?.email ?? ''}
                      onChange={() => {}}
                      disabled
                      hint="Email нельзя изменить"
                    />
                    <Field
                      label="Телефон"
                      name="phone"
                      value={phone}
                      onChange={setPhone}
                      hint="+992 XX XXX-XX-XX"
                    />
                    {/* дата регистрации — readonly */}
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-[#1a1a1a] dark:text-white">
                        Дата регистрации
                      </label>
                      <div className="w-full rounded-xl border border-black/[0.08] dark:border-white/[0.06] bg-white dark:bg-[#1c1c1c] px-4 py-2.5 text-sm text-black/40 dark:text-white/40 opacity-60 cursor-not-allowed">
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString('ru-RU', {
                              day: 'numeric', month: 'long', year: 'numeric',
                            })
                          : '—'}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <SaveBtn loading={saving} onClick={saveProfile} />
                  </div>
                </div>
              )}

              {/* ── SECURITY ── */}
              {section === 'security' && (
                <div className="rounded-2xl bg-white dark:bg-[#141414] border border-black/[0.06] dark:border-white/[0.06] p-6">
                  <h2 className="text-base font-semibold text-[#1a1a1a] dark:text-white mb-1">
                    Безопасность
                  </h2>
                  <p className="text-sm text-black/40 dark:text-white/40 mb-6">
                    Регулярно меняйте пароль для защиты аккаунта
                  </p>

                  <div className="max-w-sm space-y-5">
                    <Field
                      label="Текущий пароль"
                      name="oldPassword"
                      type="password"
                      value={oldPw}
                      onChange={setOldPw}
                    />
                    <Field
                      label="Новый пароль"
                      name="newPassword"
                      type="password"
                      value={newPw}
                      onChange={setNewPw}
                      hint="Минимум 6 символов"
                    />
                    <Field
                      label="Подтвердите пароль"
                      name="confirmPassword"
                      type="password"
                      value={confirmPw}
                      onChange={setConfirmPw}
                    />

                    {/* strength meter */}
                    {newPw.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-xs text-black/40 dark:text-white/40">Надёжность пароля</p>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map(i => (
                            <div
                              key={i}
                              className={[
                                'h-1 flex-1 rounded-full transition-all duration-300',
                                i <= pwStrength
                                  ? strengthColor
                                  : 'bg-black/[0.06] dark:bg-white/[0.06]',
                              ].join(' ')}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-black/35 dark:text-white/35">{strengthLabel}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <SaveBtn
                      loading={saving}
                      disabled={!oldPw || !newPw || !confirmPw}
                      onClick={changePw}
                      label="Изменить пароль"
                    />
                  </div>
                </div>
              )}

              {/* ── NOTIFICATIONS ── */}
              {section === 'notifications' && (
                <div className="rounded-2xl bg-white dark:bg-[#141414] border border-black/[0.06] dark:border-white/[0.06] p-6">
                  <h2 className="text-base font-semibold text-[#1a1a1a] dark:text-white mb-6">
                    Уведомления
                  </h2>
                  <div className="space-y-3">
                    {[
                      {
                        label: 'Статус заказов',
                        desc: 'Изменение статуса ваших заказов',
                        value: notifOrder,
                        set: setNotifOrder,
                      },
                      {
                        label: 'Акции и скидки',
                        desc: 'Промо-рассылки и спецпредложения',
                        value: notifPromo,
                        set: setNotifPromo,
                      },
                      {
                        label: 'Новые сообщения',
                        desc: 'Уведомления из чатов',
                        value: notifChat,
                        set: setNotifChat,
                      },
                    ].map(({ label, desc, value, set }) => (
                      <div
                        key={label}
                        className="flex items-center justify-between rounded-xl border border-black/[0.06] dark:border-white/[0.06] p-4"
                      >
                        <div>
                          <p className="text-sm font-medium text-[#1a1a1a] dark:text-white">{label}</p>
                          <p className="text-xs text-black/40 dark:text-white/40 mt-0.5">{desc}</p>
                        </div>
                        <Toggle value={value} onChange={v => set(v)} />
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <SaveBtn
                      loading={false}
                      onClick={() => fire('Настройки уведомлений сохранены', 'success')}
                    />
                  </div>
                </div>
              )}

              {/* ── DANGER ZONE ── */}
              {section === 'danger' && (
                <div className="rounded-2xl bg-white dark:bg-[#141414] border border-red-200 dark:border-red-500/20 p-6">
                  <h2 className="text-base font-semibold text-red-600 dark:text-red-400 mb-1">
                    Опасная зона
                  </h2>
                  <p className="text-sm text-black/45 dark:text-white/45 mb-8">
                    Эти действия необратимы. Будьте осторожны.
                  </p>
                  <div className="space-y-4">
                    {/* logout row */}
                    <div className="flex items-start justify-between rounded-xl border border-black/[0.06] dark:border-white/[0.06] p-5 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-[#1a1a1a] dark:text-white">
                          Выйти из аккаунта
                        </p>
                        <p className="text-xs text-black/40 dark:text-white/40 mt-0.5">
                          Завершить текущую сессию
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="shrink-0 flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-medium text-[#1a1a1a] dark:text-white hover:bg-[#f0efeb] dark:hover:bg-[#242424] transition-colors"
                      >
                        <LogOut className="h-4 w-4" /> Выйти
                      </button>
                    </div>
                    {/* delete row */}
                    <div className="flex items-start justify-between rounded-xl border border-red-100 dark:border-red-500/15 bg-red-50/50 dark:bg-red-500/5 p-5 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                          Удалить аккаунт
                        </p>
                        <p className="text-xs text-red-600/60 dark:text-red-400/60 mt-0.5">
                          Все данные, заказы и история будут безвозвратно удалены
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={deleteAccount}
                        className="shrink-0 flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors"
                      >
                        <Trash2 className="h-4 w-4" /> Удалить
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
