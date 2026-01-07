'use client'
import Image from "next/image";
import { Button} from '@/app/components/ui/button'
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()

  const Fruits = () => {
     router.push('/catalog')
  }

  const Vegetables = () => {
     router.push('/catalog')
  }

  return (
    <div>
      <div style={{backgroundImage: "url('https://gallery.yopriceville.com/downloadfullsize/send/15994')", }} className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl shadow-xl w-[88%] m-auto pb-30">
      <div className="bg-gray-500 opacity-50 w-full h-full">
        <h1 className='text-black text-[50px] font-semibold m-auto mt-30 text-center w-[650px]'>Свежие продукты с фермы на ваш стол</h1>
        <p className='text-black text-[16px] m-[15px_auto] text-center w-[600px]'>Откройте для себя широкий ассортимент свежих фруктов и овощей, выращенных с любовью и доставленных прямо к вашей двери.</p>
        <Button variant='ghost' className='bg-green-500 text-white w-50 m-[10px_auto] ml-120'>Изучить сейчас <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        </Button>
        </div>
    </div>
    <h1 className="text-black text-[30px] font-bold text-center mt-[180px] mb-[20px]">Популярные категории</h1>
    <div className="w-[80%] m-[40px_auto] flex items-center justify-between">
      <div style={{ backgroundImage: 'url("https://asiaplustj.info/sites/default/files/articles/276960/%D0%A4%D1%80%D1%83%D0%BA%D1%82%D1%8B%20%D0%B8%20%D1%8F%D0%B3%D0%BE%D0%B4%D1%8B%20%D0%A2%D0%B0%D0%B4%D0%B6%D0%B8%D0%BA%D0%B8%D1%81%D1%82%D0%B0%D0%BD%D0%B0.jpg")', }} className="w-[45%] h-[280px] rounded-[15px] p-[190px_0px_0px_20px] ">
           <p className='text-white'>Меваҳо</p>
           <Button variant='outline' onClick={Fruits}>Дидани Меваҳо<svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
           <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
           </svg>
           </Button>
      </div>
      <div style={{ backgroundImage: 'url("https://api.cabinet.smart-market.uz/uploads/images/ff808181335f1c00619b6664")', }} className="w-[45%] h-[280px] rounded-[15px] p-[190px_0px_0px_20px] ">
           <p className='text-white'>Сабзавотҳо</p>
           <Button variant='outline' onClick={Vegetables}>Дидани Сабзавотҳо<svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
           <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
           </svg>
           </Button>
      </div>
    </div>
    </div>
  );
}
