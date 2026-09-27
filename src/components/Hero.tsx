import { useState, useEffect } from "react";
import { ArrowRight, MapPin, Calendar } from "lucide-react";

const slideImages = [
  "/slides/slide-1.jpeg",
  "/slides/slide-2.webp",
  "/slides/slide-3.webp",
  "/slides/slide-4.webp",
];

export default function Hero() {
  const conferenceDate = new Date("May 21, 2026 17:00:00").getTime();
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [currentSlide, setCurrentSlide] = useState(0);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const distance = conferenceDate - now;
      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / 86400000),
          hours: Math.floor((distance % 86400000) / 3600000),
          minutes: Math.floor((distance % 3600000) / 60000),
          seconds: Math.floor((distance % 60000) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [conferenceDate]);

  // Smooth background slider effect
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-brand-black text-white"
    >
      {/* ── Atmospheric glows using Brand Palette ── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-brand-red/25 rounded-full blur-[140px] animate-pulse-glow" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-brand-orange/25 rounded-full blur-[130px]" />
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-yellow/10 rounded-full blur-[160px]" />
      </div>

      {/* ── Subtle Geometric Grid Texture ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* ── Background Hero Image Smooth Slider ── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {slideImages.map((imageSrc, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={imageSrc}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? "opacity-35 z-[1]" : "opacity-0 z-0 pointer-events-none"
                }`}
            >
              <img
                src={imageSrc}
                alt=""
                className={`h-full w-full object-cover transition-transform duration-[6000ms] ease-out ${isActive ? "scale-105" : "scale-100"
                  }`}
              />
            </div>
          );
        })}
        {/* Film Gradient Overlay */}
      </div>

      {/* ══════════════════════════════════════
          MAIN HERO CONTENT
      ══════════════════════════════════════ */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-36 md:pt-40 pb-20">

        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-brand-red/40 bg-brand-red/10 px-4 py-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(239,64,35,0.2)]">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-white">
            Photizo 2026
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-black leading-[0.85] tracking-tight text-white select-none drop-shadow-2xl"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(76px, 12vw, 150px)",
          }}
        >
          EMERGE
          <span className="text-brand-orange" style={{ WebkitTextStroke: "2px rgba(245,131,32,0.6)" }}>
            .
          </span>
        </h1>

        {/* Subtitle row */}
        <div className="mt-6 flex flex-wrap items-start gap-12">
          <p className="max-w-xl text-lg md:text-xl font-normal leading-relaxed text-gray-300">
            An atmosphere of{" "}
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-yellow">
              radical transformation
            </span>
            .<br />
            Join visionary leaders and discover the insights that will shape your next decade.
          </p>
        </div>

        {/* ── Countdown & Info Row ── */}
        <div className="mt-5 md:mt-12 flex flex-col justify-between gap-10 pt-8">

          {/* Conference Date & Location Info Box */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 max-w-[660px]  bg-white/5 border border-white/10 backdrop-blur-sm p-4 shadow-lg text-center rounded-2xl px-6 py-4 mb-8 text-sm">
            <div className="flex items-center space-x-2.5 text-slate-200">
              <Calendar className="w-4 h-4 text-brand-orange flex-shrink-0" />
              <span className="font-semibold">May 21st – 23rd, 2026</span>
            </div>
            <div className="hidden sm:block text-slate-700">|</div>
            <div className="flex items-center space-x-0 md:space-x-2.5 text-slate-300 text-center sm:text-left">
              <MapPin className="w-4 h-4 text-brand-red flex-shrink-0" />
              <span className="font-semibold">Higher Ground Baptist Church Ogbomoso, Nigeria.</span>
            </div>
          </div>


          {/* Countdown timer */}
          <div>
            <div className="flex items-center gap-2 sm:gap-3">
              {[
                { v: countdown.days, l: "Days" },
                { v: countdown.hours, l: "Hours" },
                { v: countdown.minutes, l: "Mins" },
                { v: countdown.seconds, l: "Secs" },
              ].map(({ v, l }, i) => (
                <div key={l} className="flex items-center">
                  <div className="flex flex-col items-center justify-center bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl px-3.5 py-2.5 sm:px-5 sm:py-3.5 min-w-[48px] sm:min-w-[84px] shadow-lg">
                    <span
                      className="tabular-nums font-black leading-none text-white"
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "clamp(28px, 5vw, 28px)",
                      }}
                    >
                      {pad(v)}
                    </span>
                    <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                      {l}
                    </span>
                  </div>
                  {i < 3 && (
                    <span className="px-1.5 sm:px-2 text-xl font-bold text-brand-orange/60">
                      :
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>


        </div>

        {/* ── CTA Row & Slide Indicators ── */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-5">
          <div className="flex flex-wrap items-center gap-4 sm:gap-5">
            {/* Primary CTA button */}
            <a
              href="/register"
              className="group flex items-center gap-3 rounded-full bg-gradient-to-r from-brand-red to-brand-orange px-9 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-[0_0_30px_rgba(239,64,35,0.4)] hover:shadow-[0_0_45px_rgba(239,64,35,0.6)] active:translate-y-0 transition-all duration-300"
            >
              Secure Your Seat
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </a>

            {/* Secondary button */}
            <a
              href="/merchandise"
              className="rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-8 py-4 text-sm font-bold tracking-wider text-white hover:bg-white/20 hover:border-white/30 active:scale-[0.98] transition-all duration-300"
            >
              Purchase Merchnadise
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}