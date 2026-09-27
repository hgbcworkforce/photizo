import { useState, useEffect } from "react";
import { ArrowRight, MapPin, Calendar } from "lucide-react";
import hero from '/slides/slide-1.jpeg';

export default function Hero() {
  const conferenceDate = new Date("May 21, 2026 17:00:00").getTime();
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-brand-black text-white"
    >
      {/* ── Atmospheric glows using Brand Palette ── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-brand-red/15 rounded-full blur-[140px] animate-pulse-glow" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-brand-orange/15 rounded-full blur-[130px]" />
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

      {/* ── Background Hero Image with Film Overlay ── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={hero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-35 scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/75 to-brand-black/90" />
      </div>

      {/* ══════════════════════════════════════
          MAIN HERO CONTENT
      ══════════════════════════════════════ */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-36 md:pt-40 pb-20">

        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-brand-red/40 bg-brand-red/10 px-4 py-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(239,64,35,0.2)]">
          <span className="h-2 w-2 animate-ping rounded-full bg-brand-red" />
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
        <div className="mt-12 flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-t border-white/10 pt-10">
          
          {/* Countdown timer */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">
              Conference starts in
            </p>
            <div className="flex items-center gap-2 sm:gap-3">
              {[
                { v: countdown.days, l: "Days" },
                { v: countdown.hours, l: "Hours" },
                { v: countdown.minutes, l: "Mins" },
                { v: countdown.seconds, l: "Secs" },
              ].map(({ v, l }, i) => (
                <div key={l} className="flex items-center">
                  <div className="flex flex-col items-center justify-center bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl px-3.5 py-2.5 sm:px-5 sm:py-3.5 min-w-[68px] sm:min-w-[84px] shadow-lg">
                    <span
                      className="tabular-nums font-black leading-none text-white"
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "clamp(34px, 5vw, 48px)",
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

          {/* Date & Location Chips */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {[
              { icon: <Calendar size={16} className="text-brand-orange" />, label: "May 21st – 23rd, 2026" },
              { icon: <MapPin size={16} className="text-brand-red" />, label: "Ogbomoso, Nigeria" },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl text-sm font-semibold text-gray-200 shadow-sm"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/10 border border-white/10">
                  {icon}
                </span>
                {label}
              </div>
            ))}
          </div>

        </div>

        {/* ── CTA Row ── */}
        <div className="mt-10 flex flex-wrap items-center gap-4 sm:gap-5">
          {/* Primary CTA button */}
          <a
            href="/register"
            className="group flex items-center gap-3 rounded-full bg-gradient-to-r from-brand-red to-brand-orange px-9 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-[0_0_30px_rgba(239,64,35,0.4)] hover:shadow-[0_0_45px_rgba(239,64,35,0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          >
            Secure Your Seat
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
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
    </section>
  );
}