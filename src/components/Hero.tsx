import { useState, useEffect } from "react";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

export default function Hero() {
  const conferenceDate = new Date("May 21, 2026 17:00:00").getTime();
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = conferenceDate - now;
      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [conferenceDate]);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-black">
      {/* Background with subtle zoom animation */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://media.hgbcinfluencers.org/bisum/hero.jpg" 
          className="w-full h-full object-cover opacity-50 scale-105 animate-slow-zoom"
          alt="Hero Background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          
          {/* Main Brand Side */}
          <div className="lg:col-span-8">
            <div className="space-y-4 mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-sm font-bold tracking-[0.2em] uppercase backdrop-blur-md">
                {/* <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span> */}
                Photizo 2026
              </span>
              
              <h1 className="text-7xl md:text-9xl lg:text-[12rem] font-black text-white leading-[0.8] tracking-tighter">
                EMERGE
              </h1>
              
              <p className="max-w-xl text-lg md:text-xl text-gray-300 font-light leading-relaxed pt-4">
                Step into an atmosphere of <span className="text-white font-medium">transformation</span>. 
                Meet global leaders and gain the insights needed to navigate your future.
              </p>
            </div>

            <div className="flex flex-wrap gap-6 items-center">
              <a href="/register" className="group relative px-10 py-5 bg-blue-600 text-white font-bold rounded-2xl overflow-hidden transition-all hover:bg-blue-700 hover:shadow-[0_0_40px_rgba(37,99,235,0.4)]">
                <span className="relative z-10 flex items-center gap-2">
                  SECURE YOUR SEAT <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
              
              <div className="flex flex-col text-sm text-gray-400 space-y-1">
                <div className="flex items-center gap-2"><MapPin size={14} className="text-blue-500" /> Ogbomoso, Nigeria</div>
                <div className="flex items-center gap-2"><Calendar size={14} className="text-blue-500" /> May 21st - 23rd, 2026</div>
              </div>
            </div>
          </div>

          {/* Countdown Side (Glassmorphism) */}
          <div className="lg:col-span-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 lg:p-10 shadow-2xl">
              <p className="text-center text-xs font-bold tracking-widest text-blue-400 uppercase mb-8">Conference Starts In</p>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { v: countdown.days, l: "DAYS" },
                  { v: countdown.hours, l: "HOURS" },
                  { v: countdown.minutes, l: "MINS" },
                  { v: countdown.seconds, l: "SECS" }
                ].map((unit, i) => (
                  <div key={i} className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
                    <div className="text-3xl md:text-4xl font-black text-white tabular-nums">
                      {unit.v.toString().padStart(2, "0")}
                    </div>
                    <div className="text-[10px] font-bold text-gray-500 mt-1">{unit.l}</div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-white/10 text-center">
                <p className="text-gray-400 text-sm italic">"The light shines in darkness..."</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Decorative vertical text for extra "Design" feel */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden xl:block">
        <p className="rotate-90 origin-center text-[100px] font-black text-white/[0.03] select-none uppercase tracking-tighter">
          Transformation
        </p>
      </div>
    </section>
  );
}
