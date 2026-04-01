'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/features/i18n';
import { Card, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';

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

export default function ContactPage() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1200);
  };

  const infoCards = [
    { icon: Phone, label: t.contact.phone, value: t.contact.phoneValue },
    { icon: Mail, label: t.contact.email, value: t.contact.emailValue },
    { icon: MapPin, label: t.contact.address, value: t.contact.addressValue },
    { icon: Clock, label: t.contact.workHours, value: t.contact.workHoursValue },
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
            {t.contact.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-surface-300"
          >
            {t.contact.subtitle}
          </motion.p>
        </div>
      </section>

      {/* ===== INFO CARDS ===== */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {infoCards.map((card, i) => (
              <motion.div key={card.label} variants={fadeUp} custom={i}>
                <Card className="h-full text-center">
                  <CardContent className="p-6">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400">
                      <card.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 font-semibold text-surface-900 dark:text-white">{card.label}</h3>
                    <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">{card.value}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== FORM + MAP ===== */}
      <section className="bg-surface-50 dark:bg-surface-900/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardContent className="p-8">
                  {sent ? (
                    <div className="flex flex-col items-center py-10 text-center">
                      <CheckCircle2 className="h-16 w-16 text-primary-500" />
                      <p className="mt-4 text-lg font-semibold text-surface-900 dark:text-white">
                        {t.contact.formSuccess}
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <Input
                        label={t.contact.name}
                        placeholder={t.contact.name}
                        required
                      />
                      <Input
                        label={t.contact.email}
                        type="email"
                        placeholder={t.contact.emailValue}
                        required
                      />
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                          {t.contact.message}
                        </label>
                        <textarea
                          rows={5}
                          required
                          placeholder={t.contact.message}
                          className="w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-100 dark:placeholder:text-surface-500"
                        />
                      </div>
                      <Button type="submit" loading={sending} className="w-full">
                        <Send className="mr-2 h-4 w-4" />
                        {t.contact.send}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* map placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-semibold text-surface-900 dark:text-white">{t.contact.mapTitle}</h3>
                  <div className="flex h-80 items-center justify-center rounded-xl bg-surface-100 dark:bg-surface-800">
                    <div className="text-center">
                      <MapPin className="mx-auto h-12 w-12 text-primary-500" />
                      <p className="mt-3 text-sm text-surface-500 dark:text-surface-400">
                        {t.contact.addressValue}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
