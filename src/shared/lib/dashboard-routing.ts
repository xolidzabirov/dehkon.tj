import {
  Home,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Truck,
  User,
  Map,
  MessageCircle,
  Settings,
  Users,
  Store,
  Megaphone,
  Star,
  Tags,
  type LucideIcon,
} from 'lucide-react';

export type AppRole = 'Admin' | 'Seller' | 'Courier' | 'User' | string | undefined;

export interface DashboardNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export function getRoleLabel(roleName?: AppRole) {
  switch (roleName) {
    case 'Admin':
      return 'Администратор';
    case 'Seller':
      return 'Продавец';
    case 'Courier':
      return 'Курьер';
    default:
      return 'Покупатель';
  }
}

export function getUserInitial(name?: string | null) {
  return (name?.trim()?.charAt(0) || 'U').toUpperCase();
}

export function hasDashboardAccess(roleName?: AppRole) {
  return roleName === 'Seller' || roleName === 'Courier';
}

export function isAdminRole(roleName?: AppRole) {
  return roleName === 'Admin';
}

export function isSellerRole(roleName?: AppRole) {
  return roleName === 'Seller';
}

export function isCourierRole(roleName?: AppRole) {
  return roleName === 'Courier';
}

export function getDashboardBasePath(roleName?: AppRole): string | null {
  switch (roleName) {
    case 'Admin':
      return '/admin';
    case 'Seller':
    case 'Courier':
      return '/dashboard';
    default:
      return null;
  }
}

export function getHomeByRole(roleName?: AppRole) {
  switch (roleName) {
    case 'Admin':
      return '/admin';
    case 'Seller':
    case 'Courier':
      return '/dashboard';
    default:
      return '/profile';
  }
}

export function getProfilePath(roleName?: AppRole) {
  switch (roleName) {
    case 'Admin':
      return '/admin/profile';
    case 'Seller':
    case 'Courier':
      return '/dashboard/profile';
    default:
      return '/profile';
  }
}

export function getSettingsPath(roleName?: AppRole) {
  switch (roleName) {
    case 'Admin':
      return '/admin/settings';
    case 'Seller':
    case 'Courier':
      return '/dashboard/settings';
    default:
      return '/profile';
  }
}

export function getDashboardNavItems(roleName?: AppRole): DashboardNavItem[] {
  switch (roleName) {
    case 'Admin':
      return [
        { href: '/admin', label: 'Главная', icon: LayoutDashboard },
        { href: '/admin/products', label: 'Товары', icon: Package },
        { href: '/admin/categories', label: 'Категории', icon: Tags },
        { href: '/admin/users', label: 'Пользователи', icon: Users },
        { href: '/admin/orders', label: 'Заказы', icon: ShoppingBag },
        { href: '/admin/markets', label: 'Рынки', icon: Store },
        { href: '/admin/ads', label: 'Объявления', icon: Megaphone },
        { href: '/admin/reviews', label: 'Отзывы', icon: Star },
        { href: '/admin/profile', label: 'Профиль', icon: User },
        { href: '/admin/settings', label: 'Настройки', icon: Settings },
        { href: '/', label: 'На сайт', icon: Home },
      ];

    case 'Seller':
      return [
        { href: '/dashboard', label: 'Обзор', icon: LayoutDashboard },
        { href: '/dashboard/orders', label: 'Заказы', icon: ShoppingBag },
        { href: '/dashboard/products', label: 'Товары', icon: Package },
        { href: '/dashboard/chats', label: 'Чаты', icon: MessageCircle },
        { href: '/dashboard/profile', label: 'Профиль', icon: User },
        { href: '/dashboard/settings', label: 'Настройки', icon: Settings },
        { href: '/', label: 'На сайт', icon: Home },
      ];

    case 'Courier':
      return [
        { href: '/dashboard', label: 'Обзор', icon: LayoutDashboard },
        { href: '/dashboard/deliveries', label: 'Доставки', icon: Truck },
        { href: '/dashboard/map', label: 'Карта', icon: Map },
        { href: '/dashboard/chats', label: 'Чаты', icon: MessageCircle },
        { href: '/dashboard/profile', label: 'Профиль', icon: User },
        { href: '/dashboard/settings', label: 'Настройки', icon: Settings },
        { href: '/', label: 'На сайт', icon: Home },
      ];

    default:
      return [];
  }
}