'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import type { Product } from '../model/types';

const IMG_FALLBACK =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YxZjVmOSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk0YTNiOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';

interface ProductCardProps {
  product: Product;
  labels: {
    inStock: string;
    outOfStock: string;
    currency: string;
    kg: string;
    reviews?: string;
  };
  animationIndex?: number;
  actions?: React.ReactNode;
}

export function ProductCard({ product, labels, animationIndex, actions }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: animationIndex !== undefined ? animationIndex * 0.05 : 0,
        duration: 0.4,
        ease: 'easeOut' as const,
      }}
    >
      <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
        <Link href={`/catalog/${product.id}`} className="block relative h-48 overflow-hidden bg-surface-100 dark:bg-surface-800">
          <Image
            src={product.imageUrl || IMG_FALLBACK}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = IMG_FALLBACK;
            }}
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive">{labels.outOfStock}</Badge>
            </div>
          )}
          {product.inStock && (
            <Badge className="absolute left-3 top-3">{labels.inStock}</Badge>
          )}
        </Link>
        <CardContent className="p-4">
          <Link href={`/catalog/${product.id}`}>
            <h3 className="font-semibold text-surface-900 dark:text-white truncate hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
            {product.sellerName} · {product.marketName}
          </p>
          <div className="mt-2 flex items-center gap-1 mb-3">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
              {product.rating.toFixed(1)}
            </span>
            {labels.reviews && (
              <span className="text-xs text-surface-400">
                ({product.reviewCount} {labels.reviews})
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                {product.pricePerKg.toFixed(0)}
              </span>
              <span className="text-xs text-surface-500 ml-1">
                {labels.currency}/{labels.kg}
              </span>
            </div>
            {actions}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
