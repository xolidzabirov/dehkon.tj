'use client'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { ThemeToggle } from '@/app/components/Theme-toggle'
import { useEffect, useState } from 'react'
import { Button } from '@/app/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"
import { useRouter } from 'next/navigation'

type User = {
   img: string
}

const Header = () => {
  const { theme } = useTheme()
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  const login = () => {
      router.push('/login')
     
  }

  const register = () => {
      router.push('/register')
  }
  
  useEffect(() => {
     try {
    let storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  } catch (err) {
    console.error('Invalid user in localStorage', err);
    setUser(null);
  }
  }, [])
  return (
    <header className="flex items-center justify-center gap-[30px]">
      <Image
        src={
          theme === 'dark'
            ? '/ChatGPT_Image_7_янв._2026_г.__10_25_48-removebg-preview.png'
            : '/119423a3-a5c1-47a7-810b-ca8e5be8ebd8-removebg-preview.png'
        }
        alt=""
        width={100}
        height={30}
        priority
        className=''
      />
      <div className="flex items-center ">  
        <svg
    className="absolute left-[220px] top-[75px] -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-300 pointer-events-none"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
         </svg>
        <input type="text" className='w-[350px] border-1 dark:border-[gray] rounded-[12px] p-[5px_0px] pl-[40px] ' placeholder='Ҷустуҷӯи маҳсулот...' />
      </div>
      <nav className="flex items-center justify-between gap-[18px]">
        <p>Асоси</p>
        <p>Каталог</p>
        <p>Дар бораи мо</p>
        <Select defaultValue='тоҷ'>
      <SelectTrigger className="w-[80px] rounded-[13px]">
        <SelectValue placeholder="тоҷ" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="тоҷ">тoҷ</SelectItem>
          <SelectItem value="рус">рус</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
      </nav>
      <div className="flex items-center justify-center gap-[15px]">
        
        <ThemeToggle />
      {
          user ? 
          <Image 
            src={user.img || 'public/image-removebg-preview (1).png'}
            alt=''
            width={60}
            height={60}
            className='rounded-[50%] ml-[30]'
          />
          : (<>
            <Button onClick={login} variant="outline" className='rounded-[13px]'>Дохил шудан</Button>
            <Button onClick={register} variant="ghost" className='bg-green-500 text-white rounded-[13px]'>Бақайдгирӣ</Button>
          </>
          )   

          
      }
      </div>
      
    </header>
  )
}

export default Header
