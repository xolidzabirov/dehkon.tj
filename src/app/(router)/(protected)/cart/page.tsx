'use client'
import { Button } from '@/app/components/ui/button'
import { getCart, removeFromCart, updateQuantity } from '@/lib/cart'
import { Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

   export type CartProducts = {
  id: string,
  img: string,
  name: string,
  price: number,
  quantity: number,
  firma?: string,
  review?: string
}

    const Cart = () => {
     const [products, setProducts] = useState<CartProducts[]>([])

     const loadCart = () => {
    try {
      const cartData = getCart() // Получаем данные
      
      // Преобразуем данные
      const formattedProducts = cartData.map(item => ({
        id: item.id,
        img: item.img,
        name: item.name,
        price: parseFloat(item.price.replace(/[^\d.]/g, '')) || 0,
        quantity: item.quantity,
        firma: item.firma,
        review: item.review
      }))
      
      setProducts(formattedProducts)
    } catch (error) {
      console.error('Error loading cart:', error)
      setProducts([])
    }
  }

  const handleUpdateQuantity = (id: string, delta: number) => {
    // 1. Обновляем в localStorage
    const updatedCart = updateQuantity(id, delta)
    
    // 2. Обновляем локальное состояние
    setProducts(prev => 
      prev.map(p => 
        p.id === id 
          ? { ...p, quantity: Math.max(1, p.quantity + delta) }
          : p
      ).filter(p => p.quantity > 0)
    )
    
    // 3. Можно вызвать loadCart() для полной перезагрузки
    loadCart()
  }

  // Удаление товара
  const handleRemoveItem = (id: string) => {
    if (confirm('Удалить товар из корзины?')) {
      removeFromCart(id)
      setProducts(prev => prev.filter(p => p.id !== id))
      loadCart()
    }
  }

  // Расчеты
  const subtotal = products.reduce(
    (sum, p) => sum + (p.price * p.quantity),
    0
  )

  const shipping = subtotal > 100 ? 0 : 5 // Бесплатная доставка от 100
  const total = subtotal + shipping
        
         useEffect(() => {
         loadCart()
    
    // Слушаем события обновления
    window.addEventListener('cartUpdated', loadCart)
    
    return () => {
      window.removeEventListener('cartUpdated', loadCart)
    }
  }, [])
    return (
        <div className='pb-30'>
        <h1 className='font-semibold text-black text-4xl ml-26.5'>Your Basket</h1>
        <div className="flex justify-between w-[85%] m-auto mt-5">
        <div className="">
            {
                products.map(e => (
                <div key={e.id} className="w-125 h-25 border bg-white shadow-sm rounded-xl p-3 mt-2 flex items-center ">
                    <Image 
                        src={e.img}
                        alt=''
                        width={80}
                        height={130}
                        className='rounded-lg h-full'
                    />
                    <div className="flex items-center justify-between w-[83%]">
                        <div className="m-[5px_20px]">
                    <p>{e.name}</p>
                    <div className="flex items-center gap-2">
                        <button onClick={() => handleUpdateQuantity(e.id, -1)} className='font-semibold text-[25px] text-red-500'>-</button>
                        <p className='font-semibold text-[14px] text-center w-10 h-5 rounded-sm shadow-sm'>{e.quantity}</p>
                        <button onClick={() => handleUpdateQuantity(e.id, 1)} className='font-semibold text-[25px] text-green-500'>+</button>
                    </div>
                    </div>
                    <div className="">
                        <p className='text-green-500 font-semibold '>{e.price} TJS</p>
                        <Trash2 onClick={() => handleRemoveItem(e.id)} className='m-auto' size={20} color="red" />
                    </div>
                    </div>   
                </div>
                ))
            }
        </div>
        <div className="bg-white w-[320px] h-58.75 rounded-xl px-5 py-2">
            <h1 className='text-black text-[25px] font-semibold'>Order Summary</h1>
            <span className='flex items-center justify-between w-full'>
                Subtotal: <span>${subtotal.toFixed(2)}</span>
            </span>
            <span className='flex items-center justify-between w-full'>
                Shipping: <span className='mr-2'>${shipping.toFixed(2)}</span>
            </span>
            <hr className='my-5 ' />
            <span className='flex items-center justify-between w-full gap-25'>
                Total: <span className='text-green-600 font-semibold '>${total.toFixed(2)}</span>
            </span>
            <Button variant={'outline'} className='bg-green-600 text-white m-[16px_auto] w-70 h-10 '>Ба пардохт гузаштан</Button>
        </div>
        </div>
        </div>
    )
    }

    export default Cart
