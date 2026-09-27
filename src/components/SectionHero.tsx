type Props = {
  tag: string;
  title: string;
  description: string;
};

export default function SectionHero({ tag, title, description }: Props) {
  return (
    <section
      className="relative bg-brand-black text-white py-24 pt-36 overflow-hidden"
    >
      {/* Ambient Brand Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 left-1/3 w-[500px] h-[350px] bg-brand-red/15 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[300px] bg-brand-orange/15 rounded-full blur-[120px]" />
      </div>

      {/* Subtle Grid */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange font-bold text-xs uppercase tracking-[0.25em] mb-4">
          {tag}
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight mb-4 text-white leading-tight">
          {title}
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-normal leading-relaxed">
          {description}
        </p>
      </div>
    </section>
  );
}
