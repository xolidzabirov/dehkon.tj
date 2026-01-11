"use client"
import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"
import { Button } from '@/app/components/ui/button'

const SideBar = () => {
  const [price, setPrice] = useState(50)
  const [category, setCategory] = useState("ҳамааш") // Исправил начальное значение
  const [selectedRating, setSelectedRating] = useState<number | null>(null)

  const resetFilters = () => {
    setPrice(50)
    setCategory("ҳамааш")
    setSelectedRating(null)
  }

  return (
    <div className='sticky top-0 h-screen overflow-y-auto p-4 space-y-4 border-r bg-white'>
      <div className="sticky top-0 bg-white pb-4 z-10">
        <h1 className='text-xl font-semibold text-black'>Филтрҳо</h1>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 mt-6">Категория</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Категория" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Категория</SelectLabel>
                <SelectItem value="ҳамааш">Ҳамааш</SelectItem>
                <SelectItem value="мева">Мевахо</SelectItem>
                <SelectItem value="сабзавот">Сабзавотхо</SelectItem>
                <SelectItem value="гўшт">Гўшт</SelectItem>
                <SelectItem value="шир">Шириёт</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full h-0.5 bg-gray-200"></div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Нарх</label>
          <input 
            type="range" 
            min={10} 
            max={300} 
            onChange={(e) => setPrice(Number(e.target.value))} 
            value={price} 
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600" 
          />
          <div className="w-full flex items-center justify-between mt-2">
            <p className="text-sm text-gray-500">10 TJS</p>
            <p className="text-sm font-medium text-green-600">{price} TJS</p>
            <p className="text-sm text-gray-500">300 TJS</p>
          </div>
        </div>
        
        <div className="w-full h-0.5 bg-gray-200"></div>

        <div>
          <label className="block text-sm font-medium mb-2">Рейтинг</label>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  id={`rating${rating}`}
                  name="rating"
                  value={rating}
                  checked={selectedRating === rating}
                  onChange={() => setSelectedRating(rating)}
                  className="rounded text-green-600 focus:ring-green-500"
                />
                <label 
                  htmlFor={`rating${rating}`} 
                  className="text-sm flex items-center cursor-pointer hover:text-green-600"
                >
                  <span className="text-yellow-400 mr-1">
                    {'★'.repeat(rating)}
                  </span>
                  <span className="text-gray-300">
                    {'☆'.repeat(5-rating)}
                  </span>
                  <span className="ml-1 text-gray-700">{rating}+</span>
                </label>
              </div>
            ))}
          </div>
          
          {/* Кнопка очистки рейтинга - правильно расположена */}
          {selectedRating && (
            <button 
              onClick={() => setSelectedRating(null)}
              className="mt-3 text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
            >
              ✕ Очистить рейтинг
            </button>
          )}
        </div>
        
        <div className="pt-4 space-y-3 sticky bottom-0 bg-white pb-6">
          <Button 
            variant={'outline'} 
            className='w-full text-black font-medium py-3 rounded-lg border-gray-300 hover:bg-gray-100 transition'
            onClick={resetFilters}
          >
            Пок кардани филтрҳо
          </Button>
          
          <Button 
            className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium"
            onClick={() => {
              // Здесь будет логика применения фильтров
              console.log('Применены фильтры:', {
                price,
                category,
                rating: selectedRating
              })
              alert(`Филтрҳо илова карда шуданд:\nНарх: то ${price} TJS\nКатегория: ${category}\nРейтинг: ${selectedRating || 'Ҳама'}`)
            }}
          >
            Филтр кардан
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SideBar