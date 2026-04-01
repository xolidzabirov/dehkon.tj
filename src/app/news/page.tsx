'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Calendar, User } from 'lucide-react';
import { useTranslation } from '@/features/i18n';
import { Card, CardContent } from '@/shared/ui/Card';
import { Skeleton } from '@/shared/ui/Skeleton';
import { announcementService } from '@/entities/announcement';
import type { Announcement } from '@/entities/announcement';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' as const },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function NewsPage() {
  const { t } = useTranslation();
  const [news, setNews] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    announcementService
      .getAll({ PageSize: 20 })
      .then((res) => setNews(res.items))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-surface-900 via-surface-900 to-primary-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary-500/15 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold sm:text-5xl"
          >
            {t.news.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-surface-300"
          >
            {t.news.subtitle}
          </motion.p>
        </div>
      </section>

      {/* ===== LIST ===== */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-surface-500 dark:text-surface-400">{t.common.somethingWentWrong}</p>
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-16">
              <Newspaper className="mx-auto h-16 w-16 text-surface-300 dark:text-surface-600" />
              <p className="mt-4 text-lg text-surface-500 dark:text-surface-400">{t.news.empty}</p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={stagger}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {news.map((item, i) => (
                <motion.div key={item.id} variants={fadeUp} custom={i}>
                  <Card className="h-full transition-shadow hover:shadow-lg">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-surface-900 dark:text-white">{item.title}</h3>
                      <p className="mt-2 text-sm text-surface-600 dark:text-surface-400 line-clamp-3">
                        {item.content}
                      </p>
                      <div className="mt-4 flex items-center gap-4 text-xs text-surface-400 dark:text-surface-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(item.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          {t.news.by} {item.createdByName}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
