'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/shared/ui/Card';
import type { Category } from '../model/types';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

interface CategoryCardProps {
  category: Category;
  animationIndex?: number;
  emojiFallback?: string;
}

export function CategoryCard({ category, animationIndex = 0, emojiFallback = '🛒' }: CategoryCardProps) {
  return (
    <motion.div variants={fadeUp} custom={animationIndex}>
      <Link href={`/catalog?category=${category.id}`}>
        <Card className="group cursor-pointer text-center transition-shadow hover:shadow-lg">
          <CardContent className="p-6">
            {category.imageUrl ? (
              <div className="mx-auto h-12 w-12 relative rounded-full overflow-hidden bg-surface-100 dark:bg-surface-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    category.imageUrl.startsWith('http')
                      ? category.imageUrl
                      : `https://dehkon-tj.onrender.com/${category.imageUrl}`
                  }
                  alt={category.name}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <span className="text-4xl">{emojiFallback}</span>
            )}
            <p className="mt-3 font-semibold text-surface-800 dark:text-surface-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {category.name}
            </p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
