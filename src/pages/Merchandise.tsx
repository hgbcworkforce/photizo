import { useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SectionHero from "../components/SectionHero";
import { merchandiseItems } from "../data/merchandise";

export default function Merchandise() {
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>(
    merchandiseItems.reduce((acc, item) => {
      acc[item.id] = item.colors[0].name; // Default to the first color
      return acc;
    }, {} as Record<string, string>),
  );

  const handleColorChange = (productId: string, colorName: string) => {
    setSelectedColors((prevColors) => ({
      ...prevColors,
      [productId]: colorName,
    }));
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Navbar */}
      <Navbar onNavigate={scrollToSection} />

      <SectionHero
        tag="Merchandise"
        title="Official Merchandise"
        description="Check out our exclusive Photizo'26 merchandise and show your support for the event!"
      />

      {/* Merchandise Section */}
      <main className="py-20 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {merchandiseItems.map((product, index) => {
              const selectedColor = product.colors.find(
                (color) => color.name === selectedColors[product.id],
              );
              const productImage = selectedColor
                ? selectedColor.image
                : product.colors[0].image;

              return (
                <div
                  key={product.id}
                  className={`flex flex-col-reverse lg:flex-row items-center gap-10 p-8 sm:p-12 rounded-3xl border border-gray-100/80 shadow-md transition-all duration-300 hover:shadow-xl hover:shadow-brand-orange/5 ${
                    index % 2 === 0 ? "bg-white" : "bg-gradient-to-br from-white to-gray-50/80"
                  }`}
                >
                  <div className="lg:w-1/2 text-center lg:text-left">
                    <h3 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-6 text-base leading-relaxed font-normal">
                      {product.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start mb-6">
                      <span className="text-2xl font-black text-brand-red">
                        {product.price}
                      </span>
                      <span className="inline-block px-3 py-1 bg-brand-orange/10 text-brand-orange rounded-full text-xs font-bold uppercase tracking-wider">
                        {product.timeFrame}
                      </span>
                    </div>

                    {product.colors && product.colors.length > 0 && (
                      <div className="flex items-center justify-center lg:justify-start space-x-3 mb-8">
                        <span className="text-gray-700 font-bold text-sm">
                          Color:
                        </span>
                        <div className="flex gap-2">
                          {product.colors.map((color) => {
                            const isSelected = selectedColors[product.id] === color.name;
                            return (
                              <button
                                key={color.name}
                                className={`w-8 h-8 rounded-full border-2 transition-all ${
                                  isSelected
                                    ? "border-brand-orange scale-110 shadow-md ring-2 ring-brand-orange/30"
                                    : "border-gray-200 hover:scale-105"
                                } focus:outline-none`}
                                style={{
                                  backgroundColor: color.name
                                    .toLowerCase()
                                    .replace(" ", ""),
                                }}
                                title={color.name}
                                onClick={() =>
                                  handleColorChange(product.id, color.name)
                                }
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <Link
                      to={`/merchandisedetails/${product.id}`}
                      className="inline-flex items-center justify-center bg-gradient-to-r from-brand-red to-brand-orange hover:from-brand-red/90 hover:to-brand-orange/90 text-white font-bold py-3.5 px-8 rounded-full shadow-lg shadow-brand-red/25 hover:shadow-xl hover:shadow-brand-red/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-sm uppercase tracking-wider"
                    >
                      Order now
                    </Link>
                  </div>

                  <div className="lg:w-1/2 flex justify-center">
                    <div className="relative group max-w-sm w-full aspect-square rounded-3xl overflow-hidden bg-gray-50 p-6 flex items-center justify-center border border-gray-100 shadow-inner">
                      <img
                        src={productImage}
                        alt={`${product.name} - ${selectedColors[product.id]}`}
                        className="max-h-[320px] w-auto rounded-2xl object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
