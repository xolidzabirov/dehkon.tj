"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Menu,
  X,
  Sun,
  Moon,
  User,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Settings,
  Shield,
  Truck,
  Store,
} from "lucide-react";
import { useTranslation, type Locale } from "@/features/i18n";
import { useTheme } from "@/features/theme";
import { useAppSelector, useAppDispatch } from "@/shared/store/hooks";
import { logout } from "@/features/auth";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/Button";
import { Badge } from "@/shared/ui/Badge";

const NAV_LINKS = [
  { href: "/", key: "home" as const },
  { href: "/catalog", key: "products" as const },
  { href: "/news", key: "news" as const },
  { href: "/about", key: "about" as const },
  { href: "/contact", key: "contact" as const },
];

const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "tj", label: "Тоҷикӣ", flag: "https://flagcdn.com/tj.svg" },
  { code: "ru", label: "Русский", flag: "https://flagcdn.com/ru.svg" },
  { code: "en", label: "English", flag: "https://flagcdn.com/us.svg" },
];

function getDashboardHref(role?: string | null) {
  return role === "Admin" ? "/admin" : "/dashboard";
}

function getRoleInfo(role?: string | null) {
  switch (role) {
    case "Admin":
      return {
        label: "Администратор",
        icon: Shield,
        bg: "bg-green-500",
      };
    case "Seller":
      return {
        label: "Продавец",
        icon: Store,
        bg: "bg-emerald-500",
      };
    case "Courier":
      return {
        label: "Курьер",
        icon: Truck,
        bg: "bg-blue-500",
      };
    default:
      return {
        label: "Покупатель",
        icon: User,
        bg: "bg-primary-500",
      };
  }
}

function getDashboardLabel(role?: string | null) {
  switch (role) {
    case "Admin":
      return "Панель администратора";
    case "Seller":
      return "Кабинет продавца";
    case "Courier":
      return "Кабинет курьера";
    default:
      return "Личный кабинет";
  }
}

function getInitial(name?: string | null) {
  return (name?.trim()?.charAt(0) || "U").toUpperCase();
}

interface DropdownUser {
  userName?: string | null;
  fullName?: string | null;
  email?: string | null;
  roleName?: string | null;
}

function UserDropdown({ user }: { user: DropdownUser }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const name = user.fullName || user.userName || "User";
  const initial = getInitial(name);
  const role = getRoleInfo(user.roleName);
  const dashHref = getDashboardHref(user.roleName);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-3 rounded-xl bg-white px-3 py-2 shadow-sm transition-colors hover:bg-surface-50 dark:bg-surface-900 dark:hover:bg-surface-800"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-600 dark:bg-green-500/15 dark:text-green-400">
          {initial}
        </div>

        <div className="hidden min-w-0 text-left md:block">
          <p className="max-w-[120px] truncate text-sm font-semibold text-surface-800 dark:text-surface-100">
            {name}
          </p>
          <p className="max-w-[120px] truncate text-xs text-surface-400">
            {user.email || "user@gmail.com"}
          </p>
        </div>

        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-surface-400 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-[56px] z-50 w-72 overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-2xl dark:border-surface-700 dark:bg-surface-900"
          >
            <div className="border-b border-surface-100 p-4 dark:border-surface-800">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-base font-bold text-green-600 dark:bg-green-500/15 dark:text-green-400">
                  {initial}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-surface-900 dark:text-surface-100">
                    {name}
                  </p>
                  <p className="text-xs text-surface-500">{role.label}</p>
                  {user.email && (
                    <p className="mt-0.5 truncate text-xs text-surface-400">
                      {user.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-2">
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-surface-100 dark:hover:bg-surface-800"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-100 dark:bg-surface-800">
                  <User className="h-4 w-4 text-surface-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-surface-800 dark:text-surface-100">
                    Профиль
                  </p>
                  <p className="text-xs text-surface-400">Личные данные</p>
                </div>
              </Link>

              <Link
                href={dashHref}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-surface-100 dark:hover:bg-surface-800"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-100 dark:bg-surface-800">
                  <LayoutDashboard className="h-4 w-4 text-surface-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-surface-800 dark:text-surface-100">
                    Мой кабинет
                  </p>
                  <p className="text-xs text-surface-400">
                    {getDashboardLabel(user.roleName)}
                  </p>
                </div>
              </Link>

              <Link
                href={`${dashHref}/profile`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-surface-100 dark:hover:bg-surface-800"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-100 dark:bg-surface-800">
                  <Settings className="h-4 w-4 text-surface-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-surface-800 dark:text-surface-100">
                    Настройки
                  </p>
                  <p className="text-xs text-surface-400">
                    Профиль и параметры
                  </p>
                </div>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LocaleDropdown({
  locale,
  setLocale,
}: {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const activeLocale = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];
  const otherLocales = LOCALES.filter((l) => l.code !== locale);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        title={activeLocale.label}
        aria-label={activeLocale.label}
        className={cn(
          "group relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full",
          "bg-white shadow-sm transition-all duration-200",
          "hover:scale-[1.03] hover:shadow-md dark:border-surface-700 dark:bg-surface-900",
          open && "ring-2 ring-primary-500/20",
        )}
      >
        <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-white shadow-inner dark:border-white/10">
          <img
            src={activeLocale.flag}
            alt={activeLocale.label}
            className="h-full w-full object-cover"
            draggable={false}
          />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.16 }}
            className="absolute left-1/2 top-[48px] z-50 -translate-x-1/2 overflow-hidden rounded-2xl border border-surface-200 bg-white p-1 shadow-xl dark:border-surface-700 dark:bg-surface-900"
          >
            <div className="flex flex-col gap-1">
              {otherLocales.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => {
                    setLocale(l.code);
                    setOpen(false);
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-100 dark:hover:bg-surface-800"
                  title={l.label}
                >
                  <img
                    src={l.flag}
                    alt={l.label}
                    className="h-5 w-5 rounded-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Header() {
  const { t, locale, setLocale } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((s) => s.auth);
  const cart = useAppSelector((s) => s.cart.cart);
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const cartCount = cart?.items?.length ?? 0;

  const handleLogout = () => {
    dispatch(logout());
    setMobileOpen(false);
    router.replace("/");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-surface-200 bg-white/90 backdrop-blur-md dark:border-surface-700 dark:bg-surface-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0">
          <span className="text-2xl font-bold gradient-text">Dehkon.tj</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative rounded-lg px-3 py-2 text-sm font-medium text-surface-600 transition-colors hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100 after:absolute after:bottom-1 after:left-3 after:right-3 after:h-[2px] after:origin-left after:scale-x-0 after:rounded-full after:bg-primary-500 after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              {t.nav[link.key]}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1.5 lg:flex">
          <LocaleDropdown locale={locale} setLocale={setLocale} />

          <button
            onClick={toggleTheme}
            type="button"
            className="rounded-lg p-2 text-surface-500 transition-colors hover:bg-surface-100 dark:hover:bg-surface-800"
            title="Theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          <Link
            href="/cart"
            className="relative rounded-lg p-2 text-surface-500 transition-colors hover:bg-surface-100 dark:hover:bg-surface-800"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-[10px] font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {user?.roleName === "Admin" && (
            <Link
              href="/admin"
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-green-500 transition-colors hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-500/10"
            >
              <Shield className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-500">Admin</span>
            </Link>
          )}

          {!mounted ? (
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-surface-200 dark:bg-surface-800" />
              <div className="hidden md:block">
                <div className="h-3 w-24 rounded bg-surface-200 dark:bg-surface-800" />
                <div className="mt-2 h-3 w-32 rounded bg-surface-200 dark:bg-surface-800" />
              </div>
            </div>
          ) : user ? (
            <div className="flex items-center gap-1">
              <UserDropdown user={user} />
              <button
                onClick={handleLogout}
                type="button"
                className="rounded-lg p-2 text-surface-500 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                title="Выйти"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth">
                <Button variant="ghost" size="sm">
                  {t.nav.login}
                </Button>
              </Link>
              <Link href="/auth?mode=register">
                <Button size="sm">{t.nav.register}</Button>
              </Link>
            </div>
          )}
        </div>

        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          type="button"
          className="rounded-lg p-2 text-surface-500 lg:hidden"
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-surface-200 dark:border-surface-700 lg:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800"
                >
                  {t.nav[link.key]}
                </Link>
              ))}

              <Link
                href="/cart"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800"
              >
                <ShoppingCart className="h-4 w-4" />
                {t.nav.cart}
                {cartCount > 0 && <Badge>{cartCount}</Badge>}
              </Link>

              <div className="flex items-center gap-2 px-3 py-2">
                <div className="flex items-center rounded-2xl border border-surface-200 bg-white p-1 dark:border-surface-700 dark:bg-surface-900">
                  {LOCALES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLocale(l.code)}
                      type="button"
                      title={l.label}
                      className={cn(
                        "rounded-xl p-1 transition-colors hover:bg-surface-100 dark:hover:bg-surface-800",
                        locale === l.code &&
                          "bg-primary-500/10 dark:bg-primary-500/20",
                      )}
                    >
                      <img
                        src={l.flag}
                        alt={l.label}
                        className="h-6 w-6 rounded-lg object-cover"
                      />
                    </button>
                  ))}
                </div>

                <button
                  onClick={toggleTheme}
                  type="button"
                  className="rounded-lg p-2 text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800"
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="border-t border-surface-200 pt-3 dark:border-surface-700">
                {user ? (
                  <div className="space-y-1">
                    <div className="mb-3 flex items-center gap-3 rounded-xl bg-surface-100 p-3 dark:bg-surface-900">
                      <div
                        className={cn(
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white",
                          getRoleInfo(user.roleName).bg,
                        )}
                      >
                        {getInitial(user.fullName || user.userName)}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-surface-800 dark:text-surface-100">
                          {user.fullName || user.userName}
                        </p>
                        <p className="text-xs text-surface-500">
                          {getRoleInfo(user.roleName).label}
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800"
                    >
                      <User className="h-4 w-4" />
                      Профиль
                    </Link>

                    <Link
                      href={getDashboardHref(user.roleName)}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Мой кабинет
                    </Link>

                    <Link
                      href={`${getDashboardHref(user.roleName)}/profile`}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800"
                    >
                      <Settings className="h-4 w-4" />
                      Настройки
                    </Link>

                    <button
                      onClick={handleLogout}
                      type="button"
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      {t.nav.logout}
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 px-3">
                    <Link
                      href="/auth"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1"
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        {t.nav.login}
                      </Button>
                    </Link>
                    <Link
                      href="/auth?mode=register"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1"
                    >
                      <Button size="sm" className="w-full">
                        {t.nav.register}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
