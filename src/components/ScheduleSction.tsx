import { Link } from 'react-router-dom';
import { Clock, MapPin, ArrowRight, Zap } from 'lucide-react';

const ScheduleSection = ({ sessions }: { sessions: any[] }) => {
  // Take only the first 4 sessions for the homepage teaser
  const featuredSessions = sessions.slice(0, 4);

  return (
    <section className="py-28 bg-[#fbfbfb] relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs font-bold uppercase tracking-[0.2em] mb-4">
              <Zap size={13} className="fill-current" />
              <span>Happening Soon</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
              Don’t Miss the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-brand-orange">Highlights</span>
            </h2>
          </div>

          <Link 
            to="/schedule" 
            className="group inline-flex items-center gap-2.5 text-sm font-bold text-gray-900 hover:text-brand-red transition-all pb-1 border-b-2 border-brand-red/30 hover:border-brand-red w-fit"
          >
            View Full Schedule
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 4-Card Horizontal Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredSessions.map((session, idx) => (
            <div 
              key={session.id || idx}
              className="group bg-white rounded-3xl p-6 border border-gray-100/90 shadow-sm hover:border-brand-red/30 hover:shadow-xl hover:shadow-brand-red/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-[300px]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-red/10 text-brand-red font-bold text-xs uppercase tracking-wider">
                    <Clock size={13} strokeWidth={2.5} />
                    <span>{session.time}</span>
                  </div>
                  {/* "Live" Indicator for the very first card */}
                  {idx === 0 && (
                    <span className="flex h-2.5 w-2.5 relative" title="Featured Session">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-red"></span>
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 leading-snug mb-4 group-hover:text-brand-red transition-colors line-clamp-3">
                  {session.title}
                </h3>
              </div>

              <div className="space-y-3.5 pt-4 border-t border-gray-100">
                {session.speaker && (
                  <div className="flex items-center gap-3">
                    <img 
                      src={session.speaker.image} 
                      alt="" 
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-brand-orange/20" 
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-900 truncate">{session.speaker.name}</p>
                      <p className="text-[11px] text-gray-500 font-medium uppercase tracking-tighter truncate">
                        {session.speaker.title}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                  <MapPin size={13} className="text-brand-red shrink-0" />
                  <span className="font-medium truncate">{session.venue || "Main Hall"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View All Button (Only visible on small screens) */}
        <div className="mt-8 md:hidden">
          <Link 
            to="/schedule" 
            className="w-full py-4 bg-brand-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
          >
            Full Agenda
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default ScheduleSection;
