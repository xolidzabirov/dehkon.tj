// src/app/profile/page.tsx
import {
  BadgeCheck,
  CalendarDays,
  ChevronRight,
  Clock3,
  CreditCard,
  Heart,
  Mail,
  MapPin,
  Package,
  Phone,
  Settings,
  Shield,
  ShoppingBag,
  Star,
  Truck,
  User2,
} from 'lucide-react';

const profile = {
  fullName: 'Umed Karimov',
  username: '@umed',
  role: 'Покупатель',
  email: 'umed@gmail.com',
  phone: '+992 90 123 45 67',
  city: 'Душанбе, Таджикистан',
  address: 'ул. Шарифджона Хусейнзаде, 22, район Шохмансур',
  joinedAt: '12 февраля 2025',
  verified: true,
  bonusPoints: 245,
};

const stats = [
  { label: 'Заказы', value: '28', icon: ShoppingBag },
  { label: 'В избранном', value: '16', icon: Heart },
  { label: 'Отзывы', value: '9', icon: Star },
  { label: 'Бонусы', value: '245', icon: CreditCard },
];

const recentOrders = [
  {
    id: '#1024',
    title: 'Заказ из Umed Market',
    status: 'Доставлен',
    amount: '128 c.',
    date: 'Сегодня, 14:20',
  },
  {
    id: '#1021',
    title: 'Заказ из Меваи Тару Тоза',
    status: 'В пути',
    amount: '86 c.',
    date: 'Вчера, 18:40',
  },
  {
    id: '#1018',
    title: 'Заказ из Сабзавот Душанбе',
    status: 'Доставлен',
    amount: '154 c.',
    date: '26 марта, 11:10',
  },
];

const accountLinks = [
  { label: 'Личные данные', icon: User2 },
  { label: 'Адреса доставки', icon: MapPin },
  { label: 'Способы оплаты', icon: CreditCard },
  { label: 'Безопасность', icon: Shield },
  { label: 'Настройки аккаунта', icon: Settings },
];

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:border-slate-300 hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <div className="flex items-center justify-between">
        <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
          Активно
        </span>
      </div>
      <div className="mt-6">
        <p className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
          {value}
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {label}
        </p>
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40">
      <div className="mt-0.5 text-slate-500 dark:text-slate-400">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
          {label}
        </p>
        <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
          {value}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const delivered = status === 'Доставлен';

  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        delivered
          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:ring-emerald-900'
          : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-900',
      ].join(' ')}
    >
      {status}
    </span>
  );
}

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <section className="space-y-6">
            <div className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900">
              <div className="relative border-b border-slate-200/80 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.10),transparent_30%),radial-gradient(circle_at_right,rgba(15,23,42,0.06),transparent_28%),linear-gradient(to_bottom,#ffffff,#f8fafc)] px-6 py-8 dark:border-slate-800 dark:bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_30%),radial-gradient(circle_at_right,rgba(255,255,255,0.04),transparent_28%),linear-gradient(to_bottom,#0f172a,#020617)] sm:px-8 sm:py-10">
                <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] [background-size:24px_24px]" />
                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[28px] bg-slate-900 text-2xl font-semibold text-white shadow-lg dark:bg-white dark:text-slate-900">
                      U
                    </div>

                    <div className="pt-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                          {profile.fullName}
                        </h1>

                        {profile.verified && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:ring-emerald-900">
                            <BadgeCheck className="h-3.5 w-3.5" />
                            Верифицирован
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        {profile.username} · {profile.role}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          Надёжный клиент
                        </span>
                        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          Душанбе
                        </span>
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400">
                          {profile.bonusPoints} бонусов
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                      Редактировать профиль
                    </button>
                    <button className="inline-flex h-11 items-center justify-center rounded-2xl bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
                      Управление аккаунтом
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
                <InfoItem
                  label="Email"
                  value={profile.email}
                  icon={<Mail className="h-4 w-4" />}
                />
                <InfoItem
                  label="Телефон"
                  value={profile.phone}
                  icon={<Phone className="h-4 w-4" />}
                />
                <InfoItem
                  label="Город"
                  value={profile.city}
                  icon={<MapPin className="h-4 w-4" />}
                />
                <InfoItem
                  label="Дата регистрации"
                  value={profile.joinedAt}
                  icon={<CalendarDays className="h-4 w-4" />}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((item) => (
                <StatCard
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  icon={item.icon}
                />
              ))}
            </div>

            <div className="rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    Последние заказы
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Актуальная история покупок и текущих доставок
                  </p>
                </div>

                <button className="hidden text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white sm:inline-flex">
                  Смотреть все
                </button>
              </div>

              <div className="mt-6 divide-y divide-slate-200 dark:divide-slate-800">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {order.id}
                        </p>
                        <StatusBadge status={order.status} />
                      </div>

                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                        {order.title}
                      </p>

                      <div className="mt-2 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                        <Clock3 className="h-3.5 w-3.5" />
                        {order.date}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <div className="text-left sm:text-right">
                        <p className="text-base font-semibold text-slate-950 dark:text-white">
                          {order.amount}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          Сумма заказа
                        </p>
                      </div>

                      <button className="inline-flex h-10 items-center rounded-xl border border-slate-200 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                        Подробнее
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <h2 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                Основной адрес
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Адрес по умолчанию для доставки
              </p>

              <div className="mt-6 rounded-[28px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/40">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-white p-3 text-slate-900 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:text-white dark:ring-slate-800">
                    <MapPin className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      Душанбе
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {profile.address}
                    </p>
                    <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
                      Используется для быстрого оформления заказа
                    </p>
                  </div>
                </div>
              </div>

              <button className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                Изменить адрес
              </button>
            </div>

            <div className="rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <h2 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                Аккаунт
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Быстрый доступ к разделам профиля
              </p>

              <div className="mt-6 space-y-2">
                {accountLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.label}
                      className="flex w-full items-center justify-between rounded-2xl border border-transparent px-4 py-3 text-left transition hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-800 dark:hover:bg-slate-950/40"
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-slate-500 dark:text-slate-400">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          {item.label}
                        </span>
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <h2 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                Состояние аккаунта
              </h2>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                        <BadgeCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          Профиль подтверждён
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          Аккаунт активен и защищён
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-sky-50 p-2 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400">
                      <Package className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        3 активных заказа
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        1 в пути, 2 собираются
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-amber-50 p-2 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                      <Truck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        Быстрая доставка доступна
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        Для вашего адреса в Душанбе
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
