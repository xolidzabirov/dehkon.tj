'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  Star,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
} from 'lucide-react';
import { useTranslation } from '@/features/i18n';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { addToCart } from '@/features/cart';
import { productService } from '@/entities/product';
import { categoryService } from '@/entities/category';
import { marketService } from '@/entities/market';
import { Button, Skeleton, Badge } from '@/shared/ui';
import { cn } from '@/shared/lib/utils';
import type { Product } from '@/entities/product';
import type { Category } from '@/entities/category';
import type { Market } from '@/entities/market';

const IMG_FALLBACK = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YxZjVmOSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk0YTNiOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';

function CatalogContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());

  // Read filters from URL
  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const categoryId = searchParams.get('category') ? Number(searchParams.get('category')) : undefined;
  const marketId = searchParams.get('market') ? Number(searchParams.get('market')) : undefined;
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const sortBy = searchParams.get('sort') || '';

  // Local filter state for sidebar
  const [localSearch, setLocalSearch] = useState(search);
  const [localMinPrice, setLocalMinPrice] = useState(minPrice?.toString() || '');
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice?.toString() || '');

  const updateUrl = useCallback(
    (params: Record<string, string | undefined>) => {
      const current = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([k, v]) => {
        if (v) current.set(k, v);
        else current.delete(k);
      });
      if (params.page === undefined && !('page' in params)) current.delete('page');
      router.push(`/catalog?${current.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  useEffect(() => {
    setIsLoading(true);
    productService
      .getAll({
        PageNumber: page,
        PageSize: 12,
        Name: search || undefined,
        CategoryId: categoryId,
        MarketId: marketId,
        MinPrice: minPrice,
        MaxPrice: maxPrice,
      })
      .then((res) => {
        setProducts(res.items);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.totalCount || res.items.length || 0);
      })
      .catch(() => setProducts([]))
      .finally(() => setIsLoading(false));
  }, [page, search, categoryId, marketId, minPrice, maxPrice, sortBy]);

  useEffect(() => {
    categoryService.getAll({ PageSize: 50 }).then((r) => setCategories(r.items)).catch(() => {});
    marketService.getAll({ PageSize: 50 }).then((r) => setMarkets(r.items)).catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl({ search: localSearch || undefined, page: undefined });
  };

  const handleAddToCart = async (productId: number) => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }
    await dispatch(addToCart({ productId, quantityKg: 1 }));
    setAddedIds((prev) => new Set(prev).add(productId));
    setTimeout(() => setAddedIds((prev) => { const n = new Set(prev); n.delete(productId); return n; }), 2000);
  };

  const clearFilters = () => {
    setLocalSearch('');
    setLocalMinPrice('');
    setLocalMaxPrice('');
    router.push('/catalog');
  };

  const hasActiveFilters = search || categoryId || marketId || minPrice || maxPrice;

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: 'easeOut' as const },
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 {...fadeUp} className="text-3xl md:text-4xl font-bold mb-3">
            {t.products.title}
          </motion.h1>
          <motion.p {...fadeUp} transition={{ delay: 0.1, duration: 0.4, ease: 'easeOut' as const }} className="text-white/80 max-w-xl mx-auto mb-8">
            {t.products.subtitle}
          </motion.p>
          <motion.form
            {...fadeUp}
            transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' as const }}
            onSubmit={handleSearch}
            className="max-w-lg mx-auto relative"
          >
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder={t.home.heroSearch}
              className="w-full h-12 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 px-12 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-4 rounded-lg bg-white/20 text-sm font-medium hover:bg-white/30 transition-colors">
              {t.common.search}
            </button>
          </motion.form>
        </div>
      </section>

      {/* Category chips */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => updateUrl({ category: undefined, page: undefined })}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors',
              !categoryId
                ? 'bg-primary-500 text-white'
                : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'
            )}
          >
            {t.products.allCategories}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateUrl({ category: cat.id.toString(), page: undefined })}
              className={cn(
                'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                categoryId === cat.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="flex gap-8">
          {/* Sidebar filters (desktop) */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="glass-card rounded-2xl p-6 sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-surface-900 dark:text-surface-100">{t.products.filter}</h3>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-xs text-primary-600 dark:text-primary-400 hover:underline">
                    {t.products.clearFilters}
                  </button>
                )}
              </div>

              {/* Price range */}
              <div>
                <label className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2 block">
                  {t.products.priceRange}
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder={t.products.minPrice}
                    value={localMinPrice}
                    onChange={(e) => setLocalMinPrice(e.target.value)}
                    onBlur={() => updateUrl({ minPrice: localMinPrice || undefined, page: undefined })}
                    className="w-full h-9 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="number"
                    placeholder={t.products.maxPrice}
                    value={localMaxPrice}
                    onChange={(e) => setLocalMaxPrice(e.target.value)}
                    onBlur={() => updateUrl({ maxPrice: localMaxPrice || undefined, page: undefined })}
                    className="w-full h-9 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Market filter */}
              <div>
                <label className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2 block">
                  {t.products.marketFilter}
                </label>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {markets.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => updateUrl({ market: marketId === m.id ? undefined : m.id.toString(), page: undefined })}
                      className={cn(
                        'w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors',
                        marketId === m.id
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                          : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
                      )}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile filter button */}
          <button
            onClick={() => setShowFilters(true)}
            className="lg:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-primary-500 text-white px-5 py-3 shadow-lg shadow-primary-500/30"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {t.products.filter}
          </button>

          {/* Mobile filter overlay */}
          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30 }}
                className="absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-surface-900 p-6 overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-surface-900 dark:text-surface-100">{t.products.filter}</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="h-5 w-5 text-surface-500" />
                  </button>
                </div>
                {/* Price */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2 block">
                    {t.products.priceRange}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder={t.products.minPrice}
                      value={localMinPrice}
                      onChange={(e) => setLocalMinPrice(e.target.value)}
                      onBlur={() => updateUrl({ minPrice: localMinPrice || undefined, page: undefined })}
                      className="w-full h-9 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="number"
                      placeholder={t.products.maxPrice}
                      value={localMaxPrice}
                      onChange={(e) => setLocalMaxPrice(e.target.value)}
                      onBlur={() => updateUrl({ maxPrice: localMaxPrice || undefined, page: undefined })}
                      className="w-full h-9 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                {/* Market */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2 block">
                    {t.products.marketFilter}
                  </label>
                  <div className="space-y-1">
                    {markets.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => { updateUrl({ market: marketId === m.id ? undefined : m.id.toString(), page: undefined }); setShowFilters(false); }}
                        className={cn(
                          'w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors',
                          marketId === m.id ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 font-medium' : 'text-surface-600 hover:bg-surface-100'
                        )}
                      >
                        {m.name}
                      </button>
                    ))}
                  </div>
                </div>
                {hasActiveFilters && (
                  <Button variant="outline" className="w-full" onClick={() => { clearFilters(); setShowFilters(false); }}>
                    {t.products.clearFilters}
                  </Button>
                )}
              </motion.div>
            </div>
          )}

          {/* Product grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-surface-500 dark:text-surface-400">
                {totalCount} {t.products.productCount}
              </p>
              <select
                value={sortBy}
                onChange={(e) => updateUrl({ sort: e.target.value || undefined, page: undefined })}
                className="h-9 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 px-3 text-sm text-surface-700 dark:text-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">{t.products.sortDefault}</option>
                <option value="price_asc">{t.products.sortPriceAsc}</option>
                <option value="price_desc">{t.products.sortPriceDesc}</option>
                <option value="rating">{t.products.sortRating}</option>
                <option value="new">{t.products.sortNew}</option>
              </select>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="glass-card rounded-2xl overflow-hidden">
                    <Skeleton className="h-48 rounded-none" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <Search className="mx-auto h-16 w-16 text-surface-300 dark:text-surface-600 mb-4" />
                <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">
                  {t.products.noProducts}
                </h3>
                <p className="text-surface-500 dark:text-surface-400 mb-6">
                  {t.products.noProductsDesc}
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    {t.products.clearFilters}
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3, ease: 'easeOut' as const }}
                    className="glass-card rounded-2xl overflow-hidden group"
                  >
                    <Link href={`/catalog/${product.id}`} className="block relative h-48 overflow-hidden">
                      <Image
                        src={product.imageUrl || IMG_FALLBACK}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { (e.target as HTMLImageElement).src = IMG_FALLBACK; }}
                      />
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Badge variant="destructive">{t.products.outOfStock}</Badge>
                        </div>
                      )}
                    </Link>
                    <div className="p-4">
                      <Link href={`/catalog/${product.id}`}>
                        <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-1 line-clamp-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-surface-500 dark:text-surface-400 mb-2">
                        {product.sellerName} · {product.marketName}
                      </p>
                      <div className="flex items-center gap-1 mb-3">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                          {product.rating.toFixed(1)}
                        </span>
                        <span className="text-xs text-surface-400">
                          ({product.reviewCount} {t.products.reviews})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                            {product.pricePerKg.toFixed(0)}
                          </span>
                          <span className="text-xs text-surface-500 ml-1">
                            {t.common.currency}/{t.common.kg}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          disabled={!product.inStock}
                          variant={addedIds.has(product.id) ? 'secondary' : 'default'}
                          onClick={() => handleAddToCart(product.id)}
                        >
                          {addedIds.has(product.id) ? (
                            <><Check className="h-4 w-4" /> {t.products.added}</>
                          ) : (
                            <><ShoppingCart className="h-4 w-4" /> {t.products.addToCart}</>
                          )}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <button
                  onClick={() => updateUrl({ page: String(page - 1) })}
                  disabled={page <= 1}
                  className="p-2 rounded-lg border border-surface-200 dark:border-surface-700 disabled:opacity-40 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .map((p, i, arr) => (
                    <React.Fragment key={p}>
                      {i > 0 && arr[i - 1] !== p - 1 && (
                        <span className="text-surface-400">...</span>
                      )}
                      <button
                        onClick={() => updateUrl({ page: String(p) })}
                        className={cn(
                          'h-10 w-10 rounded-lg text-sm font-medium transition-colors',
                          p === page
                            ? 'bg-primary-500 text-white'
                            : 'border border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300'
                        )}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  ))}
                <button
                  onClick={() => updateUrl({ page: String(page + 1) })}
                  disabled={page >= totalPages}
                  className="p-2 rounded-lg border border-surface-200 dark:border-surface-700 disabled:opacity-40 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface-50 dark:bg-surface-950" />}>
      <CatalogContent />
    </Suspense>
  );
}
