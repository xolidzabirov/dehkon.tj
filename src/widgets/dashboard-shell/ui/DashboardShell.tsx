"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ExternalLink,
  LogOut,
  Menu,
  Moon,
  Search,
  Sun,
  User,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { logout } from "@/features/auth";
import { useTheme } from "@/features/theme";
import { cn } from "@/shared/lib/utils";
import {
  getDashboardBasePath,
  getDashboardNavItems,
  getRoleLabel,
  getUserInitial,
} from "@/shared/lib/dashboard-routing";

function getRoleBadge(role?: string | null) {
  switch (role) {
    case "Admin":
      return { label: "Админ", className: "bg-red-500/20 text-red-400" };
    case "Seller":
      return {
        label: "Продавец",
        className: "bg-emerald-500/20 text-emerald-400",
      };
    case "Courier":
      return { label: "Курьер", className: "bg-blue-500/20 text-blue-400" };
    default:
      return {
        label: "Покупатель",
        className: "bg-primary-500/20 text-primary-400",
      };
  }
}

function UserDropdown({
  name,
  initial,
  role,
  email,
  basePath,
  onLogout,
}: {
  name: string;
  initial: string;
  role: string;
  email: string;
  basePath: string;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-surface-100 dark:hover:bg-surface-800"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-500 font-bold text-white">
          {initial}
        </div>

        <div className="hidden text-left sm:block">
          <p className="max-w-[140px] truncate text-sm font-semibold text-surface-800 dark:text-surface-100">
            {name}
          </p>
          <p className="text-xs text-surface-400">{getRoleLabel(role)}</p>
        </div>

        <ChevronDown
          className={cn(
            "h-4 w-4 text-surface-400 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-[52px] z-50 w-72 overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-2xl dark:border-surface-700 dark:bg-surface-900"
          >
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-lg font-bold">
                  {initial}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-bold">{name}</p>
                  <p className="text-sm text-white/80">{getRoleLabel(role)}</p>
                  {!!email && (
                    <p className="truncate text-xs text-white/60">{email}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-2">
              <Link
                href={basePath}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-surface-100 dark:hover:bg-surface-800"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-100 dark:bg-surface-800">
                  <LayoutDashboard className="h-4 w-4 text-surface-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-surface-800 dark:text-surface-100">
                    Кабинет
                  </p>
                  <p className="text-xs text-surface-400">Панель управления</p>
                </div>
              </Link>

              <Link
                href={`${basePath}/profile`}
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
                href={`${basePath}/settings`}
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
                  <p className="text-xs text-surface-400">Параметры кабинета</p>
                </div>
              </Link>

              <div className="my-1.5 h-px bg-surface-100 dark:bg-surface-800" />

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onLogout();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 dark:bg-red-900/20">
                  <LogOut className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Выйти</p>
                  <p className="text-xs text-red-400">Завершить сессию</p>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
      return;
    }

    if (!user) return;

    const roleBase = getDashboardBasePath(user?.roleName) ?? '/dashboard';

    if (pathname === "/dashboard") return;

    if (!pathname.startsWith(roleBase)) {
      router.replace(roleBase);
    }
  }, [isAuthenticated, pathname, router, user]);

  if (!user) return null;

  const navItems = getDashboardNavItems(user.roleName);
  const name = user.fullName || user.userName || "User";
  const initial = getUserInitial(name);
  const badge = getRoleBadge(user.roleName);
  const basePath = getDashboardBasePath(user.roleName) ?? "/dashboard";

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("dehkon_token");
    router.replace("/");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-surface-100 dark:bg-surface-950">
      <aside
        className={cn(
          "flex shrink-0 flex-col bg-surface-900 text-white transition-all duration-300",
          sidebarOpen ? "w-64" : "w-16",
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b border-surface-700 px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-500 text-lg font-bold text-white">
            D
          </div>

          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">Dehkon</span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                  badge.className,
                )}
              >
                {badge.label}
              </span>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
          {navItems
            .filter((item) => item.href !== "/")
            .map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href ||
                (item.href !== basePath && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary-500 text-white"
                      : "text-surface-400 hover:bg-surface-800 hover:text-white",
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              );
            })}
        </nav>

        <div className="space-y-1 border-t border-surface-700 px-2 py-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-emerald-400 transition-colors hover:bg-surface-800"
          >
            <ExternalLink className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span>Вернуться на сайт</span>}
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-surface-800"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span>Выйти</span>}
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-surface-200 bg-white px-6 dark:border-surface-700 dark:bg-surface-900">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen((p) => !p)}
              className="rounded-lg p-2 text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800"
            >
              {sidebarOpen ? (
                <ChevronLeft className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                placeholder="Поиск..."
                className="h-9 w-64 rounded-xl border border-surface-200 bg-surface-50 pl-10 pr-4 text-sm outline-none focus:border-primary-500 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-100"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-lg p-2 text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            <button
              type="button"
              className="relative rounded-lg p-2 text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary-500" />
            </button>

            <UserDropdown
              name={name}
              initial={initial}
              role={user.roleName}
              email={user.email}
              basePath={basePath}
              onLogout={handleLogout}
            />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
