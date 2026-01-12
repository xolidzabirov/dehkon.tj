'use client'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { ThemeToggle } from '@/widgets/theme-toggle'
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
import Link from 'next/link'

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
    // let storedUser = localStorage.getItem('user');
    // if (storedUser) setUser(JSON.parse(storedUser));
  } catch (err) {
    console.error('Invalid user in localStorage', err);
    setUser(null);
  }
  }, [])
  return (
    <header className="flex items-center justify-center gap-[30px] h-20 mb-5 shadow-xl ">
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
        <input type="text" className='w-[350px] border-1 dark:border-[gray] rounded-[12px] p-[5px_0px] pl-2' placeholder='Ҷустуҷӯи маҳсулот...' />
      </div>
      <nav className="flex items-center justify-between gap-[18px]">
        <Link href={'/'}><p className='text-gray-700 font-semibold hover:text-green-600 transition-colors'>Асоси</p></Link>
        <Link href={'/catalog'}><p className='text-gray-700 font-semibold hover:text-green-600 transition-colors'>Каталог</p></Link>
        <Link href={'/aboutUs'}><p className='text-gray-700 font-semibold hover:text-green-600 transition-colors'>Дар бораи мо</p></Link>
        <Link href={'/profile'}><p className='text-gray-700 font-semibold hover:text-green-600 transition-colors'>Профил</p></Link>
        <Select defaultValue='тоҷ'>
      <SelectTrigger className="w-20 rounded-[13px]">
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
      <div className="flex items-center justify-center gap-3.75">
        
        <ThemeToggle />
      {
          !user ? 
          <div className="flex items-center">
            <Link href={'/cart'}>
            🛒
            </Link>
            <Image 
            src={'/image-removebg-preview (1).png'}
            alt=''
            width={60}
            height={60}
            className='rounded-[50%] ml-[30]'
          />
          </div>
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
