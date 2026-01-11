'use client'
import { ThemeToggle } from '@/widgets/theme-toggle'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Select } from '@/app/components/ui/select'
import { SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const Login = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('тоҷ')
  const router = useRouter()


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-4">
      <div className="w-full max-w-md">
        {/* Карточка входа */}
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
          <div className="text-center py-6 px-4">
            <div className="mb-2">
              {/* Логотип */}
              <div className="flex justify-center mb-3">
                <div className="relative w-48 h-16">
                   <Image
                     src="/119423a3-a5c1-47a7-810b-ca8e5be8ebd8-removebg-preview.png"
                     alt="dehken.tj логотип"
                     fill
                     priority
                     sizes="350px"
                     quality={100}
                     className="object-contain drop-shadow-lg"
                    />
                  <Image
                    src="/ChatGPT_Image_7_янв._2026_г.__10_25_48-removebg-preview.png"
                    alt="dehken.tj логотип темная тема"
                    fill
                    priority
                    className="object-contain hidden dark:block"
                  />
                </div>
              </div>
              
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                деҳқон - платформа для сельского хозяйства
              </div>
            </div>

            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">
              Добро пожаловать обратно!
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Войдите в свой аккаунт для продолжения
            </p>
          </div>

          {/* Форма */}
          <div className="px-6 pb-8">
            <form className="space-y-5">
              {/* Поле email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Почтаи электронӣ
                </label>
                <div className="relative">
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Почтаи электронӣ"
                    className="w-full h-10 pl-10 pr-4"
                    required
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Поле пароля */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Рамз
                  </label>
                  <a href="/register" className="text-xs text-green-600 hover:text-green-700 dark:text-green-400">
                    Забыли пароль?
                  </a>
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Рамз"
                    className="w-full h-10 pl-10 pr-4"
                    required
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Кнопка входа */}
              <Button 
                type="submit" 
                className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md"
                onClick={() => router.push('/')}
              >
                Войти
              </Button>

              {/* Ссылка на регистрацию */}
              <div className="text-center pt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ещё нет аккаунта?{' '}
                  <a href="/register" className="font-medium text-green-600 hover:text-green-700 dark:text-green-400">
                    Зарегистрироваться
                  </a>
                </p>
              </div>

              {/* Разделитель */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white dark:bg-gray-900 text-gray-500">
                    или войдите через
                  </span>
                </div>
              </div>

              {/* Социальные кнопки */}
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => window.open("https://www.google.com/?hl=ru", "_blank")}
                  className="h-10 border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => window.open("https://www.facebook.com", "_blank")}
                  className="h-10 border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </Button>
              </div>
            </form>
          </div>

          {/* Футер */}
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>© 2024 dehkon.tj</span>
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

export default Login



// 'use client'
// import { ThemeToggle } from '@/app/components/Theme-toggle'
// import { Button } from '@/app/components/ui/button'
// import { Input } from '@/app/components/ui/input'
// import { Select } from '@/app/components/ui/select'
// import { SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'
// import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group'
// import Image from 'next/image'
// import React, { useState } from 'react'

// const Login = () => {
//   const [userType, setUserType] = useState('buyer')

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-4">
//       <div className="w-full max-w-md">
//         {/* Карточка входа */}
//         <div className="w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
//           {/* Шапка с языком и темой */}
//           <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
//             <div className="flex items-center gap-2">
//               <div className="w-6 h-6 rounded-full bg-green-500"></div>
//               <span className="text-sm font-medium text-gray-700 dark:text-gray-300">ТОҶ</span>
//             </div>
            
//             <div className="flex items-center gap-3">
//               <Select defaultValue='тоҷ'>
//                 <SelectTrigger className="w-20 h-8 text-xs">
//                   <SelectValue placeholder="тоҷ" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectGroup>
//                     <SelectItem value="тоҷ">тоҷ</SelectItem>
//                     <SelectItem value="рус">рус</SelectItem>
//                   </SelectGroup>
//                 </SelectContent>
//               </Select>
//               <ThemeToggle />
//             </div>
//           </div>

//           {/* Логотип и заголовок */}
//           <div className="text-center py-6 px-4">
//             <div className="mb-2">
//               <div className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
//                 dehk<span className="text-green-600">ɒ</span>n.tj
//               </div>
//               <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                 деҳқон - платформа для сельского хозяйства
//               </div>
//             </div>

//             <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">
//               Добро пожаловать обратно!
//             </h1>
//             <p className="text-sm text-gray-600 dark:text-gray-400">
//               Войдите в свой аккаунт для продолжения
//             </p>
//           </div>

//           {/* Форма */}
//           <div className="px-6 pb-8">
//             <form className="space-y-5">
//               {/* Поле email */}
//               <div className="space-y-2">
//                 <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Электронная почта
//                 </label>
//                 <div className="relative">
//                   <Input 
//                     id="email" 
//                     type="email" 
//                     placeholder="Ваша электронная почта"
//                     className="w-full h-10 pl-10 pr-4"
//                     required
//                   />
//                   <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
//                     <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                     </svg>
//                   </div>
//                 </div>
//               </div>

//               {/* Поле пароля */}
//               <div className="space-y-2">
//                 <div className="flex justify-between items-center">
//                   <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                     Пароль
//                   </label>
//                   <a href="#" className="text-xs text-green-600 hover:text-green-700 dark:text-green-400">
//                     Забыли пароль?
//                   </a>
//                 </div>
//                 <div className="relative">
//                   <Input 
//                     id="password" 
//                     type="password" 
//                     placeholder="Пароль"
//                     className="w-full h-10 pl-10 pr-4"
//                     required
//                   />
//                   <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
//                     <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                     </svg>
//                   </div>
//                 </div>
//               </div>

//               {/* Выбор типа пользователя */}
//               <div className="space-y-3">
//                 <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Войти как
//                 </label>
              
//               </div>

//               {/* Кнопка входа */}
//               <Button 
//                 type="submit" 
//                 className="w-full h-11 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-md"
//               >
//                 Войти
//               </Button>

//               {/* Ссылка на регистрацию */}
//               <div className="text-center pt-4">
//                 <p className="text-sm text-gray-600 dark:text-gray-400">
//                   Ещё нет аккаунта?{' '}
//                   <a href="#" className="font-medium text-green-600 hover:text-green-700 dark:text-green-400">
//                     Зарегистрироваться
//                   </a>
//                 </p>
//               </div>

//               {/* Разделитель */}
//               <div className="relative my-6">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-3 bg-white dark:bg-gray-900 text-gray-500">
//                     или войдите через
//                   </span>
//                 </div>
//               </div>

//               {/* Социальные кнопки */}
//               <div className="grid grid-cols-2 gap-3">
//                 <Button 
//                   type="button" 
//                   variant="outline" 
//                   className="h-10 border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
//                 >
//                   <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
//                     <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                     <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                     <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                     <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//                   </svg>
//                   Google
//                 </Button>
//                 <Button 
//                   type="button" 
//                   variant="outline" 
//                   className="h-10 border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
//                 >
//                   <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
//                     <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
//                   </svg>
//                   Facebook
//                 </Button>
//               </div>
//             </form>
//           </div>

//           {/* Футер */}
//           <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
//             <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
//               <span>© 2024 dehkon.tj</span>
//               <div className="flex gap-4">
//                 <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">Помощь</a>
//                 <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">Контакты</a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Login