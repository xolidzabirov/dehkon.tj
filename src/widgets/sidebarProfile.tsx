"use client"
import { Button } from '@/app/components/ui/button'
import Image from 'next/image'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageCircle,
  Mail,
  Settings,
  User,
  BarChart3,
  Star,
  Plus,
  LogOut,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"
import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import { useEffect, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';

const SidebarProfile = () => {
  const user = ""
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  console.log("Params:", params);
  
  const id = params?.id as string || ''
  console.log("userId:", id)

  const [lang, setLang] = useState("тоҷ");
  const [mounted, setMounted] = useState(false)
  
  // ✅ Решение проблемы гидратации
  useEffect(() => {
    setMounted(true)
  }, []) 

  const Logout = () => {
      router.push("/login")
  }
  const sallerMenuItems = [
    {
      id: "dashboard",
      name: "Панели идоракунӣ",
      url: "/",
      icon: LayoutDashboard
    },
    {
      id: "products",
      name: "Молҳои ман",
      url: id ? `/${id}/products` : "/profile/products",
      icon: Package
    }, 
    {
      id: "orders",
      name: "Фармоишҳо",
      url: "/",
      icon: ShoppingCart
    },
    {
      id: "chat",
      name: "Чат",
      url: "/",
      icon: MessageCircle
    },
    {
      id: "messages",
      name: "Паёмҳо",
      url: "/",
      icon: Mail
    },
    {
    id: "settings",
    name: "Танзимот",
    url: "/",
    icon: Settings,
    },
    {
      id: "profile",
      name: "Профили фурӯшанда",
      url: "/",
      icon: User
    },
    {
      id: "reports",
      name: "Ҳисоботҳо",
      url: "/",
      icon: BarChart3
    },
    {
      id: "reviews",
      name: "Баррасиҳо",
      url: "/",
      icon: Star
    }
  ]

  const isActive = (url: string) => {
    return pathname === url;
  }

  return (
    <div className=''>
      {
        user ? 
        <div className="">
            <h1>Hello</h1>
        </div>
        :
        <div className="flex items-center gap-3 m-[25px_15px]">
            <Image 
              src="/image-removebg-preview (1).png"
              alt='Кор бар'
              width={60}
              height={60}
              className='rounded-[50%]'
            />
            <div className="">
              <h1>Kholid</h1>
              <p>Рейтинг 4.8</p>
            </div>
        </div>}
        <Button variant={'outline'} className='flex items-center gap-2 bg-green-500 text-white w-60 h-11 m-auto '> <Plus size={60} strokeWidth={1.5} color='white' className="opacity-80" /> Добавить товар</Button>
        <div className="m-[25px_10px]">
          {
            sallerMenuItems.map(item => (
                <Link key={item.id} href={item.url} className={`flex items-center gap-5 my-1 w-58 p-[8px_12px] rounded-lg transition-colors ${
              isActive(item.url) 
                ? 'bg-blue-50 border-blue-200 text-blue-600' 
                : 'hover:bg-gray-50'
            }`}
          >
                 <item.icon  size={18} />
                 <span>{item.name}</span>
                </Link>
            ))
          }
        </div>
        <h3 className='text-xl font-semibold m-[8px_25px]'>Cтатистика</h3>
        <div className="mt-3">
          <div className="h-20 rounded-lg p-3 border m-[5px_10px]">
            <p className='text-gray-600 text-sm'>Хамаи махсулотхо</p>
            <span className='font-semibold text-2xl mt-1'>125</span>
          </div>
          <div className="h-20 rounded-lg p-3 border m-[5px_10px]">
            <p className='text-gray-600 text-sm'>Фармоишҳо дар ҳамин ҳафта</p>
            <span className='font-semibold text-2xl mt-1'>12</span>
          </div>
          <div className="h-20 rounded-lg p-3 border m-[5px_10px]">
            <p className='text-gray-600 text-sm'>Даромад дар 30 рӯз</p>
            <span className='font-semibold text-2xl mt-1'>12 500 TJS</span>
          </div>
        </div>
        <hr className='w-[92%] m-[15px_auto]' />
        <Button onClick={Logout} variant={'outline'} className='w-62 h-10 m-auto border-none shadow-none text-red-500'><LogOut /> Выйти</Button>
        <div className="flex items-center justify-between m-3.75">
          <ThemeToggle />
          <Select value={lang} onValueChange={(value) => setLang(value)}>
      <SelectTrigger className="w-20 rounded-[7px]">
        <SelectValue placeholder="тoҷ" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="тоҷ">тoҷ</SelectItem>
          <SelectItem value="рус">рус</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
        </div>
    </div>
  )
}
export default SidebarProfile