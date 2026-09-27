import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SectionHero from "../components/SectionHero";
import { sessions } from "../data/schedule";
import {
  MapPin,
  Clock,
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
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar onNavigate={scrollToSection} />

      {/* Hero Header */}
      <SectionHero
        tag="Schedule"
        title="Event Schedule"
        description="Explore the full schedule of Photizo'26 and plan your experience with us"
      />

      {/* Main Schedule */}
      <section className="py-20 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 3-Column Grid Partition */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            {days.map((dayLabel) => (
              <div key={dayLabel} className="flex flex-col">
                {/* Partition Header */}
                <div className="mb-8">
                  <h2 className="inline-flex items-center gap-2 bg-white border border-gray-200/80 px-5 py-2.5 rounded-2xl shadow-sm text-xs font-black text-brand-red uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-brand-red" />
                    {dayLabel} — {dateMap[dayLabel]}
                  </h2>
                </div>

                {/* Vertical Timeline Wrapper */}
                <div className="relative border-l-2 border-gray-200/70 ml-4 space-y-6 pb-6">
                  {sessions
                    .filter((s) => s.day === dayLabel)
                    .map((session, idx) => (
                      <div key={idx} className="relative pl-7 group">
                        {/* Timeline Dot */}
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full border-2 border-white bg-brand-red shadow-sm group-hover:scale-125 group-hover:bg-brand-orange transition-all duration-200" />

                        {/* Compact Session Card */}
                        <div className="bg-white border border-gray-100 p-5 rounded-3xl transition-all duration-300 hover:border-brand-red/30 hover:shadow-xl hover:shadow-brand-red/5 hover:-translate-y-0.5">
                          <div className="flex flex-col gap-3">
                            {/* Time badge */}
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-red/10 text-brand-red text-xs font-bold uppercase tracking-wider w-fit">
                              <Clock size={13} strokeWidth={2.5} />
                              <span>{session.time}</span>
                            </div>

                            <h3 className="text-base font-bold text-gray-900 group-hover:text-brand-red transition-colors leading-snug">
                              {session.title}
                            </h3>

                            <div className="space-y-2 pt-2 border-t border-gray-100/70">
                              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                <MapPin size={13} className="text-brand-red shrink-0" />
                                <span>{session.venue}</span>
                              </div>
                              {session.speaker && (
                                <div className="flex items-center gap-2.5 pt-1">
                                  <img
                                    src={session.speaker.avatar}
                                    alt=""
                                    className="w-7 h-7 rounded-full object-cover ring-2 ring-brand-orange/20"
                                  />
                                  <span className="text-xs font-bold text-gray-800 truncate">
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
