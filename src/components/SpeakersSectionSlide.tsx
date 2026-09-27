import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import SpeakerCard from "./SpearkerCard";

// Import Swiper styles
import 'swiper/css/bundle';

export default function SpeakerSectionSlide({ speakers }: { speakers: any[] }) {
  const navigate = useNavigate();

  return (
    <section className="py-28 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with "See All" */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-3">
              World-Class <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-brand-orange">Speakers</span>
            </h2>
            <p className="text-lg text-gray-500 font-normal leading-relaxed">
              Join industry leaders and visionaries as they share insights on the future of innovation at Photizo 2026.
            </p>
          </div>
          
          <a 
            href="/speakers" 
            className="group inline-flex items-center gap-3 bg-brand-black text-white px-8 py-4 rounded-full font-bold hover:bg-gradient-to-r hover:from-brand-red hover:to-brand-orange transition-all duration-300 shadow-xl shadow-gray-200 hover:shadow-brand-red/25 shrink-0"
          >
            See All Speakers
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1.5" />
          </a>
        </div>

        {/* Slider Container */}
        <div className="relative group/slider">
          <Swiper
            modules={[Navigation, Autoplay, Pagination]}
            spaceBetween={28}
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
                <div className="h-full py-2">
                  <SpeakerCard 
                    speaker={speaker} 
                    onSpeakerClick={() => navigate(`/speakers`)} 
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-5 z-10 opacity-0 group-hover/slider:opacity-100 transition-opacity hidden lg:block">
            <button className="prev-btn p-4 bg-white border border-gray-200 shadow-xl rounded-full text-gray-800 hover:text-brand-red hover:border-brand-red/40 hover:bg-brand-red/5 transition-all focus:outline-none">
              <ChevronLeft size={22} />
            </button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 -right-5 z-10 opacity-0 group-hover/slider:opacity-100 transition-opacity hidden lg:block">
            <button className="next-btn p-4 bg-white border border-gray-200 shadow-xl rounded-full text-gray-800 hover:text-brand-red hover:border-brand-red/40 hover:bg-brand-red/5 transition-all focus:outline-none">
              <ChevronRight size={22} />
            </button>
          </div> 
        </div>
      </div>
    </section>
  );
}
