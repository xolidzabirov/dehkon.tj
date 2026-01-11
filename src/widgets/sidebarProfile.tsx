"use client"
import { Button } from '@/app/components/ui/button'
import { Plus } from 'lucide-react'
import Image from 'next/image'

const sidebarProfile = () => {
  const user = localStorage.getItem('user')


  return (
    <div>
      {
        user ? 
        <div className="">
            <h1>Hello</h1>
        </div>
        :
        <div className="">
            <Image 
              src="/image-removebg-preview (1).png"
              alt='Кор бар'
              width={100}
              height={100}
              className='rounded-[50%]'
            />
            <div className="">
              <h1>Kholid</h1>
              <p>Рейтинг 4.8</p>
            </div>
        </div>}
        <Button variant={'outline'} className=''> <Plus size={48} strokeWidth={1.5} color='black' className="opacity-80 text-white" /> Добавить товар</Button>
    </div>
  )
}
export default sidebarProfile