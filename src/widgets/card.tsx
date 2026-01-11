'use client'
import Image from 'next/image'
import { Button } from '@/app/components/ui/button'
import { addToCart } from '@/lib/cart';

const Card = ({ url, style, name, review, price, firma }: { 
  url: string, 
  style: string, 
  name: string, 
  review: string, 
  price: string, 
  firma: string 
}) => {

  const handleAddToCart = () => {
    try {
      const productData = {
        img: url,
        name: name,
        price: price,
        firma: firma,
        review: review,
      };
      
      addToCart(productData);
      alert(`✅ "${name}" ба сабад илова шуд!`);
      
    } catch (error) {
      console.error(error);
      alert('❌ Хатогӣ ҳангоми илова кардан');
    }
  };

  const getRatingFromReview = (reviewText: string): number => {
    // Пробуем разные форматы:
    // 1. "4.5" (просто число)
    // 2. "4.5 ★★★★☆" (число + звезды)
    // 3. "Рейтинг: 4.5" (текст + число)
    
    // Ищем число с точкой
    const match = reviewText.match(/(\d+\.?\d*)/);
    if (match) {
      const rating = parseFloat(match[1]);
      // Ограничиваем от 1 до 5
      return Math.min(Math.max(rating, 1), 5);
    }
    
    // Если не нашли число, используем среднее значение
    return 4.0;
  };

  // Функция для отображения звезд
  const renderStars = (rating: number) => {
    // Округляем до ближайшего целого для звезд
    const roundedRating = Math.round(rating);
    
    return (
      <div className="flex items-center">
        {/* Показываем 5 звезд */}
        {[1, 2, 3, 4, 5].map((starNumber) => (
          <span
            key={starNumber}
            className={`text-lg ${
              starNumber <= roundedRating 
                ? 'text-yellow-400'  // Закрашенная звезда
                : 'text-gray-300'    // Пустая звезда
            }`}
          >
            ★
          </span>
        ))}
        
        {/* Показываем числовой рейтинг */}
        <span className="ml-2 text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  const rating = getRatingFromReview(review);

  return (
    <div className={`${style} hover:shadow-lg transition-shadow duration-300`}>
      <Image 
        src={url}
        alt={name}
        width={300}
        height={200}
        className="w-full h-50 object-cover rounded-t-xl"
      />
      <div className="px-4 py-3 shadow-md rounded-b-xl bg-white">
        <h3 className='text-black font-semibold text-[15px] mb-2 line-clamp-2 min-h-[40px]'>{name}</h3>
        
        {/* Блок с рейтингом */}
        <div className="mb-3">
          {renderStars(rating)}
          
          {/* Если в review есть текст про отзывы, показываем его */}
          {review.toLowerCase().includes('отзыв') ? (
            <p className="text-xs text-gray-500 mt-1">{review}</p>
          ) : (
            <p className="text-xs text-gray-500 mt-1">
              На основе {Math.floor(Math.random() * 50) + 10} отзывов
            </p>
          )}
        </div>
        
        <h3 className='text-green-600 font-bold text-[18px] mb-1'>{price}</h3>
        <p className='text-gray-600 text-sm mb-4'>{firma}</p>
        
        <Button 
          onClick={handleAddToCart} 
          variant={'outline'} 
          className='w-full bg-green-600 hover:bg-green-700 text-white border-green-600 transition-colors'
        >
          🛒 Ба сабад илова кун
        </Button>
      </div>
    </div>
  )
}

export default Card