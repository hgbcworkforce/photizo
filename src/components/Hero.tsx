import { useState, useEffect } from "react";
import { ArrowRight, MapPin, Calendar } from "lucide-react";
import hero from '/hero/hero-1.jpeg';

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

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#050505]"
    >
      {/* ── Atmospheric glows ── */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_30%_60%,rgba(220,38,38,0.18)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_75%_30%,rgba(251,146,60,0.10)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_100%,rgba(220,38,38,0.08)_0%,transparent_60%)]" />
      </div>

      {/* ── Subtle grid texture ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Hero image ── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={hero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
      </div>

      {/* ── Decorative right-edge line ── */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-0 w-px bg-gradient-to-b from-transparent via-red-700/0 to-transparent" />

      {/* ══════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════ */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-32 md:pt-28 pb-16">

        {/* Badge */}
        <div className="mb-6 inline-flex animate-fade-up items-center gap-2 rounded-full border border-brand-red px-4 py-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-red" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-red">
            Photizo 2026 
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-black leading-[0.88] tracking-tight text-white"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(70px, 10vw, 120px)",
          }}
        >
          EMERGE
          <span style={{ WebkitTextFillColor: "transparent", WebkitTextStroke: "2px rgba(255,255,255,0.12)" }}>
            .
          </span>
        </h1>

        {/* Subtitle row */}
        <div className="mt-6 flex flex-wrap items-start gap-12">
          <p className="max-w-md text-[17px] font-light leading-relaxed text-white/60">
            An atmosphere of{" "}
            <span className="font-medium text-white">radical transformation</span>.<br/>
            Join visionary leaders and discover the insights that will shape your next decade.
          </p>
        </div>

        {/* ── Countdown ── */}
        <div className="mt-10 flex flex-wrap items-end gap-12">
           <div className="border-t border-white/7 pt-8">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-red">
            Conference starts in
          </p>
          <div className="flex items-end gap-0">
            {[
              { v: countdown.days, l: "Days" },
              { v: countdown.hours, l: "Hours" },
              { v: countdown.minutes, l: "Mins" },
              { v: countdown.seconds, l: "Secs" },
            ].map(({ v, l }, i) => (
              <div key={l} className="flex items-end">
                <div className="flex flex-col items-start pr-4">
                  <span
                    className="tabular-nums leading-none text-white"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "clamp(38px, 6vw, 56px)",
                    }}
                  >
                    {pad(v)}
                  </span>
                  <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25">
                    {l}
                  </span>
                </div>
                {i < 3 && (
                  <span
                    className="mb-3 pr-4 text-white/10"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(28px,4vw,40px)" }}
                  >
                    :
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-1">
            {[
              { icon: <Calendar size={13} className="text-brand-red" />, label: "May 21st – 23rd, 2026" },
              { icon: <MapPin size={13} className="text-brand-red" />, label: "Ogbomoso, Nigeria" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-3 text-[13px] text-brand-red">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/8 bg-white/5">
                  {icon}
                </span>
                {label}
              </div>
            ))}
          </div>
        </div>
       

        {/* CTA row */}
        <div className="mt-8 flex flex-wrap items-center gap-5">
          {/* Primary button */}
          <a
            href="/register"
            className="group flex items-center gap-2.5 rounded-2xl bg-red-600 px-10 py-4 text-[13px] font-bold uppercase tracking-widest text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-500"
            style={{ boxShadow: "0 0 40px rgba(220,38,38,0.35)" }}
          >
            Secure Your Seat
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </a>

          {/* Secondary button */}
          <a
            href="/merchandise"
            className="rounded-2xl border border-white/12 bg-white/5 px-8 py-4 text-[13px] font-medium text-white/80 transition-all duration-200 hover:border-white/25 hover:bg-white/10"
          >
            Purchase Merchnadise
          </a>
        </div>

        
      </div>
    </section>
  );
}