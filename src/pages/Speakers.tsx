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
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar onNavigate={scrollToSection} />

      <SectionHero
        tag="Speakers"
        title="Meet Our Speakers"
        description="Discover the inspiring individuals who will be sharing their expertise at Photizo'26"
      />


    {/* Speakers Content */}
        <main className="py-20">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filter and Search Controls */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 space-y-6 lg:space-y-0">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setFilterCategory(category)}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                      filterCategory === category
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-white text-gray-700 hover:bg-blue-50 shadow-md hover:shadow-lg"
                    }`}
                  >
                    {category === "all"
                      ? "All Speakers"
                      : category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full lg:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search speakers, topics, or companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-8">
              <p className="text-gray-600">
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
              <div className="text-center py-20">
                <Search className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  No speakers found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or filter selection
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterCategory("all");
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Call to Action */}
            <div className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Don't Miss These Amazing Speakers
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Register now to secure your spot and learn from the best minds
                in technology
              </p>

              <a
                href="/register"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                Register for BISUM 2025
              </a>
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
