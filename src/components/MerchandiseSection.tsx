import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css/bundle';

const MerchandiseCard = ({ item }: { item: any }) => {
  const [activeImage, setActiveImage] = useState(item.colors[0].image);

  return (
    <div className="group bg-white rounded-[32px] border border-gray-100 p-4 transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] flex flex-col h-full">
      {/* Image Container with Color Preview */}
      <div className="relative aspect-square rounded-[24px] overflow-hidden bg-gray-50 mb-6">
        <img
          src={activeImage}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Price Tag Overlay */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
          <span className="text-blue-600 font-bold text-sm">{item.price}</span>
        </div>

        {/* Color Swatches on Hover */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 backdrop-blur-md p-2 rounded-2xl">
          {item.colors.map((color: any, idx: number) => (
            <button
              key={idx}
              onMouseEnter={() => setActiveImage(color.image)}
              className="w-4 h-4 rounded-full border border-white shadow-sm transition-transform hover:scale-125"
              style={{ backgroundColor: color.hex || '#ccc' }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Product Details */}
      <div className="px-2 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
            {item.name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 pt-4 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Availability</span>
            <span className="text-xs font-bold text-red-500">{item.timeFrame}</span>
          </div>
          
          <Link
            to={`/merchandisedetails/${item.id}`}
            className="flex items-center justify-center bg-slate-900 text-white p-3 rounded-2xl hover:bg-blue-600 transition-all group/btn"
          >
            <ShoppingBag size={18} className="group-hover/btn:rotate-12 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

const MerchandiseSection = ({ items }: { items: any[] }) => {
  const isSlider = items.length > 2;

  return (
    <section id="merchandise" className="py-24 bg-[#F8FAFC]">
      <div className="container mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-blue-600 mb-4">
              <Tag size={18} />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">The Shop</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Exclusive <span className="text-blue-600">Swag</span>
            </h2>
          </div>
        </div>

        {/* Conditional Layout: Slider vs Grid */}
        {isSlider ? (
          <div className="relative group/slider">
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              autoplay={{ delay: 4000 }}
              navigation={{
                nextEl: ".merc-next",
                prevEl: ".merc-prev",
              }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="!pb-12"
            >
              {items.map((item, index) => (
                <SwiperSlide key={index}>
                  <MerchandiseCard item={item} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Arrows */}
            <div className="flex justify-center gap-4 mt-4">
               <button className="merc-prev p-3 border border-gray-200 rounded-full hover:bg-white hover:shadow-lg transition-all text-gray-400 hover:text-blue-600">
                  <ChevronLeft size={20} />
               </button>
               <button className="merc-next p-3 border border-gray-200 rounded-full hover:bg-white hover:shadow-lg transition-all text-gray-400 hover:text-blue-600">
                  <ChevronRight size={20} />
               </button>
            </div>
          </div>
        ) : (
          /* Simple Grid for 1 or 2 items */
          <div className={`flex flex-wrap justify-center gap-8`}>
            {items.map((item, index) => (
              <div key={index} className="w-full max-w-sm">
                <MerchandiseCard item={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MerchandiseSection;
