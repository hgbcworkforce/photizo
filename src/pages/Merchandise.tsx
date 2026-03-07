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
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar onNavigate={scrollToSection} />

      <SectionHero
        tag="Merchandise"
        title="Official Merchandise"
        description="Check out our exclusive Photizo'26 merchandise and show your support for the event!"
      />

      {/* Merchandise Section */}
      <main className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden p-8">
            <div className="space-y-8">
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
                    className={`flex flex-col-reverse lg:flex-row items-center gap-8 py-0 lg:py-8 px-8 rounded-lg shadow-md overflow-hidden ${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    <div className="md:w-1/2 text-center md:text-left mb-20 lg:mb-0">
                      <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {product.description}
                      </p>
                      <p className="text-lg font-bold text-blue-700 mb-2">
                        {product.price}
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        {product.timeFrame}
                      </p>

                      {product.colors && product.colors.length > 0 && (
                        <div className="flex items-center space-x-2 mt-4">
                          <span className="text-gray-700 font-medium">
                            Color:
                          </span>
                          {product.colors.map((color) => (
                            <button
                              key={color.name}
                              className={`w-8 h-8 rounded-full border-2 ${
                                selectedColors[product.id] === color.name
                                  ? "border-blue-500"
                                  : "border-gray-300"
                              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                              style={{
                                backgroundColor: color.name
                                  .toLowerCase()
                                  .replace(" ", ""),
                              }}
                              title={color.name}
                              onClick={() =>
                                handleColorChange(product.id, color.name)
                              }
                            ></button>
                          ))}
                        </div>
                      )}
                      {/* THIS IS THE NEW CODE FOR THE ORDER NOW BUTTON */}
                      <Link
                        to={`/merchandisedetails/${product.id}`}
                        className="mt-6 inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors duration-300"
                      >
                        Order now
                      </Link>
                    </div>
                    <div className="md:w-1/2 flex justify-center">
                      <img
                        src={productImage}
                        alt={`${product.name} - ${selectedColors[product.id]}`}
                        className="max-w-xs h-auto rounded-lg shadow-md object-contain"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
