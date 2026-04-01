'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users } from 'lucide-react';
import { Card, CardContent } from '@/shared/ui/Card';
import type { Market } from '../model/types';

interface MarketCardProps {
  market: Market;
  sellersLabel?: string;
}

export function MarketCard({ market, sellersLabel }: MarketCardProps) {
  return (
    <motion.div
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
                  {market.sellersCount} {sellersLabel || 'sellers'}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
