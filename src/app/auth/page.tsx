'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Leaf,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Truck,
  ShoppingBag,
  Store,
  Shield,
  Star,
  Headphones,
  AlertCircle,
} from 'lucide-react';
import { useTranslation } from '@/features/i18n';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { loginUser, registerUser, clearError } from '@/features/auth';
import { Button, Input } from '@/shared/ui';
import { cn } from '@/shared/lib/utils';
import { marketService } from '@/entities/market';
import type { Market } from '@/entities/market';
import { getHomeByRole } from '@/shared/lib/dashboard-routing';

const roleOptions = [
  { value: 'User', key: 'roleUser' as const, icon: ShoppingBag },
  { value: 'Seller', key: 'roleSeller' as const, icon: Store },
  { value: 'Courier', key: 'roleCourier' as const, icon: Truck },
];

// if (process.env.NODE_ENV === 'production') {
//   // регистрация service worker
// }

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Загрузка...</div>}>
      <AuthContent />
    </Suspense>
  );
}

function AuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated, user } = useAppSelector((s) => s.auth);

  const isRegister = searchParams.get('mode') === 'register';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userName, setUserName] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('User');
  const [marketId, setMarketId] = useState<number | null>(null);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isAuthenticated && user?.roleName) {
      const redirectPath = getHomeByRole(user.roleName);
      router.push(redirectPath);
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    dispatch(clearError());
    setValidationErrors({});
  }, [isRegister, dispatch]);

  useEffect(() => {
    if (isRegister) {
      marketService.getAll({ PageSize: 50 }).then((res) => setMarkets(res.items || [])).catch(() => {});
    }
  }, [isRegister]);

  const validateLogin = (): boolean => {
    const errors: Record<string, string> = {};
    if (!email) errors.email = t.auth.email;
    if (!password) errors.password = t.auth.password;
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegister = (): boolean => {
    const errors: Record<string, string> = {};
    if (!userName) errors.userName = t.auth.invalidUserName;
    if (!email) errors.email = t.auth.email;
    if (!fullName) errors.fullName = t.auth.fullName;
    if (!phone) errors.phone = t.auth.invalidPhone;
    if (!password) errors.password = t.auth.invalidPassword;
    if (password !== confirmPassword) errors.confirmPassword = t.auth.passwordsMismatch;
    if (role === 'Seller' && !marketId) errors.market = t.auth.selectMarket;
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      if (!validateRegister()) return;
      dispatch(
        registerUser({
          userName,
          email,
          fullName,
          phoneNumber: phone,
          password,
          confirmPassword,
          role,
          marketId: role === 'Seller' ? marketId : null,
        })
      );
    } else {
      if (!validateLogin()) return;
      dispatch(loginUser({ email, password }));
    }
  };

  const fillDemo = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setValidationErrors({});
    dispatch(clearError());
  };

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: 'easeOut' as const },
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel — green gradient */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex-col justify-between p-12 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.15), transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1), transparent 50%)' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Leaf className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold">Dehqon.tj</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            {isRegister ? t.auth.welcomeNew : t.auth.welcomeBack}
          </h1>
          <p className="text-lg text-white/80 max-w-md">{t.auth.heroSubtitle}</p>
        </div>
        <div className="relative z-10 space-y-6">
          {[
            { icon: Truck, text: t.auth.benefitDelivery },
            { icon: Star, text: t.auth.benefitQuality },
            { icon: Headphones, text: t.auth.benefitSupport },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                <item.icon className="h-5 w-5" />
              </div>
              <span className="text-white/90 font-medium">{item.text}</span>
            </div>
          ))}
        </div>
        <p className="relative z-10 text-sm text-white/50">© 2026 Dehqon.tj</p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-12 bg-white dark:bg-surface-950">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-surface-900 dark:text-surface-100">Dehqon.tj</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={isRegister ? 'register' : 'login'} {...fadeUp}>
              <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">
                {isRegister ? t.auth.registerTitle : t.auth.loginTitle}
              </h2>
              <p className="text-surface-500 dark:text-surface-400 mb-8">
                {isRegister ? t.auth.registerSubtitle : t.auth.loginSubtitle}
              </p>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-600 dark:text-red-400"
                >
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {isRegister && (
                  <>
                    {/* Role selector */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-surface-700 dark:text-surface-300">
                        {t.auth.role}
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {roleOptions.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setRole(opt.value)}
                            className={cn(
                              'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200',
                              role === opt.value
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                : 'border-surface-200 dark:border-surface-700 text-surface-500 dark:text-surface-400 hover:border-surface-300 dark:hover:border-surface-600'
                            )}
                          >
                            <opt.icon className="h-6 w-6" />
                            <span className="text-xs font-medium">{t.auth[opt.key]}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <Input
                      label={t.auth.userName}
                      placeholder={t.auth.userNamePlaceholder}
                      icon={<User className="h-4 w-4" />}
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      error={validationErrors.userName}
                    />
                    <p className="text-xs text-surface-400 -mt-2">{t.auth.userNameHint}</p>

                    <Input
                      label={t.auth.fullName}
                      placeholder={t.auth.fullNamePlaceholder}
                      icon={<User className="h-4 w-4" />}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      error={validationErrors.fullName}
                    />

                    <Input
                      label={t.auth.phone}
                      placeholder={t.auth.phonePlaceholder}
                      icon={<Phone className="h-4 w-4" />}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      error={validationErrors.phone}
                    />
                  </>
                )}

                <Input
                  label={t.auth.email}
                  type="email"
                  placeholder={t.auth.emailPlaceholder}
                  icon={<Mail className="h-4 w-4" />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={validationErrors.email}
                />

                <div className="relative">
                  <Input
                    label={t.auth.password}
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t.auth.passwordPlaceholder}
                    icon={<Lock className="h-4 w-4" />}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={validationErrors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[38px] text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {isRegister && (
                  <p className="text-xs text-surface-400 -mt-2">{t.auth.passwordRequirements}</p>
                )}

                {isRegister && (
                  <>
                    <div className="relative">
                      <Input
                        label={t.auth.confirmPassword}
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder={t.auth.confirmPasswordPlaceholder}
                        icon={<Lock className="h-4 w-4" />}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={validationErrors.confirmPassword}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-[38px] text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    {role === 'Seller' && (
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                          {t.auth.selectMarket}
                        </label>
                        <select
                          value={marketId ?? ''}
                          onChange={(e) => setMarketId(e.target.value ? Number(e.target.value) : null)}
                          className={cn(
                            'flex h-11 w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 px-4 py-2 text-sm text-surface-900 dark:text-surface-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                            validationErrors.market && 'border-red-500 focus:ring-red-500'
                          )}
                        >
                          <option value="">{t.auth.selectMarket}</option>
                          {markets.map((m) => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                          ))}
                        </select>
                        {validationErrors.market && (
                          <p className="mt-1.5 text-sm text-red-500">{validationErrors.market}</p>
                        )}
                      </div>
                    )}
                  </>
                )}

                {!isRegister && (
                  <div className="flex justify-end">
                    <button type="button" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                      {t.auth.forgotPassword}
                    </button>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {isRegister ? t.auth.register : t.auth.login}
                </Button>
              </form>

              {/* Switch between login/register */}
              <p className="mt-6 text-center text-sm text-surface-500 dark:text-surface-400">
                {isRegister ? t.auth.hasAccount : t.auth.noAccount}{' '}
                <button
                  type="button"
                  onClick={() => router.push(isRegister ? '/auth' : '/auth?mode=register')}
                  className="font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                >
                  {isRegister ? t.auth.switchToLogin : t.auth.switchToRegister}
                </button>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
