import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import SpeakerCard from "./SpearkerCard";

// Import Swiper styles
import 'swiper/css/bundle';

export default function SpeakerSectionSlide({ speakers }: { speakers: any[] }) {


  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        
        {/* Header with "See All" */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
              World-Class <span className="text-brand-red">Speakers</span>
            </h2>
            <p className="text-lg text-gray-500 font-light leading-relaxed">
              Join industry leaders and visionaries as they share insights on the future of innovation at Photizo 2026.
            </p>
          </div>
          
          <a 
            href="/speakers" 
            className="group flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-brand-red transition-all shadow-xl shadow-slate-200"
          >
            See All Speakers
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* Slider Container */}
        <div className="relative group/slider">
          <Swiper
            modules={[Navigation, Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            navigation={{
              nextEl: ".next-btn",
              prevEl: ".prev-btn",
            }}
            breakpoints={{
              768: { slidesPerView: 1.5 },
              1024: { slidesPerView: 2.2 },
            }}
            className="!pb-16"
          >
            {speakers.map((speaker) => (
              <SwiperSlide key={speaker.id}>
                <div className="h-full py-4">
                  <SpeakerCard 
                    speaker={speaker} 
                    onSpeakerClick={() => window.location.href = '/speakers'} 
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 z-10 opacity-0 group-hover/slider:opacity-100 transition-opacity hidden lg:block">
            <button className="prev-btn p-4 bg-white border border-gray-100 shadow-xl rounded-full text-gray-900 hover:text-blue-600 transition-all">
              <ChevronLeft size={24} />
            </button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 -right-4 z-10 opacity-0 group-hover/slider:opacity-100 transition-opacity hidden lg:block">
            <button className="next-btn p-4 bg-white border border-gray-100 shadow-xl rounded-full text-gray-900 hover:text-blue-600 transition-all">
              <ChevronRight size={24} />
            </button>
          </div> 
        </div>
      </div>
    </section>
  );
}
