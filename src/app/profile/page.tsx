"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  Package,
  Star,
  MessageSquare,
  ShoppingBag,
  Edit3,
  ChevronRight,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ArrowUpRight,
} from "lucide-react";
import { useTranslation } from "@/features/i18n";
import { Skeleton } from "@/shared/ui/Skeleton";
import { userService } from "@/entities/user";
import { orderService } from "@/entities/order";
import { reviewService } from "@/entities/review";
import type { User } from "@/entities/user";
import type { Order } from "@/entities/order";
import type { Review } from "@/entities/review";

/* ─────────────────────────────────────────────────────
   STATUS CONFIG — разделены bg и text для чистоты
───────────────────────────────────────────────────── */
type StatusCfg = {
  label: string;
  bg: string;
  text: string;
  icon: React.ElementType;
};

// В начале файла, рядом с STATUS_CFG
const STATUS_MAP: Record<number, string> = {
  0: "Pending",
  1: "Processing",
  2: "Shipped",
  3: "Delivered",
  4: "Cancelled",
};

const STATUS_CFG: Record<string, StatusCfg> = {
  Pending: {
    label: "Ожидание",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    text: "text-amber-600",
    icon: Clock,
  },
  Processing: {
    label: "В обработке",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    text: "text-blue-600",
    icon: Package,
  },
  Shipped: {
    label: "Доставляется",
    bg: "bg-indigo-50 dark:bg-indigo-500/10",
    text: "text-indigo-600",
    icon: Truck,
  },
  Delivered: {
    label: "Доставлено",
    bg: "bg-green-50 dark:bg-green-500/10",
    text: "text-green-600",
    icon: CheckCircle,
  },
  Cancelled: {
    label: "Отменён",
    bg: "bg-red-50 dark:bg-red-500/10",
    text: "text-red-500",
    icon: XCircle,
  },
};

function getStatus(status: number | string): StatusCfg {
  const key = typeof status === "number" ? STATUS_MAP[status] : status;
  return STATUS_CFG[key] ?? STATUS_CFG["Pending"];
}

/* ─────────────────────────────────────────────────────
   STAR ROW
───────────────────────────────────────────────────── */
function Stars({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "md";
}) {
  const cls = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";
  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={[
            cls,
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "text-black/10 dark:text-white/10",
          ].join(" ")}
        />
      ))}
    </div>
  );
}

const TABS = ["Обзор", "Заказы", "Отзывы"] as const;
type Tab = (typeof TABS)[number];

/* ─────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────── */
export default function ProfilePage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation();

  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("Обзор");

  useEffect(() => {
    Promise.all([
      userService.getMe(),
      orderService.getMy(),
      reviewService.getAll(),
    ])
      .then(([u, o, r]) => {
        setUser(u);
        setOrders(
          Array.isArray(o) ? o : ((o as { items?: Order[] })?.items ?? []),
        );
        setReviews(
          Array.isArray(r) ? r : ((r as { items?: Review[] })?.items ?? []),
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-[#f8f7f4] dark:bg-[#0f0f0f]">
        <div className="mx-auto max-w-5xl px-6 py-10 space-y-6">
          <div className="flex gap-6 items-end">
            <Skeleton className="h-24 w-24 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );

  /* stats */
  const delivered = orders.filter(
    (o) =>
      (typeof o.status === "number" ? STATUS_MAP[o.status] : o.status) ===
      "Delivered",
  ).length;
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  /* user display fields — используем реальные поля */
  const avatarSrc = user?.profilePhotoUrl ?? null;
  const displayName = user?.userName ?? "Пользователь";

  return (
    <div className="min-h-screen bg-[#f8f7f4] dark:bg-[#0f0f0f]">
      {/* ══ HEADER ══ */}
      <div className="bg-white dark:bg-[#141414] border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="mx-auto max-w-5xl px-6 py-10">
          {/* top row */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-6">
            {/* avatar */}
            <div className="relative shrink-0">
              <div className="h-24 w-24 rounded-2xl overflow-hidden bg-primary-100 dark:bg-primary-500/10 ring-2 ring-white dark:ring-[#141414] flex items-center justify-center text-3xl font-bold text-primary-600 dark:text-primary-400">
                {avatarSrc ? (
                  <Image
                    src={avatarSrc}
                    alt={displayName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  displayName.charAt(0).toUpperCase()
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white dark:border-[#141414]" />
            </div>

            {/* info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white">
                  {displayName}
                </h1>
              </div>
              <p className="mt-1 text-sm text-black/45 dark:text-white/45">
                {user?.email}
              </p>
              {user?.phoneNumber && (
                <p className="mt-1.5 flex items-center gap-1 text-sm text-black/45 dark:text-white/45">
                  <MapPin className="h-3.5 w-3.5" />
                  {user.phoneNumber}
                </p>
              )}
            </div>

            {/* edit btn */}
            <Link href="/settings">
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#1c1c1c] px-4 py-2.5 text-sm font-medium text-[#1a1a1a] dark:text-white hover:bg-[#f0efeb] dark:hover:bg-[#242424] transition-colors"
              >
                <Edit3 className="h-4 w-4" /> Редактировать
              </button>
            </Link>
          </div>

          {/* stat cards */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                label: "Всего заказов",
                value: orders.length,
                icon: ShoppingBag,
              },
              { label: "Доставлено", value: delivered, icon: CheckCircle },
              { label: "Отзывов", value: reviews.length, icon: MessageSquare },
              { label: "Ср. оценка", value: avgRating, icon: Star },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-xl bg-[#f8f7f4] dark:bg-[#1c1c1c] p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-4 w-4 text-primary-500" />
                  <span className="text-xs text-black/40 dark:text-white/40 font-medium">
                    {label}
                  </span>
                </div>
                <p className="text-2xl font-bold text-[#1a1a1a] dark:text-white tabular-nums">
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* tabs */}
          <div className="mt-6 flex gap-1 border-b border-black/[0.06] dark:border-white/[0.06]">
            {TABS.map((tabItem) => (
              <button
                key={tabItem}
                type="button"
                onClick={() => setTab(tabItem)}
                className={[
                  "relative px-4 py-2.5 text-sm font-medium transition-colors",
                  tab === tabItem
                    ? "text-[#1a1a1a] dark:text-white"
                    : "text-black/45 dark:text-white/45 hover:text-black/70 dark:hover:text-white/70",
                ].join(" ")}
              >
                {tabItem}
                {tab === tabItem && (
                  <motion.div
                    layoutId="profile-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══ CONTENT ══ */}
      <div className="mx-auto max-w-5xl px-6 py-8">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* ── OVERVIEW ── */}
          {tab === "Обзор" && (
            <div className="grid gap-4 sm:grid-cols-2">
              {/* orders mini */}
              <div className="rounded-2xl bg-white dark:bg-[#141414] border border-black/[0.06] dark:border-white/[0.06] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#1a1a1a] dark:text-white">
                    Последние заказы
                  </h3>
                  <button
                    type="button"
                    onClick={() => setTab("Заказы")}
                    className="text-xs text-primary-500 flex items-center gap-0.5"
                  >
                    Все <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="space-y-3">
                  {orders.slice(0, 3).length === 0 && (
                    <p className="text-sm text-black/40 dark:text-white/40 text-center py-4">
                      Нет заказов
                    </p>
                  )}
                  {orders.slice(0, 3).map((order) => {
                    const cfg = getStatus(order.status);
                    const Icon = cfg.icon;
                    return (
                      <div key={order.id} className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${cfg.bg}`}
                        >
                          <Icon className={`h-4 w-4 ${cfg.text}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#1a1a1a] dark:text-white truncate">
                            Заказ #{order.id}
                          </p>
                          <p className="text-xs text-black/40 dark:text-white/40">
                            {new Date(order.createdAt).toLocaleDateString(
                              "ru-RU",
                            )}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}
                        >
                          {cfg.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* reviews mini */}
              <div className="rounded-2xl bg-white dark:bg-[#141414] border border-black/[0.06] dark:border-white/[0.06] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#1a1a1a] dark:text-white">
                    Мои отзывы
                  </h3>
                  <button
                    type="button"
                    onClick={() => setTab("Отзывы")}
                    className="text-xs text-primary-500 flex items-center gap-0.5"
                  >
                    Все <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="space-y-3">
                  {reviews.slice(0, 3).length === 0 && (
                    <p className="text-sm text-black/40 dark:text-white/40 text-center py-4">
                      Нет отзывов
                    </p>
                  )}
                  {reviews.slice(0, 3).map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-black/[0.05] dark:border-white/[0.05] pb-3 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Stars rating={review.rating} />
                        <span className="text-xs text-black/35 dark:text-white/35">
                          {new Date(review.createdAt).toLocaleDateString(
                            "ru-RU",
                          )}
                        </span>
                      </div>
                      <p className="text-sm text-[#1a1a1a] dark:text-white line-clamp-2">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── ORDERS ── */}
          {tab === "Заказы" && (
            <div className="space-y-3">
              {orders.length === 0 && (
                <div className="rounded-2xl bg-white dark:bg-[#141414] border border-black/[0.06] dark:border-white/[0.06] p-12 text-center">
                  <ShoppingBag className="mx-auto h-10 w-10 text-black/15 dark:text-white/15 mb-3" />
                  <p className="text-sm text-black/40 dark:text-white/40">
                    Заказов пока нет
                  </p>
                  <Link href="/catalog">
                    <button
                      type="button"
                      className="mt-4 text-sm text-primary-500 font-medium"
                    >
                      Перейти в каталог
                    </button>
                  </Link>
                </div>
              )}
              {orders.map((order) => {
                const cfg = getStatus(order.status);
                const Icon = cfg.icon;
                return (
                  <div
                    key={order.id}
                    className="rounded-2xl bg-white dark:bg-[#141414] border border-black/[0.06] dark:border-white/[0.06] p-5 flex items-center gap-4"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${cfg.bg}`}
                    >
                      <Icon className={`h-5 w-5 ${cfg.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-[#1a1a1a] dark:text-white">
                          Заказ #{order.id}
                        </p>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}
                        >
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-sm text-black/40 dark:text-white/40 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("ru-RU", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-[#1a1a1a] dark:text-white tabular-nums">
                        {order.totalAmount} TJS
                      </p>
                      <Link href={`/orders/${order.id}`}>
                        <button
                          type="button"
                          className="mt-1 flex items-center gap-0.5 text-xs text-primary-500"
                        >
                          Детали <ArrowUpRight className="h-3 w-3" />
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── REVIEWS ── */}
          {tab === "Отзывы" && (
            <div className="space-y-3">
              {reviews.length === 0 && (
                <div className="rounded-2xl bg-white dark:bg-[#141414] border border-black/[0.06] dark:border-white/[0.06] p-12 text-center">
                  <Star className="mx-auto h-10 w-10 text-black/15 dark:text-white/15 mb-3" />
                  <p className="text-sm text-black/40 dark:text-white/40">
                    Вы ещё не оставляли отзывов
                  </p>
                </div>
              )}
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl bg-white dark:bg-[#141414] border border-black/[0.06] dark:border-white/[0.06] p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
                      <Star className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <Stars rating={review.rating} size="md" />
                        <span className="text-xs text-black/35 dark:text-white/35">
                          {new Date(review.createdAt).toLocaleDateString(
                            "ru-RU",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )}
                        </span>
                        {/* автор отзыва */}
                        <span className="text-xs font-medium text-black/40 dark:text-white/40">
                          {review.userName}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-[#1a1a1a] dark:text-white leading-relaxed">
                        {review.comment}
                      </p>
                      {/* ссылка на товар — только по productId, без productName */}
                      <Link href={`/catalog/${review.productId}`}>
                        <p className="mt-2 text-xs text-primary-500 font-medium flex items-center gap-0.5 hover:underline">
                          Перейти к товару <ArrowUpRight className="h-3 w-3" />
                        </p>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
