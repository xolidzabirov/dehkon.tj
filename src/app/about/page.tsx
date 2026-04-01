'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Eye, Heart, Users, Store, Package, Sprout, Handshake, ShieldCheck } from 'lucide-react';
import { useTranslation } from '@/features/i18n';
import { Card, CardContent } from '@/shared/ui/Card';

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

export default function AboutPage() {
  const { t } = useTranslation();

  const stats = [
    { value: '15+', label: t.about.statMarkets, icon: Store },
    { value: '5000+', label: t.about.statProducts, icon: Package },
    { value: '300+', label: t.about.statFarmers, icon: Users },
  ];

  const values = [
    { icon: Leaf, title: t.about.valueFresh, desc: t.about.valueFreshDesc },
    { icon: Sprout, title: t.about.valueLocal, desc: t.about.valueLocalDesc },
    { icon: Handshake, title: t.about.valueTrust, desc: t.about.valueTrustDesc },
  ];

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
            {t.about.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-surface-300"
          >
            {t.about.subtitle}
          </motion.p>
        </div>
      </section>

      {/* ===== MISSION & VISION ===== */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
            className="grid gap-8 md:grid-cols-2"
          >
            <motion.div variants={fadeUp} custom={0}>
              <Card className="h-full">
                <CardContent className="p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400">
                    <Heart className="h-6 w-6" />
                  </div>
                  <h2 className="mt-5 text-2xl font-bold text-surface-900 dark:text-white">{t.about.missionTitle}</h2>
                  <p className="mt-3 text-surface-600 dark:text-surface-400 leading-relaxed">{t.about.mission}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeUp} custom={1}>
              <Card className="h-full">
                <CardContent className="p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400">
                    <Eye className="h-6 w-6" />
                  </div>
                  <h2 className="mt-5 text-2xl font-bold text-surface-900 dark:text-white">{t.about.visionTitle}</h2>
                  <p className="mt-3 text-surface-600 dark:text-surface-400 leading-relaxed">{t.about.vision}</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto mt-12 max-w-3xl text-center text-lg text-surface-600 dark:text-surface-400 leading-relaxed"
          >
            {t.about.description}
          </motion.p>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="bg-surface-50 dark:bg-surface-900/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
            className="grid gap-8 sm:grid-cols-3 text-center"
          >
            {stats.map((stat, i) => (
              <motion.div key={stat.label} variants={fadeUp} custom={i}>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400">
                  <stat.icon className="h-7 w-7" />
                </div>
                <p className="mt-4 text-4xl font-extrabold text-surface-900 dark:text-white">{stat.value}</p>
                <p className="mt-1 text-surface-500 dark:text-surface-400">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== FARMERS SUPPORT ===== */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-gradient-to-r from-primary-600 to-primary-500 p-10 text-white shadow-xl shadow-primary-500/25 md:p-14"
          >
            <div className="flex items-start gap-5">
              <div className="hidden shrink-0 rounded-2xl bg-white/20 p-4 sm:flex">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold sm:text-3xl">{t.about.farmersTitle}</h2>
                <p className="mt-4 max-w-2xl text-primary-100 leading-relaxed">{t.about.farmersDesc}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== VALUES ===== */}
      <section className="bg-surface-50 dark:bg-surface-900/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-3xl font-bold text-surface-900 dark:text-white"
          >
            {t.about.valueTitle}
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="mt-12 grid gap-6 sm:grid-cols-3"
          >
            {values.map((val, i) => (
              <motion.div key={val.title} variants={fadeUp} custom={i}>
                <Card className="h-full text-center">
                  <CardContent className="p-8">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400">
                      <val.icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-surface-900 dark:text-white">{val.title}</h3>
                    <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">{val.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
