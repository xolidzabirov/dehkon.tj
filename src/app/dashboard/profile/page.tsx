'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  Lock,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useTranslation } from '@/features/i18n';
import { useAppSelector, useAppDispatch } from '@/shared/store/hooks';
import { fetchCurrentUser } from '@/features/auth';
import { userService } from '@/entities/user';
import { authService } from '@/features/auth';
import { Button, Input, Skeleton } from '@/shared/ui';

export default function ProfilePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);

  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [saveError, setSaveError] = useState('');

  const [changingPw, setChangingPw] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState('');
  const [pwError, setPwError] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setPhoneNumber(user.phoneNumber || '');
    }
  }, [user]);

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: 'easeOut' as const },
  };

  if (!isAuthenticated) {
    router.push('/auth');
    return null;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950 pt-8">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="lg:col-span-2 h-64 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveError('');
    setSaveMsg('');
    try {
      await userService.updateMe({ fullName, phoneNumber });
      dispatch(fetchCurrentUser());
      setSaveMsg(t.dashboard.profileUpdated);
      setEditing(false);
      setTimeout(() => setSaveMsg(''), 3000);
    } catch {
      setSaveError(t.common.somethingWentWrong);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setPwError(t.auth.passwordsMismatch);
      return;
    }
    setPwSaving(true);
    setPwError('');
    setPwMsg('');
    try {
      await authService.changePassword({
        oldPassword,
        newPassword,
        confirmPassword: confirmNewPassword,
      });
      setPwMsg(t.dashboard.passwordChanged);
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setChangingPw(false);
      setTimeout(() => setPwMsg(''), 3000);
    } catch {
      setPwError(t.common.somethingWentWrong);
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <div className="container mx-auto px-4 py-8">
        <motion.h1 {...fadeUp} className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-100 mb-8">
          {t.nav.profile}
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' as const }}
          >
            <div className="glass-card rounded-2xl p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 mb-4">
                  <User className="h-10 w-10 text-primary-600 dark:text-primary-400" />
                </div>
                <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100">
                  {user.fullName}
                </h2>
                <p className="text-sm text-surface-500 dark:text-surface-400">@{user.userName}</p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-surface-600 dark:text-surface-400">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-surface-600 dark:text-surface-400">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{user.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-3 text-surface-600 dark:text-surface-400">
                  <Shield className="h-4 w-4 shrink-0" />
                  <span>{t.dashboard.roleName}: {user.roleName}</span>
                </div>
                <div className="flex items-center gap-3 text-surface-600 dark:text-surface-400">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span>{t.dashboard.memberSince}: {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Edit forms */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' as const }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Edit profile */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-lg text-surface-900 dark:text-surface-100">
                  {t.dashboard.editProfile}
                </h2>
                {!editing && (
                  <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                    {t.common.edit}
                  </Button>
                )}
              </div>

              {saveMsg && (
                <div className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 mb-4">
                  <Check className="h-4 w-4" />
                  {saveMsg}
                </div>
              )}

              {editing ? (
                <div className="space-y-4">
                  <Input
                    label={t.dashboard.fullName}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    icon={<User className="h-4 w-4" />}
                  />
                  <Input
                    label={t.dashboard.phoneNumber}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    icon={<Phone className="h-4 w-4" />}
                  />
                  {saveError && (
                    <div className="flex items-center gap-2 text-sm text-red-500">
                      <AlertCircle className="h-4 w-4" />
                      {saveError}
                    </div>
                  )}
                  <div className="flex gap-3">
                    <Button onClick={handleSaveProfile} loading={saving}>
                      {t.dashboard.save}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditing(false);
                        setFullName(user.fullName || '');
                        setPhoneNumber(user.phoneNumber || '');
                        setSaveError('');
                      }}
                    >
                      {t.common.cancel}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-surface-500 dark:text-surface-400">{t.dashboard.userName}</p>
                    <p className="font-medium text-surface-900 dark:text-surface-100 mt-1">
                      {user.userName}
                    </p>
                  </div>
                  <div>
                    <p className="text-surface-500 dark:text-surface-400">{t.dashboard.emailAddress}</p>
                    <p className="font-medium text-surface-900 dark:text-surface-100 mt-1">
                      {user.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-surface-500 dark:text-surface-400">{t.dashboard.fullName}</p>
                    <p className="font-medium text-surface-900 dark:text-surface-100 mt-1">
                      {user.fullName}
                    </p>
                  </div>
                  <div>
                    <p className="text-surface-500 dark:text-surface-400">{t.dashboard.phoneNumber}</p>
                    <p className="font-medium text-surface-900 dark:text-surface-100 mt-1">
                      {user.phoneNumber}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Change password */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-lg text-surface-900 dark:text-surface-100">
                  {t.dashboard.changePassword}
                </h2>
                {!changingPw && (
                  <Button variant="outline" size="sm" onClick={() => setChangingPw(true)}>
                    <Lock className="h-4 w-4 mr-1" />
                    {t.dashboard.changePassword}
                  </Button>
                )}
              </div>

              {pwMsg && (
                <div className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 mb-4">
                  <Check className="h-4 w-4" />
                  {pwMsg}
                </div>
              )}

              {changingPw && (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <Input
                    label={t.dashboard.currentPassword}
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    icon={<Lock className="h-4 w-4" />}
                  />
                  <Input
                    label={t.dashboard.newPassword}
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    icon={<Lock className="h-4 w-4" />}
                  />
                  <Input
                    label={t.dashboard.confirmNewPassword}
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    icon={<Lock className="h-4 w-4" />}
                  />
                  {pwError && (
                    <div className="flex items-center gap-2 text-sm text-red-500">
                      <AlertCircle className="h-4 w-4" />
                      {pwError}
                    </div>
                  )}
                  <div className="flex gap-3">
                    <Button type="submit" loading={pwSaving}>
                      {t.dashboard.save}
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => {
                        setChangingPw(false);
                        setOldPassword('');
                        setNewPassword('');
                        setConfirmNewPassword('');
                        setPwError('');
                      }}
                    >
                      {t.common.cancel}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
