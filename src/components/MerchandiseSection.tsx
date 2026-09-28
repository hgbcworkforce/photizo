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
    <div className="group bg-white rounded-3xl border border-gray-100 p-4 transition-all duration-500 hover:shadow-xl hover:shadow-brand-orange/5 hover:border-brand-orange/20 flex flex-col h-full">
      {/* Image Container with Color Preview */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-5">
        <img
          src={activeImage}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Price Tag Overlay */}
        <div className="absolute top-3.5 left-3.5 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm border border-gray-100">
          <span className="text-brand-red font-extrabold text-sm">{item.price}</span>
        </div>

        {/* Color Swatches on Hover */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
          {item.colors.map((color: any, idx: number) => (
            <button
              key={idx}
              onMouseEnter={() => setActiveImage(color.image)}
              className="w-4 h-4 rounded-full border border-white shadow-sm transition-transform hover:scale-125 focus:outline-none"
              style={{ backgroundColor: color.hex || '#ccc' }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Product Details */}
      <div className="px-2 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1.5 group-hover:text-brand-red transition-colors">
            {item.name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed font-normal">
            {item.description}
          </p>
        </div>

        <div className="mt-auto flex flex-col gap-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Availability</span>
            <span className="text-xs font-bold text-brand-red">{item.timeFrame}</span>
          </div>

          <Link
            to={`/merchandisedetails/${item.id}`}
            className="flex items-center justify-center gap-2.5 w-full bg-slate-900 hover:bg-gradient-to-r hover:from-brand-red hover:to-brand-orange text-white py-3 px-4 rounded-2xl transition-all duration-300 font-bold text-xs uppercase tracking-wider shadow-sm group/btn"
          >
            <span>Order Now</span>
            <ShoppingBag size={15} className="group-hover/btn:scale-110 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

const MerchandiseSection = ({ items }: { items: any[] }) => {
  const isSlider = items.length > 2;

  return (
    <section id="merchandise" className="py-28 bg-[#f8fafc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-bold uppercase tracking-[0.2em] mb-4">
              <Tag size={13} className="fill-current" />
              <span>THE SHOP</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
              Exclusive <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-brand-orange">Swag</span>
            </h2>
          </div>
        </div>

        {/* Conditional Layout: Slider vs Grid */}
        {isSlider ? (
          <div className="relative group/slider">
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={28}
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
              className="!pb-6"
            >
              {items.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="h-full py-2">
                    <MerchandiseCard item={item} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Arrows */}
            <div className="flex justify-center gap-3 mt-8">
               <button className="merc-prev p-3 border border-gray-200 bg-white rounded-full hover:border-brand-orange/40 hover:text-brand-orange hover:shadow-md transition-all text-gray-600 focus:outline-none">
                  <ChevronLeft size={20} />
               </button>
               <button className="merc-next p-3 border border-gray-200 bg-white rounded-full hover:border-brand-orange/40 hover:text-brand-orange hover:shadow-md transition-all text-gray-600 focus:outline-none">
                  <ChevronRight size={20} />
               </button>
            </div>
          </div>
        ) : (
          /* Simple Grid for 1 or 2 items */
          <div className="flex flex-wrap justify-center gap-8">
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
