import Footer from "../components/Footer";
import Hero from "../components/Hero";
import MerchandiseSection from "../components/MerchandiseSection";
import Navbar from "../components/Navbar";
import SpeakersSectionSlide from "../components/SpeakersSectionSlide";
import { speakersData } from "../data/speakers";
import {merchandiseItems} from "../data/merchandise";
import { sessions } from "../data/schedule";
import ScheduleSection from "../components/ScheduleSction";
import AboutSection from "../components/AboutSection";


export default function Home() {

    const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

    return(
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <Navbar onNavigate={scrollToSection}  />

            {/* Hero Section */}
            <Hero />

            {/* About Section */}
            <AboutSection />


            {/* Schedule Section */}
            <ScheduleSection sessions={sessions} />

            {/* Speakers Section */}
            <SpeakersSectionSlide speakers={speakersData} />
           

            {/* Merchandise Section */}

            <MerchandiseSection items={merchandiseItems} />

            {/* Footer */}
            <Footer />
        </div>
    )
}