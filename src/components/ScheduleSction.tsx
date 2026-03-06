import { Link } from 'react-router-dom';
import { Clock, MapPin, ArrowRight, Zap } from 'lucide-react';

const ScheduleSection = ({ sessions }: { sessions: any[] }) => {
  // Take only the first 4 sessions for the homepage teaser
  const featuredSessions = sessions.slice(0, 4);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50" />
      
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
              <Zap size={12} className="fill-current" />
              <span>Happening Soon</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
              Don’t Miss the <span className="text-blue-600">Highlights</span>
            </h2>
          </div>

          <Link 
            to="/schedule" 
            className="group flex items-center gap-3 text-sm font-bold text-gray-900 border-b-2 border-blue-600 pb-1 transition-all hover:text-blue-600"
          >
            View Full Schedule
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 4-Card Horizontal Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredSessions.map((session, idx) => (
            <div 
              key={session.id || idx}
              className="group bg-slate-50 rounded-[32px] p-6 border border-transparent hover:border-blue-500/20 hover:bg-white hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-500 flex flex-col justify-between h-[280px]"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-blue-600 font-bold text-[11px] uppercase tracking-wider">
                    <Clock size={14} strokeWidth={2.5} />
                    <span>{session.time}</span>
                  </div>
                  {/* "Live" Indicator for the very first card */}
                  {idx === 0 && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-4 group-hover:text-blue-600 transition-colors line-clamp-3">
                  {session.title}
                </h3>
              </div>

              <div className="space-y-4">
                {session.speaker && (
                  <div className="flex items-center gap-3">
                    <img 
                      src={session.speaker.image} 
                      alt="" 
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-white" 
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate">{session.speaker.name}</p>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter truncate">
                        {session.speaker.title}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-1.5 text-gray-400 pt-3 border-t border-gray-100/50">
                  <MapPin size={12} />
                  <span className="text-[11px] font-medium uppercase tracking-wide">{session.venue || "Main Hall"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View Mobile All Button (Only visible on small screens) */}
        <div className="mt-10 md:hidden">
          <Link 
            to="/schedule" 
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2"
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
