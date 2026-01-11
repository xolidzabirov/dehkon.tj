// lib/cart.ts
export interface CartItem {
  id: string;
  img: string;
  name: string;
  price: string;
  firma: string;
  review: string;
  quantity: number;
  addedAt?: string;
}

// ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ: безопасно получаем корзину
const getSafeCart = (): CartItem[] => {
  try {
    const cartData = localStorage.getItem('cart');
    
    // Если ничего нет, возвращаем пустой массив
    if (!cartData) {
      return [];
    }
    
    // Пытаемся превратить строку в массив
    const parsed = JSON.parse(cartData);
    
    // Проверяем, что это действительно массив
    if (Array.isArray(parsed)) {
      return parsed;
    } else {
      // Если это не массив (например, объект или строка)
      console.warn('Cart data is not an array, resetting...');
      return [];
    }
  } catch (error) {
    // Если ошибка при чтении/парсинге
    console.error('Error reading cart:', error);
    return [];
  }
};

// Функция добавления товара в корзину (ИСПРАВЛЕНА!)
export const addToCart = (item: Omit<CartItem, 'id' | 'quantity'>) => {
  try {
    // 1. Безопасно получаем корзину (всегда массив!)
    const cart: CartItem[] = getSafeCart();
    
    // 2. Создаем полный объект товара
    const cartItem: CartItem = {
      ...item,
      id: crypto.randomUUID(),
      quantity: 1,
      addedAt: new Date().toISOString()
    };
    
    // 3. Ищем такой же товар в корзине
    // Теперь cart точно массив, поэтому findIndex будет работать
    const existingIndex = cart.findIndex(i => 
      i.name === item.name && i.firma === item.firma
    );
    
    // 4. Обновляем или добавляем товар
    if (existingIndex >= 0) {
      // Товар уже есть - увеличиваем количество
      cart[existingIndex].quantity += 1;
    } else {
      // Товара нет - добавляем новый
      cart.push(cartItem);
    }
    
    // 5. Сохраняем обновленную корзину
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // 6. Отправляем событие для обновления UI
    window.dispatchEvent(new Event('cartUpdated'));
    
    return cart;
    
  } catch (error) {
    console.error('Error in addToCart:', error);
    // Возвращаем текущую корзину или пустой массив
    return getSafeCart();
  }
};

// Функция получения корзины (ИСПРАВЛЕНА!)
export const getCart = (): CartItem[] => {
  return getSafeCart(); // Используем безопасную функцию
};

export const updateQuantity = (id: string, delta: number): CartItem[] => {
  const cart = getSafeCart(); // Получаем корзину
  const itemIndex = cart.findIndex(item => item.id === id); // Ищем товар
  
  if (itemIndex >= 0) {
    cart[itemIndex].quantity += delta; // Меняем количество
    
    // Если количество стало 0 или меньше - удаляем товар
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
    }
    
    // Сохраняем изменения
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  }
  
  return cart;
};

// Функция удаления товара из корзины
export const removeFromCart = (id: string) => {
  try {
    const cart = getSafeCart(); // Всегда получаем массив
    const updatedCart = cart.filter(item => item.id != id);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
    return updatedCart;
  } catch (error) {
    console.error('Error in removeFromCart:', error);
    return [];
  }
};

// Дополнительная функция: очистка корзины
export const clearCart = () => {
  localStorage.setItem('cart', JSON.stringify([]));
  window.dispatchEvent(new Event('cartUpdated'));
};

// Функция получения количества товаров в корзине
export const getCartCount = (): number => {
  const cart = getSafeCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
};

// Функция получения общей суммы
export const getCartTotal = (): number => {
  const cart = getSafeCart();
  return cart.reduce((total, item) => {
    // Преобразуем цену из строки "1000 ₽" в число 1000
    const priceNumber = parseFloat(item.price.replace(/[^\d.]/g, ''));
    return total + (priceNumber * item.quantity);
  }, 0);
};