"use client"
import Card from '@/widgets/card'
import React from 'react'

const Products = () => {
  const products = [
    {
      id: 1, 
      img: "/ede43da9-d60b-4e74-a5ac-943b1c550c7a.webp",
      name: "Себҳои 'Гала'",
      price: "85 TJS / кг",
      review: "(28 отзывов)",
      firma: "Прадавец: Ферма 'Зелёный Сад'"
    },
    {
      id: 2, 
      img: "/Мед-цветочный.jpg",
      name: "Бананои Африқои",
      price: "85 TJS / кг",
      review: "(28 отзывов)",
      firma: "Прадавец: Ферма 'Зелёный Сад'"
    },
    {
      id: 3, 
      img: "/71333.jpg",
      name: "Яблоки 'Гала'",
      price: "85 TJS / кг",
      review: "(28 отзывов)",
      firma: "Прадавец: Ферма 'Зелёный Сад'"
    },
    {
      id: 4, 
      img: "/ede43da9-d60b-4e74-a5ac-943b1c550c7a.webp",
      name: "Яблоки 'Гала'",
      price: "85 TJS / кг",
      review: "(28 отзывов)",
      firma: "Прадавец: Ферма 'Зелёный Сад'"
    },
    {
      id: 5, 
      img: "/ede43da9-d60b-4e74-a5ac-943b1c550c7a.webp",
      name: "Яблоки 'Гала'",
      price: "85 TJS / кг",
      review: "(28 отзывов)",
      firma: "Прадавец: Ферма 'Зелёный Сад'"
    },
    {
      id: 6, 
      img: "/ede43da9-d60b-4e74-a5ac-943b1c550c7a.webp",
      name: "Яблоки 'Гала'",
      price: "85 TJS / кг",
      review: "(4 отзывов)",
      firma: "Прадавец: Ферма 'Зелёный Сад'"
    },
  ]
  return (
    <div>
      <h1 className='text-3xl font-semibold m-[18px_55px] '>{ "Каталог: Фрукты"}</h1>
      <div className="flex items-center gap-5 flex-wrap w-[95%] m-[70px_auto]">
          {
            products.map(e => (
              <Card key={e.id} url={e.img} name={e.name} price={e.price} review={e.review} firma={e.firma} style="w-[30%] my-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-gray-200/50 cursor-pointer" />
            ))
          }
      </div>
    </div>
  )
}

export default Products
