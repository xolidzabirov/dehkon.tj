'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  MapPin,
  ArrowRight,
  ShoppingCart,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useTranslation } from '@/features/i18n';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { fetchCart, updateCartItem, removeCartItem, clearCart } from '@/features/cart';
import { orderService } from '@/entities/order';
import { Button, Input, Skeleton } from '@/shared/ui';

const IMG_FALLBACK = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YxZjVmOSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk0YTNiOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';

export default function CartPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const { cart, isLoading } = useAppSelector((s) => s.cart);

  const [address, setAddress] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, dispatch]);

  const handleUpdateQuantity = (itemId: number, productId: number, newQty: number) => {
    if (newQty <= 0) {
      dispatch(removeCartItem(itemId));
    } else {
      dispatch(updateCartItem({ itemId, data: { productId, quantityKg: newQty } }));
    }
  };

  const handlePlaceOrder = async () => {
    if (!address.trim()) return;
    setPlacingOrder(true);
    setOrderError('');
    try {
      await orderService.create({ deliveryAddress: address });
      dispatch(clearCart());
      setOrderPlaced(true);
    } catch {
      setOrderError(t.common.somethingWentWrong);
    } finally {
      setPlacingOrder(false);
    }
  };

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: 'easeOut' as const },
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center">
        <motion.div {...fadeUp} className="text-center">
          <ShoppingCart className="mx-auto h-16 w-16 text-surface-300 dark:text-surface-600 mb-4" />
          <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
            {t.cart.loginRequired}
          </h2>
          <Button onClick={() => router.push('/auth')} className="mt-4">
            {t.nav.login}
          </Button>
        </motion.div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center">
        <motion.div {...fadeUp} className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 mb-6">
            <Check className="h-10 w-10 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">
            {t.cart.orderSuccess}
          </h2>
          <div className="flex gap-3 justify-center mt-6">
            <Button variant="outline" onClick={() => router.push('/catalog')}>
              {t.cart.continueShopping}
            </Button>
            <Button onClick={() => router.push('/dashboard/orders')}>
              {t.nav.orders}
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isLoading && !cart) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950 pt-8">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-40 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-28 rounded-2xl" />
              ))}
            </div>
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  const isEmpty = items.length === 0;

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <div className="container mx-auto px-4 py-8">
        <motion.h1 {...fadeUp} className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-100 mb-8">
          {t.cart.title}
        </motion.h1>

        {isEmpty ? (
          <motion.div {...fadeUp} className="text-center py-20">
            <ShoppingBag className="mx-auto h-20 w-20 text-surface-300 dark:text-surface-600 mb-4" />
            <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
              {t.cart.empty}
            </h2>
            <p className="text-surface-500 dark:text-surface-400 mb-6">{t.cart.emptyDesc}</p>
            <Button onClick={() => router.push('/catalog')}>
              {t.cart.continueShopping}
            </Button>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3, ease: 'easeOut' as const }}
                  className="glass-card rounded-2xl p-4 flex gap-4"
                >
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={item.productImageUrl || IMG_FALLBACK}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = IMG_FALLBACK; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/catalog/${item.productId}`}
                      className="font-semibold text-surface-900 dark:text-surface-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-1"
                    >
                      {item.productName}
                    </Link>
                    <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                      {item.pricePerKg.toFixed(0)} {t.common.currency}/{t.common.kg}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-surface-200 dark:border-surface-700 rounded-lg overflow-hidden">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.productId, item.quantityKg - 0.5)}
                          className="h-8 w-8 flex items-center justify-center hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="h-8 w-14 flex items-center justify-center text-sm font-medium border-x border-surface-200 dark:border-surface-700">
                          {item.quantityKg} {t.common.kg}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.productId, item.quantityKg + 0.5)}
                          className="h-8 w-8 flex items-center justify-center hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-surface-900 dark:text-surface-100">
                          {item.totalPrice.toFixed(0)} {t.common.currency}
                        </span>
                        <button
                          onClick={() => dispatch(removeCartItem(item.id))}
                          className="text-surface-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dispatch(clearCart())}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  {t.cart.clear}
                </Button>
              </div>
            </div>

            {/* Order summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' as const }}
            >
              <div className="glass-card rounded-2xl p-6 sticky top-24">
                <h2 className="font-semibold text-lg text-surface-900 dark:text-surface-100 mb-6">
                  {t.cart.orderSummary}
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-500 dark:text-surface-400">{t.cart.subtotal}</span>
                    <span className="text-surface-900 dark:text-surface-100 font-medium">
                      {(cart?.totalPrice || 0).toFixed(0)} {t.common.currency}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-500 dark:text-surface-400">{t.cart.delivery}</span>
                    <span className="text-primary-600 dark:text-primary-400 font-medium">
                      {t.cart.deliveryFree}
                    </span>
                  </div>
                  <div className="border-t border-surface-200 dark:border-surface-700 pt-3 flex justify-between">
                    <span className="font-semibold text-surface-900 dark:text-surface-100">{t.cart.total}</span>
                    <span className="font-bold text-lg text-primary-600 dark:text-primary-400">
                      {(cart?.totalPrice || 0).toFixed(0)} {t.common.currency}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <Input
                    label={t.cart.deliveryAddress}
                    placeholder={t.cart.deliveryAddressPlaceholder}
                    icon={<MapPin className="h-4 w-4" />}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                {orderError && (
                  <div className="flex items-center gap-2 text-sm text-red-500 mb-4">
                    <AlertCircle className="h-4 w-4" />
                    {orderError}
                  </div>
                )}

                <Button
                  className="w-full"
                  size="lg"
                  disabled={!address.trim() || placingOrder}
                  loading={placingOrder}
                  onClick={handlePlaceOrder}
                >
                  {t.cart.placeOrder}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
