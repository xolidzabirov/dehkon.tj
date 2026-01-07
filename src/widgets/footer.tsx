"use client"
import { useTheme } from 'next-themes'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const Footer = () => {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <footer className="bg-white dark:bg-gray-900 py-12 footer">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 md:gap-16">
          
          {/* Логотип и описание */}
          <div className="max-w-xs">
            <div className="relative h-16 w-48">
              <Image
                src={
                  theme === 'dark'
                    ? '/ChatGPT_Image_7_янв._2026_г.__10_25_48-removebg-preview.png'
                    : '/119423a3-a5c1-47a7-810b-ca8e5be8ebd8-removebg-preview.png'
                }
                alt="dekhon.tj logo"
                width={300}
                height={30}
                className="object-contain relative bottom-[110px]"
              />
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-4">
              Ваш надежный источник свежих продуктов.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-16">
            
            <div>
              <h3 className="text-black dark:text-white font-semibold text-lg mb-6">
                Дар бораи мо
              </h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">Our Story</a></li>
                <li><a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">Team</a></li>
              </ul>
            </div>

            {/* Поддержка */}
            <div>
              <h3 className="text-black dark:text-white font-semibold text-lg mb-6">
                Поддержка
              </h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">FAQ</a></li>
                <li><a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">Contact Us</a></li>
              </ul>
            </div>

            {/* Юридическая информация */}
            <div>
              <h3 className="text-black dark:text-white font-semibold text-lg mb-6">
                Юридическая информация
              </h3>
              <ul className="space-y-4 mb-8">
                <li><a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">Terms of Service</a></li>
              </ul>
              <div>
                <h4 className="text-black dark:text-white font-semibold mb-4">
                  Следуйте за нами
                </h4>
                {/* Добавьте здесь иконки соцсетей */}
              </div>
            </div>
          </div>
        </div>

        {/* Разделительная линия */}
        <div className="h-px bg-gray-200 dark:bg-gray-700 my-8"></div>

        {/* Копирайт */}
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} dekhon.tj. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer