'use client'
import { ThemeToggle } from '@/widgets/theme-toggle'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Select } from '@/app/components/ui/select'
import { SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'
import Image from 'next/image'
import { useState, useRef } from 'react'

const Register = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('тоҷ')
  const [userType, setUserType] = useState('buyer')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Локальные изображения аватаров (поместите их в public/avatars/)
  const defaultAvatars = [
    '/avatars/farmer1.png',
    '/avatars/farmer2.png', 
    '/avatars/farmer3.png',
    '/avatars/farmer4.png',
    '/avatars/farmer5.png',
    '/avatars/farmer6.png',
  ]

  // Если нет локальных изображений, используем простые цветные аватары
  const colorAvatars = [
    { bg: 'bg-blue-500', text: 'Ф1' },
    { bg: 'bg-green-500', text: 'Ф2' },
    { bg: 'bg-yellow-500', text: 'Ф3' },
    { bg: 'bg-red-500', text: 'Ф4' },
    { bg: 'bg-purple-500', text: 'Ф5' },
    { bg: 'bg-pink-500', text: 'Ф6' },
  ]

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Файл слишком большой. Максимальный размер 5MB')
        return
      }

      if (!file.type.startsWith('image/')) {
        alert('Пожалуйста, выберите файл изображения')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
        setSelectedImage('custom')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAvatarSelect = (index: number) => {
    setSelectedImage(`avatar-${index}`)
    // Для цветных аватаров не устанавливаем previewImage
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setPreviewImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Логика регистрации
    console.log({
      language: selectedLanguage,
      userType,
      avatar: selectedImage,
      hasCustomImage: !!previewImage
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-4">
      <div className="w-full max-w-md">
        <div className="w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
          
          {/* Шапка с языком и темой */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {selectedLanguage === 'тоҷ' ? 'ТОҶ' : 'РУС'}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-20 h-8 text-xs">
                  <SelectValue placeholder="тоҷ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="тоҷ">тоҷ</SelectItem>
                    <SelectItem value="рус">рус</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <ThemeToggle />
            </div>
          </div>

          {/* Логотип и заголовок */}
          <div className="text-center py-8 px-4">
            <div className="mb-2">
              {/* Логотип */}
              <div className="mb-6">
                <div className="relative w-full h-[100px] max-w-[300px] mx-auto">
                  <div className="relative w-full h-full block dark:hidden">
                    <Image
                      src="/119423a3-a5c1-47a7-810b-ca8e5be8ebd8-removebg-preview.png"
                      alt="dehken.tj логотип"
                      fill
                      priority
                      sizes="300px"
                      quality={100}
                      className="object-contain"
                    />
                  </div>
                  
                  <div className="relative w-full h-full hidden dark:block">
                    <Image
                      src="/ChatGPT_Image_7_янв._2026_г.__10_25_48-removebg-preview.png"
                      alt="dehken.tj логотип темная тема"
                      fill
                      priority
                      sizes="300px"
                      quality={100}
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                деҳқон - платформа для сельского хозяйства
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-3">
              Создать аккаунт
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Зарегистрируйтесь для доступа к платформе
            </p>
          </div>

          {/* Форма регистрации */}
          <div className="px-6 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Поля формы */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Фамилия и Имя
                  </label>
                  <Input 
                    id="fullName" 
                    type="text" 
                    placeholder="Введите ваше полное имя"
                    className="w-full h-10"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Электронная почта
                  </label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="example@email.com"
                    className="w-full h-10"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Номер телефона
                  </label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="+992 00 000 0000"
                    className="w-full h-10"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Пароль
                  </label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Создайте надежный пароль"
                    className="w-full h-10"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Подтвердите пароль
                  </label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="Повторите пароль"
                    className="w-full h-10"
                    required
                  />
                </div>

                {/* Тип пользователя */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Тип аккаунта
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        userType === 'buyer'
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                          : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
                      }`}
                      onClick={() => setUserType('buyer')}
                    >
                      <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Покупатель</span>
                    </button>
                    
                    <button
                      type="button"
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        userType === 'seller'
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                          : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
                      }`}
                      onClick={() => setUserType('seller')}
                    >
                      <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Продавец</span>
                    </button>
                  </div>
                </div>

                {/* Согласие с условиями */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                    Я соглашаюсь с{' '}
                    <a href="#" className="text-green-600 hover:text-green-700 dark:text-green-400">
                      условиями использования
                    </a>{' '}
                    и{' '}
                    <a href="#" className="text-green-600 hover:text-green-700 dark:text-green-400">
                      политикой конфиденциальности
                    </a>
                  </label>
                </div>
              </div>

              {/* Кнопка регистрации */}
              <Button 
                type="submit" 
                className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md"
              >
                Зарегистрироваться
              </Button>

              {/* Ссылка на вход */}
              <div className="text-center pt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Уже есть аккаунт?{' '}
                  <a href="/login" className="font-medium text-green-600 hover:text-green-700 dark:text-green-400">
                    Войти
                  </a>
                </p>
              </div>
            </form>
          </div>

          {/* Футер */}
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>© 2024 dehken.tj</span>
              <div className="flex gap-4">
                <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">Помощь</a>
                <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">Контакты</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register