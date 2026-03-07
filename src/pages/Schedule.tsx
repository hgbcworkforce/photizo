import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SectionHero from "../components/SectionHero";
import { sessions } from "../data/schedule";
import {
  MapPin,
  Clock,
  AlertCircle,
} from "lucide-react";

const Schedule = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  // Grouping logic inside the component
  const days = ["Day 1", "Day 2", "Day 3"] as const;
  const dateMap: Record<string, string> = {
    "Day 1": "Thursday, MAY 21",
    "Day 2": "Friday, MAY 22",
    "Day 3": "Saturday, MAY 23",
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Navbar onNavigate={scrollToSection} />

      {/* Hero Header stays the same */}
      <SectionHero
        tag="Schedule"
        title="Event Schedule"
        description="Explore the full schedule of Photizo'26 and plan your experience with us"
      />

      {/* Main Schedule - This container width changes to fit 3 columns */}
      <section className="py-12 mt-10 relative z-20">
        <div className="max-w-[1440px] mx-auto px-6">
          {/* 3-Column Grid Partition */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {days.map((dayLabel) => (
              <div key={dayLabel} className="flex flex-col">
                {/* Partition Header */}
                <div className="mb-10">
                  <h2 className="inline-block bg-white border border-gray-100 px-6 py-2 rounded-2xl shadow-sm text-sm font-bold text-blue-600 uppercase tracking-tighter">
                    {dayLabel} — {dateMap[dayLabel]}
                  </h2>
                </div>

                {/* Vertical Timeline Wrapper - Simplified for 3-column view */}
                <div className="relative border-l-2 border-slate-100 ml-4 space-y-6 pb-10">
                  {sessions
                    .filter((s) => s.day === dayLabel)
                    .map((session, idx) => (
                      <div key={idx} className="relative pl-8 group">
                        {/* Timeline Dot */}
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full border-4 border-white bg-blue-500 shadow-sm group-hover:scale-125 transition-transform" />

                        {/* Compact Session Card */}
                        <div className="bg-white border border-gray-100 p-5 rounded-[24px] transition-all duration-300 hover:border-blue-500/20 hover:shadow-xl hover:shadow-blue-500/5">
                          <div className="flex flex-col gap-3">
                            {/* Time moved inside for comfort in narrow columns */}
                            <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase">
                              <Clock size={14} /> {session.time}
                            </div>

                            <h3 className="text-md font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                              {session.title}
                            </h3>

                            <div className="space-y-2">
                              <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                                <MapPin size={12} />
                                {session.venue}
                              </div>
                              {session.speaker && (
                                <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                                  <img
                                    src={session.speaker.avatar}
                                    alt=""
                                    className="w-6 h-6 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all"
                                  />
                                  <span className="text-[11px] font-bold text-gray-700">
                                    {session.speaker.name}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Schedule;
