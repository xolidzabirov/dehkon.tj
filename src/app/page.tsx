'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Truck,
  ShieldCheck,
  Star,
  Leaf,
  ArrowRight,
  Store,
  Users,
  Package,
  MapPin,
  Headphones,
} from 'lucide-react';
import { useTranslation } from '@/features/i18n';
import { Button } from '@/shared/ui/Button';
import { Card, CardContent } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { Skeleton } from '@/shared/ui/Skeleton';
import { productService } from '@/entities/product';
import { marketService } from '@/entities/market';
import { categoryService } from '@/entities/category';
import type { Product } from '@/entities/product';
import type { Market } from '@/entities/market';
import type { Category } from '@/entities/category';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function HomePage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingMarkets, setLoadingMarkets] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    productService
      .getAll({ PageSize: 8 })
      .then((res) => setProducts(res.items))
      .catch(() => {})
      .finally(() => setLoadingProducts(false));

    marketService
      .getAll({ PageSize: 6 })
      .then((res) => setMarkets(res.items))
      .catch(() => {})
      .finally(() => setLoadingMarkets(false));

    categoryService
      .getAll({ PageSize: 10 })
      .then((res) => setCategories(res.items))
      .catch(() => {})
      .finally(() => setLoadingCategories(false));
  }, []);

  // Fallback emoji map for categories that don't have images
  const categoryEmojiMap: Record<string, string> = {
    'Мева': '🍎',
    'Сабзавот': '🥬',
    'Маҳсулоти ширӣ': '🥛',
    'Гӯшт': '🥩',
    'Меваи хушк': '🍇',
    'Равған ва чарбӣ': '🫒',
  };

  const stats = [
    { value: '5000+', label: t.home.statsProducts, icon: Package },
    { value: '200+', label: t.home.statsSellers, icon: Users },
    { value: '10K+', label: t.home.statsCustomers, icon: Users },
    { value: '15+', label: t.home.statsMarkets, icon: Store },
  ];

  const whyCards = [
    { icon: Truck, title: t.home.whyDelivery, desc: t.home.whyDeliveryDesc },
    { icon: ShieldCheck, title: t.home.whyQuality, desc: t.home.whyQualityDesc },
    { icon: Headphones, title: t.home.whySupport, desc: t.home.whySupportDesc },
  ];

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-surface-900 via-surface-900 to-primary-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-500/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* left */}
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.div variants={fadeUp} custom={0}>
                <Badge className="mb-6 bg-primary-500/20 text-primary-300 border-primary-500/30">
                  <Leaf className="mr-1 h-3.5 w-3.5" />
                  {t.home.heroBadge}
                </Badge>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                custom={1}
                className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl"
              >
                {t.home.heroTitle}{' '}
                <span className="gradient-text">{t.home.heroTitleAccent}</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                custom={2}
                className="mt-6 max-w-lg text-lg text-surface-300"
              >
                {t.home.heroSubtitle}
              </motion.p>

              <motion.div variants={fadeUp} custom={3} className="mt-8 flex flex-wrap gap-4">
                <Link href="/catalog">
                  <Button size="lg">
                    {t.home.heroCtaShop}
                    <ArrowRight className="ml-1 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                    {t.home.heroCtaAbout}
                  </Button>
                </Link>
              </motion.div>

              {/* stats row */}
              <motion.div
                variants={fadeUp}
                custom={4}
                className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4"
              >
                {stats.map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-bold text-white">{s.value}</p>
                    <p className="text-sm text-surface-400">{s.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* right — basket illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="relative hidden lg:block"
            >
              <div className="relative mx-auto h-[420px] w-[420px]">
                {/* glow */}
                <div className="absolute inset-0 rounded-full bg-primary-500/20 blur-3xl" />
                {/* basket */}
                <div className="relative flex h-full w-full items-center justify-center">
                  <svg viewBox="0 0 200 200" className="h-64 w-64 text-primary-400">
                    <ellipse cx="100" cy="160" rx="80" ry="20" fill="currentColor" opacity="0.15" />
                    <path
                      d="M40 80 C40 80 30 140 50 155 C70 170 130 170 150 155 C170 140 160 80 160 80"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path d="M40 80 L160 80" stroke="currentColor" strokeWidth="3" />
                    <path
                      d="M60 80 C60 60 80 40 100 40 C120 40 140 60 140 80"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                  </svg>
                  {/* floating items */}
                  <span className="absolute left-12 top-16 animate-float text-5xl">🍅</span>
                  <span className="absolute right-16 top-12 animate-float-delay text-5xl">🥕</span>
                  <span className="absolute bottom-24 left-8 animate-float-delay text-4xl">🍋</span>
                  <span className="absolute bottom-28 right-12 animate-float text-4xl">🌽</span>
                  <span className="absolute left-1/2 top-4 -translate-x-1/2 animate-float text-4xl">🍇</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
            className="text-center"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl font-bold text-surface-900 dark:text-white">
              {t.home.categoriesTitle}
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-3 text-surface-500 dark:text-surface-400">
              {t.home.categoriesSub}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
          >
            {loadingCategories
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6 flex flex-col items-center space-y-3">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <Skeleton className="h-4 w-20" />
                    </CardContent>
                  </Card>
                ))
              : categories.map((cat, i) => (
                <motion.div key={cat.id} variants={fadeUp} custom={i}>
                  <Link href={`/catalog?category=${cat.id}`}>
                    <Card className="group cursor-pointer text-center transition-shadow hover:shadow-lg">
                      <CardContent className="p-6">
                        {cat.imageUrl ? (
                          <div className="mx-auto h-12 w-12 relative rounded-full overflow-hidden bg-surface-100 dark:bg-surface-800">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={cat.imageUrl.startsWith('http') ? cat.imageUrl : `https://dehkon-tj.onrender.com/${cat.imageUrl}`}
                              alt={cat.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <span className="text-4xl">{categoryEmojiMap[cat.name] || '🛒'}</span>
                        )}
                        <p className="mt-3 font-semibold text-surface-800 dark:text-surface-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {cat.name}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
          </motion.div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="bg-surface-50 dark:bg-surface-900/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
            className="text-center"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl font-bold text-surface-900 dark:text-white">
              {t.home.whyTitle}
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-3 text-surface-500 dark:text-surface-400">
              {t.home.whySub}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="mt-12 grid gap-6 sm:grid-cols-3"
          >
            {whyCards.map((card, i) => (
              <motion.div key={card.title} variants={fadeUp} custom={i}>
                <Card className="h-full text-center">
                  <CardContent className="p-8">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400">
                      <card.icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-surface-900 dark:text-white">{card.title}</h3>
                    <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">{card.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== POPULAR PRODUCTS ===== */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-surface-900 dark:text-white">{t.home.featuredProducts}</h2>
              <p className="mt-2 text-surface-500 dark:text-surface-400">{t.home.featuredProductsSub}</p>
            </div>
            <Link href="/catalog">
              <Button variant="outline" size="sm">
                {t.home.viewAll}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {loadingProducts
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i}>
                    <Skeleton className="h-48 w-full rounded-t-2xl rounded-b-none" />
                    <CardContent className="p-4 space-y-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-8 w-full" />
                    </CardContent>
                  </Card>
                ))
              : products.slice(0, 4).map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
                      <div className="relative h-48 overflow-hidden bg-surface-100 dark:bg-surface-800">
                        <Image
                          src={product.imageUrl || '/placeholder.png'}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        {product.inStock ? (
                          <Badge className="absolute left-3 top-3">{t.products.inStock}</Badge>
                        ) : (
                          <Badge variant="destructive" className="absolute left-3 top-3">
                            {t.products.outOfStock}
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-surface-900 dark:text-white truncate">{product.name}</h3>
                        <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">{product.marketName}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                            {product.pricePerKg} {t.common.currency}/{t.common.kg}
                          </span>
                          <div className="flex items-center gap-1 text-sm text-surface-500">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {product.rating.toFixed(1)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
          </div>
        </div>
      </section>

      {/* ===== MARKETS ===== */}
      <section className="bg-surface-50 dark:bg-surface-900/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-surface-900 dark:text-white">{t.home.marketsTitle}</h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loadingMarkets
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6 space-y-3">
                      <Skeleton className="h-5 w-2/3" />
                      <Skeleton className="h-4 w-full" />
                    </CardContent>
                  </Card>
                ))
              : markets.map((market) => (
                  <motion.div
                    key={market.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="transition-shadow hover:shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400">
                            <MapPin className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-surface-900 dark:text-white">{market.name}</h3>
                            <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">{market.address}</p>
                            {market.sellersCount !== undefined && market.sellersCount > 0 && (
                              <p className="mt-1 text-xs text-primary-600 dark:text-primary-400">
                                <Users className="inline h-3 w-3 mr-1" />
                                {market.sellersCount} {t.common.sellers || 'продавцов'}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-gradient-to-r from-primary-600 to-primary-500 p-12 text-center text-white shadow-xl shadow-primary-500/25"
          >
            <h2 className="text-3xl font-bold sm:text-4xl">{t.home.ctaTitle}</h2>
            <p className="mt-4 text-lg text-primary-100">{t.home.ctaSub}</p>
            <div className="mt-8">
              <Link href="/auth">
                <Button
                  size="lg"
                  className="bg-white text-primary-700 hover:bg-primary-50 shadow-lg"
                >
                  {t.home.ctaBtn}
                  <ArrowRight className="ml-1 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
