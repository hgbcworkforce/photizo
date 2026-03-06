type Props = {
  tag: string;
  title: string;
  description: string;
};

export default function SectionHero({ tag, title, description }: Props) {
  return (
    <section
      className="relative bg-cover bg-center text-white py-20 pt-32"
      style={{
        backgroundImage:
          "url('https://media.hgbcinfluencers.org/bisum/section_banner.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/20 opacity-75"></div>{" "}
      {/* Overlay */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-xl md:text-2xl text-orange-400 font-semibold mb-2 uppercase">
          {tag}
        </h3>
        <h1 className="text-2xl md:text-5xl font-extrabold mb-6">{title}</h1>
        <p className="text-lg md:text-xl text-blue-100 mb-8">{description}</p>
      </div>
    </section>
  );
}
