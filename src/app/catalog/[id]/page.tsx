'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Star,
  ShoppingCart,
  ArrowLeft,
  Minus,
  Plus,
  Check,
  User,
  MapPin,
  Store,
} from 'lucide-react';
import { useTranslation } from '@/features/i18n';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { addToCart } from '@/features/cart';
import { productService } from '@/entities/product';
import { reviewService } from '@/entities/review';
import { Button, Skeleton, Badge } from '@/shared/ui';
import { cn } from '@/shared/lib/utils';
import type { Product } from '@/entities/product';
import type { Review } from '@/entities/review';

const IMG_FALLBACK = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YxZjVmOSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk0YTNiOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';

export default function ProductDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);

  const productId = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!productId) return;
    setIsLoading(true);
    Promise.all([
      productService.getById(productId),
      reviewService.getByProduct(productId, { PageSize: 10 }),
    ])
      .then(([prod, revs]) => {
        setProduct(prod);
        setReviews(Array.isArray(revs) ? revs : Array.isArray(revs?.items) ? revs.items : []);
        // Fetch related products from same category
        productService
          .getAll({ CategoryId: prod.categoryId, PageSize: 4 })
          .then((r) => setRelatedProducts(r.items.filter((p) => p.id !== prod.id).slice(0, 3)))
          .catch(() => {});
      })
      .catch(() => setProduct(null))
      .finally(() => setIsLoading(false));
  }, [productId]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }
    await dispatch(addToCart({ productId, quantityKg: quantity }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    setSubmittingReview(true);
    try {
      const newReview = await reviewService.create({
        productId,
        rating: reviewRating,
        comment: reviewText,
      });
      setReviews((prev) => [newReview, ...prev]);
      setReviewText('');
      setReviewRating(5);
    } catch {
      // ignore
    } finally {
      setSubmittingReview(false);
    }
  };

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: 'easeOut' as const },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950 pt-8">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-40 mb-6" />
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="h-96 rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-12 w-1/3" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-4">
            {t.products.noProducts}
          </h2>
          <Button variant="outline" onClick={() => router.push('/catalog')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t.products.backToCatalog}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <div className="container mx-auto px-4 py-8">
        {/* Back */}
        <motion.div {...fadeUp}>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.products.backToCatalog}
          </Link>
        </motion.div>

        {/* Product */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' as const }}
            className="relative aspect-square rounded-2xl overflow-hidden glass-card"
          >
            <Image
              src={product.imageUrl || IMG_FALLBACK}
              alt={product.name}
              fill
              className="object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = IMG_FALLBACK; }}
            />
            {!product.inStock && (
              <div className="absolute top-4 left-4">
                <Badge variant="destructive">{t.products.outOfStock}</Badge>
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' as const }}
          >
            <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-100 mb-3">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-surface-900 dark:text-surface-100">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-sm text-surface-500">
                  ({product.reviewCount} {t.products.reviews})
                </span>
              </div>
              <Badge variant={product.inStock ? 'default' : 'destructive'}>
                {product.inStock ? t.products.inStock : t.products.outOfStock}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-sm text-surface-500 dark:text-surface-400 mb-6">
              <span className="flex items-center gap-1">
                <Store className="h-4 w-4" />
                {t.products.seller}: {product.sellerName}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {product.marketName}
              </span>
            </div>

            <div className="mb-6">
              <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {product.pricePerKg.toFixed(0)}
              </span>
              <span className="text-lg text-surface-500 ml-2">
                {t.common.currency} / {t.common.kg}
              </span>
            </div>

            {product.description && (
              <div className="mb-6">
                <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-2">
                  {t.products.description}
                </h3>
                <p className="text-surface-600 dark:text-surface-400 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Quantity & Add to cart */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-surface-200 dark:border-surface-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(0.5, q - 0.5))}
                  className="h-11 w-11 flex items-center justify-center hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="h-11 w-16 flex items-center justify-center font-semibold text-surface-900 dark:text-surface-100 border-x border-surface-200 dark:border-surface-700">
                  {quantity} {t.common.kg}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 0.5)}
                  className="h-11 w-11 flex items-center justify-center hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button
                size="lg"
                className="flex-1"
                disabled={!product.inStock}
                variant={added ? 'secondary' : 'default'}
                onClick={handleAddToCart}
              >
                {added ? (
                  <><Check className="h-5 w-5" /> {t.products.added}</>
                ) : (
                  <><ShoppingCart className="h-5 w-5" /> {t.products.addToCart}</>
                )}
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Reviews */}
        <motion.section {...fadeUp} className="mb-16">
          <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-6">
            {t.products.reviews} ({reviews.length})
          </h2>

          {/* Write review form */}
          {isAuthenticated && (
            <form onSubmit={handleSubmitReview} className="glass-card rounded-2xl p-6 mb-6">
              <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-4">
                {t.products.writeReview}
              </h3>
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setReviewRating(s)}
                    className="p-0.5"
                  >
                    <Star
                      className={cn(
                        'h-6 w-6 transition-colors',
                        s <= reviewRating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-surface-300 dark:text-surface-600'
                      )}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder={t.products.reviewPlaceholder}
                rows={3}
                className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 px-4 py-3 text-sm text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4"
              />
              <Button type="submit" loading={submittingReview} disabled={!reviewText.trim()}>
                {t.products.submitReview}
              </Button>
            </form>
          )}

          {/* Review list */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
                      <User className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="font-medium text-surface-900 dark:text-surface-100 text-sm">
                        {review.userName}
                      </p>
                      <p className="text-xs text-surface-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'h-4 w-4',
                          i < review.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-surface-300 dark:text-surface-600'
                        )}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-surface-600 dark:text-surface-400 text-sm">{review.comment}</p>
              </div>
            ))}
            {reviews.length === 0 && (
              <p className="text-center text-surface-400 py-8">{t.common.noResults}</p>
            )}
          </div>
        </motion.section>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <motion.section {...fadeUp}>
            <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-6">
              {t.products.relatedProducts}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/catalog/${rp.id}`}
                  className="glass-card rounded-2xl overflow-hidden group"
                >
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={rp.imageUrl || IMG_FALLBACK}
                      alt={rp.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { (e.target as HTMLImageElement).src = IMG_FALLBACK; }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-surface-900 dark:text-surface-100 line-clamp-1 mb-1">
                      {rp.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                        {rp.pricePerKg.toFixed(0)} {t.common.currency}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm">{rp.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
