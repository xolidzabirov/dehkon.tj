'use client'
import Image from "next/image";
import { Button} from '@/app/components/ui/button'
import { useRouter } from "next/navigation";
import Card from "@/widgets/card";

export default function Home() {
  const router = useRouter()

  const Fruits = () => {
     router.push('/catalog')
  }

  const Vegetables = () => {
     router.push('/catalog')
  }

  const products = [
     {
      id: 1,
      img: "/images.jpg",
      name: "Свежие яблоки сорта Гала",
      review: "(28 отзывов)",
      price: "15 TJS / kg",
      firma: "Прадавец: Ферма 'Зелёный Сад'"
     },
     {
      id: 2,
      img: "/доступ.jpg",
      name: "Органическая клубника",
      review: "(19 отзывов)",
      price: "23 TJS / kg",
      firma: "Прадавец: Ферма 'Ягодный Рай'"
     },
     {
      id: 3,
      img: "/Без названия (3).jpg",
      name: "Свежая морковь",
      review: "(49 отзывов)",
      price: "6 TJS / kg",
      firma: "Прадавец: Ферма 'Эко овощи'"
     },
     {
      id: 4,
      img: "/3f67db05400a905e3e11259cfed8469d_cropped_510x340.webp",
      name: "Томаты черри 'Сахарный'",
      review: "(8 отзывов)",
      price: "10 TJS / kg",
      firma: "Прадавец: 'Солнечные Поля'"
     },
     {
      id: 5,
      img: "/strawberries-99551_1920-1440x1080.jpg",
      name: "Деревенский хлеб",
      review: "(4 отзывов)",
      price: "20 TJS / kg",
      firma: "Прадавец: Пекарня 'Урожай'"
     },
     {
      id: 6,
      img: "/images.jpg",
      name: "Домашний козий сыр",
      review: "(13 отзывов)",
      price: "48 TJS / kg",
      firma: "Прадавец: Молочная Ферма"
     },
     {
      id: 7,
      img: "/71333.jpg",
      name: "Домашние куриные яйца",
      review: "(39 отзывов)",
      price: "2.5 TJS / kg",
      firma: "Прадавец: Курятник 'Рябушка'"
     },
     {
      id: 8,
      img: "/Мед-цветочный.jpg",
      name: "Натуральный мед 'Липовый'",
      review: "(40 отзывов)",
      price: "200 TJS / kg",
      firma: "Прадавец: Ферма 'Зелёный Сад'"
     },
     {
      id: 9,
      img: "/75aff036-b52c-4519-bb80-9febd501e764.png",
      name: "Спелые груши 'Конференция'",
      review: "(6 отзывов)",
      price: "18 TJS / kg",
      firma: "Прадавец: Фруктовый Сад"
     }
  ]

  return (
    <div className="pt-10">
      <div style={{backgroundImage: "url('https://gallery.yopriceville.com/downloadfullsize/send/15994')", }} className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl shadow-xl w-[88%] m-auto pb-30">
        <h1 className='text-black text-[50px] font-semibold m-auto mt-30 text-center w-[650px] dark:text-white'>Свежие продукты с фермы на ваш стол</h1>
        <p className='text-black text-[16px] m-[15px_auto] text-center w-[600px] dark:text-white'>Откройте для себя широкий ассортимент свежих фруктов и овощей, выращенных с любовью и доставленных прямо к вашей двери.</p>
        <Button variant='ghost' className='bg-green-500 text-white w-50 m-[10px_auto] ml-120'>Изучить сейчас <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        </Button>
    </div>
    <h1 className="text-black text-[30px] font-bold text-center mt-[100px] mb-[20px] dark:text-white">Наши категории</h1>
    <div className="w-[80%] m-[40px_auto] flex items-center justify-between">
      <div style={{ backgroundImage: 'url("https://asiaplustj.info/sites/default/files/articles/276960/%D0%A4%D1%80%D1%83%D0%BA%D1%82%D1%8B%20%D0%B8%20%D1%8F%D0%B3%D0%BE%D0%B4%D1%8B%20%D0%A2%D0%B0%D0%B4%D0%B6%D0%B8%D0%BA%D0%B8%D1%81%D1%82%D0%B0%D0%BD%D0%B0.jpg")', }} className="w-[48%] h-[280px] rounded-[15px] p-[190px_0px_0px_20px] ">
           <p className='text-white'>Меваҳо</p>
           <Button variant='outline' onClick={Fruits}>Дидани Меваҳо<svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
           <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
           </svg>
           </Button>
      </div>
      <div style={{ backgroundImage: 'url("https://api.cabinet.smart-market.uz/uploads/images/ff808181335f1c00619b6664")', }} className="w-[48%] h-[280px] rounded-[15px] p-[190px_0px_0px_20px] ">
           <p className='text-white'>Сабзавотҳо</p>
           <Button variant='outline' onClick={Vegetables}>Дидани Сабзавотҳо<svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
           <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
           </svg>
           </Button>
      </div>
    </div>
     <h1 className="text-black font-semibold text-2xl text-center dark:text-white ">Почему выбирают AgroHub?</h1>
     <div className="">
      <div className="flex items-center justify-between w-[80%] m-[50px_auto]">
        <Image
          src={'/fermer.jpg'}
          alt="fermer"
          width={500}
          height={80}
          className="rounded-xl"
        />
        <div className="w-130">
          <p className="font-semibold text-2xl mb-5">Напрямую от фермера</p>
          <p>Мы гордимся тем, что предлагаем вам продукты непосредственно от местных фермеров, гарантируя свежесть и качество. Каждый товар поступает из надежных источников, что обеспечивает прозрачность и поддержку местных хозяйств.</p>
        </div>
      </div>
      <div className="flex items-center justify-between w-[80%] m-[50px_auto]">
        <div className="w-130">
          <p className="font-semibold text-2xl mb-5">Свежесть и качество</p>
          <p>Каждый продукт в AgroHub тщательно отбирается, чтобы вы получали только самое лучшее. Мы стремимся к высочайшим стандартам качества, чтобы каждый ваш заказ был полон свежести и вкуса.</p>
        </div>
        <Image 
          src={'/frescura-y-calidad-en-cada-fruta-y-verdura.png'}
          alt=""
          width={500}
          height={80}
          className="rounded-xl"
        />
      </div>
      <div className="flex items-center justify-between w-[80%] m-[50px_auto]">
        <Image
          src={'/доставка.jpg'}
          alt="fermer"
          width={500}
          height={80}
          className="rounded-xl"
        />
        <div className="w-130">
          <p className="font-semibold text-2xl mb-5">Удобство и доступность</p>
          <p>AgroHub делает покупку фермерских продуктов простой и удобной. Легко просматривайте наш каталог, заказывайте и получайте свежие продукты прямо к вашей двери. Наслаждайтесь удобством онлайн-шопинга без компромиссов в качестве.</p>
        </div>
      </div>
     </div>
     {/* Саломатии шумо аз хӯроки солим оғоз меёбад! 🌿🍎
     Хӯроки тару тоза — ҳаёти дарозу пурқувват! 🙏🍇*/}
     <h1 className="font-semibold text-3xl text-black text-center m-[30px_auto]">Инҳоянд неъматҳои Аллоҳ барои мо — бихӯред ва шукр гӯед! 🍉🍅</h1>
     <div className="flex items-center justify-center gap-5 w-[80%] m-auto">
      <Image 
       src={"/ede43da9-d60b-4e74-a5ac-943b1c550c7a.webp"}
       alt=""
       width={500}
       height={900}
       className="m-[80px_auto] rounded-xl"
     />
     <Image 
       src={"/flat-lay-colorful-fresh-fruits-vegetables-nuts-seeds-arranged-beautifully-white-marble-background-vibrant-symbolizing-416524471.webp"}
       alt=""
       width={500}
       height={900}
       className="m-[80px_auto] rounded-xl"
     />
     </div>
     
    <h1 className="text-black text-[40px] font-semibold text-center m-auto dark:text-white">Рекомендуемые продукты</h1>
    <div className="flex items-center justify-between flex-wrap w-[85%] m-[70px_auto]">
        {
           products.map(e => (
            <Card key={e.id} url={e.img} name={e.name} review={e.review} price={e.price} firma={e.firma} style="w-[30%] my-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-gray-200/50 cursor-pointer"  />
           ))
        }
    </div>
    </div>
  );
}
