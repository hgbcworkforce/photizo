import { ArrowRight, Target, Zap } from 'lucide-react';
import aboutImage from '../assets/about-img.jpeg';

export default function AboutSection() {
  return (
    <section id="about" className="py-28 bg-white relative overflow-hidden">
      {/* Background Decorative ambient light */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-red/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Visual Side */}
          <div className="lg:col-span-6 relative">
            <div className="relative">
              {/* Subtle back decorative glow border */}
              <div className="absolute -inset-2 rounded-[2.5rem] bg-gradient-to-tr from-brand-red/20 to-brand-orange/20 blur-xl opacity-60" />
              
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white bg-gray-100">
                <img
                  src={aboutImage}
                  alt="Photizo'26 banner"
                  className="w-full object-cover aspect-[4/5] lg:h-[620px] transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>
          </div>

          {/* Text Content Side */}
          <div className="lg:col-span-6">
            <div className="space-y-8">
              <div>
                <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs font-bold uppercase tracking-widest mb-4">
                  The Experience
                </span>
                <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                  About <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-brand-orange">Photizo</span>
                </h2>
              </div>

              <div className="space-y-5 text-gray-600 text-lg leading-relaxed font-normal">
                <p>
                  Photizo is a purpose-driven platform dedicated to{" "}
                  <span className="text-gray-900 font-semibold underline decoration-brand-red/40 decoration-2 underline-offset-4">
                    raising and empowering individuals to become influential leaders in their spheres of impact.
                  </span>{" "}
                  The vision of Photizo is centered on building men and women who are equipped to create meaningful change in society through both personal growth and strategic engagement.
                </p>
                
                <p>
                  Photizo challenges individuals to move beyond limitations, grow intentionally, and expand their influence. It promotes a balanced approach to impact, combining personal and 
                  spiritual development with active social and professional engagement, so individuals are transformed within and empowered to make meaningful contributions in their communities.
                </p>
              </div>

              {/* Icon Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-brand-red/20 hover:bg-brand-red/5 transition-all duration-300">
                  <div className="p-3 bg-brand-red/10 rounded-xl text-brand-red shrink-0">
                    <Target size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">Purpose Driven</h4>
                    <p className="text-sm text-gray-500 mt-0.5">Building impact-focused futures.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-brand-orange/20 hover:bg-brand-orange/5 transition-all duration-300">
                  <div className="p-3 bg-brand-orange/10 rounded-xl text-brand-orange shrink-0">
                    <Zap size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">Expert Insights</h4>
                    <p className="text-sm text-gray-500 mt-0.5">Learn from industry veterans.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <a 
                  href="/speakers" 
                  className="group inline-flex items-center gap-3 bg-brand-black text-white px-8 py-4 rounded-full font-bold hover:bg-gradient-to-r hover:from-brand-red hover:to-brand-orange transition-all duration-300 shadow-xl shadow-gray-200 hover:shadow-brand-red/25"
                >
                  Meet Our Speakers
                  <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
