import { useState } from "react";
import { Search } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SectionHero from "../components/SectionHero";  
import SpeakerCard from "../components/SpearkerCard";
import SpeakerModal from "../components/SpeakerModal";
import type { Speaker } from "../data/speakers";
import { filterAndSearchSpeakers, speakerCategories, speakersData} from "../data/speakers";

export default function Speakers() {
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Use speakers data from external file
  const speakers = speakersData;
  const categories = speakerCategories;

  // Filter and search speakers using helper function
  const filteredSpeakers = filterAndSearchSpeakers(filterCategory, searchTerm);

  const handleSpeakerClick = (speaker: Speaker) => {
    setSelectedSpeaker(speaker);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedSpeaker(null), 300);
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
        tag="Speakers"
        title="Meet Our Speakers"
        description="Discover the inspiring individuals who will be sharing their expertise at Photizo'26"
      />

      {/* Speakers Content */}
      <main className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter and Search Controls */}
          <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center mb-10 gap-6">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2.5">
              {categories.map((category) => {
                const isActive = filterCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setFilterCategory(category)}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-brand-red to-brand-orange text-white shadow-md shadow-brand-red/25 scale-[1.02]"
                        : "bg-white text-gray-700 hover:text-brand-red hover:bg-brand-red/5 border border-gray-200/80 shadow-sm"
                    }`}
                  >
                    {category === "all"
                      ? "All Speakers"
                      : category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                );
              })}
            </div>

            {/* Search Bar */}
            <div className="relative w-full lg:w-96">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search speakers, topics, or companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl text-sm leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange shadow-sm transition-all text-gray-800"
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-8">
            <p className="text-sm font-semibold text-gray-500">
              Showing {filteredSpeakers.length} of {speakers.length} speakers
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>

          {/* Speakers Grid */}
          {filteredSpeakers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSpeakers.map((speaker) => (
                <SpeakerCard
                  key={speaker.id}
                  speaker={speaker}
                  onSpeakerClick={handleSpeakerClick}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-xl mx-auto p-8">
              <div className="w-16 h-16 rounded-2xl bg-brand-red/10 text-brand-red flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No speakers found
              </h3>
              <p className="text-gray-500 mb-6 text-sm">
                Try adjusting your search criteria or filter selection
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterCategory("all");
                }}
                className="bg-brand-black hover:bg-gradient-to-r hover:from-brand-red hover:to-brand-orange text-white px-7 py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Call to Action Banner */}
          <div className="mt-24 relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-red to-brand-orange p-8 md:p-14 text-center shadow-2xl shadow-brand-red/20">
            {/* Subtle background glow circle */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
                Don't Miss These Amazing Speakers
              </h2>
              <p className="text-base md:text-lg text-white/85 mb-8 font-normal leading-relaxed">
                Register now to secure your spot and learn from the best minds
                in technology
              </p>

              <a
                href="/register"
                className="inline-block bg-white text-brand-red hover:bg-gray-50 px-9 py-4 rounded-full text-base font-extrabold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                Register for BISUM 2025
              </a>
            </div>
          </div>
        </div>
      </main>
      
      {/* Speaker Modal */}
      <SpeakerModal
        speaker={selectedSpeaker}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
