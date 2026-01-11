import Image from "next/image"

export default function AboutUs() {

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-16 bg-gray-50">

      {/* О нас */}
      <section>
        <h1 className="text-3xl font-bold mb-4">О dehkon.tj</h1>
        <p className="text-gray-600">
          Dehkon.tj — платформа для покупки свежих фермерских продуктов
          напрямую от производителей.
        </p>
      </section>

      {/* Миссия и ценности */}
<section className="bg-gray-50 rounded-2xl p-8">
  <h2 className="text-2xl font-semibold text-center mb-10">
    Наша миссия и ценности
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Свежесть */}
    <div className="bg-white rounded-xl p-6 text-center border-2 border-green-400 shadow-sm">
      <svg
        className="mx-auto mb-4"
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#22c55e"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 20A7 7 0 0 1 4 13C4 7 11 2 11 2s7 5 7 11a7 7 0 0 1-7 7z" />
      </svg>
      <h3 className="font-semibold mb-2">Свежесть</h3>
      <p className="text-sm text-gray-600">
        Мы гарантируем свежие продукты прямо с фермы без посредников.
      </p>
    </div>

    {/* Инновации */}
    <div className="bg-white rounded-xl p-6 text-center shadow-sm">
      <svg
        className="mx-auto mb-4"
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#22c55e"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M12 2a7 7 0 0 0-4 12c.7.6 1 1.3 1 2h6c0-.7.3-1.4 1-2a7 7 0 0 0-4-12z" />
      </svg>
      <h3 className="font-semibold mb-2">Инновации</h3>
      <p className="text-sm text-gray-600">
        Используем современные технологии для удобного заказа.
      </p>
    </div>

    {/* Сообщество */}
    <div className="bg-white rounded-xl p-6 text-center shadow-sm">
      <svg
        className="mx-auto mb-4"
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#22c55e"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 3h5v5" />
        <path d="M8 3H3v5" />
        <path d="M3 16v5h5" />
        <path d="M21 16v5h-5" />
        <path d="M7 12h10" />
      </svg>
      <h3 className="font-semibold mb-2">Сообщество</h3>
      <p className="text-sm text-gray-600">
        Поддерживаем фермеров и развиваем локальное сообщество.
      </p>
    </div>
  </div>
</section>

      {/* Контакты */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Свяжитесь с нами</h2>

        <div className="grid md:grid-cols-2 gap-6 items-center">
          <ul className="space-y-2 text-gray-600">
            <li>📍 Таджикистан</li>
            <li>📧 info@dehkon.tj</li>
            <li>📞 +992 55 666 9562</li>
          </ul>

          <Image
            src="/images (2).jpg"
            alt="map"
            width={400}
            height={250}
            className="rounded-xl object-cover"
          />
        </div>
      </section>

      {/* Галерея */}
<section>
  <h2 className="text-2xl font-semibold mb-8 text-center">
    Наша фотогалерея
  </h2>

  <div className="grid grid-cols-3 gap-4 auto-rows-[160px]">
    {/* Левая верх */}
    <Image
      src="/Без названия (3).jpg"
      alt=""
      width={300}
      height={300}
      className="rounded-xl object-cover w-full h-full"
    />

    {/* Центральная большая */}
    <Image
      src="/images.jpg"
      alt=""
      width={400}
      height={600}
      className="rounded-xl object-cover w-full h-full row-span-2"
    />

    {/* Правая верх */}
    <Image
      src="/Без названия (1).jpg"
      alt=""
      width={300}
      height={300}
      className="rounded-xl object-cover w-full h-full"
    />

    {/* Левая низ */}
    <Image
      src="/Без названия (2).jpg"
      alt=""
      width={300}
      height={300}
      className="rounded-xl object-cover w-full h-full"
    />

    {/* Правая низ */}
    <Image
      src="/Без названия (4).jpg"
      alt=""
      width={300}
      height={300}
      className="rounded-xl object-cover w-full h-full"
    />

    {/* Нижняя широкая */}
    <Image
      src="/Без названия.jpg"
      alt=""
      width={600}
      height={300}
      className="rounded-xl object-cover w-full h-full col-span-2"
    />
  </div>
</section>


    </main>
  )
}
