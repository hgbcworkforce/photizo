import { Clock, MapPin } from "lucide-react";
import type { Sessions } from "../data/schedule";

interface ScheduleListProps {
  sessions: Sessions[];
}

const ScheduleList = ({ sessions }: ScheduleListProps) => {
  // Group sessions by day
  const groupedSessions = sessions.reduce((acc: Record<string, Sessions[]>, session: Sessions) => {
    const day = session.day || "Day 1";
    if (!acc[day]) acc[day] = [];
    acc[day].push(session);
    return acc;
  }, {});

  const days = Object.keys(groupedSessions);
  const dateMap: Record<string, string> = { 
   "Day 1": "Thursday, MAY 21",
    "Day 2": "Friday, MAY 22",
    "Day 3": "Saturday, MAY 23",
  };

  return (
    <div className="w-full overflow-x-auto pb-10">
      {/* 3-Column Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 min-w-[1000px] md:min-w-full px-2">
        
        {days.map((day) => (
          <div key={day} className="flex flex-col">
            
            {/* Day Header */}
            <div className="mb-8 text-center md:text-left">
              <h2 className="inline-flex items-center gap-2 bg-white border border-gray-200 px-5 py-2.5 rounded-2xl shadow-sm text-xs font-bold text-brand-red uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-brand-red" />
                {day} — {dateMap[day] || "2025"}
              </h2>
            </div>

            {/* Vertical Timeline for this specific day */}
            <div className="relative border-l-2 border-gray-200 ml-4 space-y-6">
              {groupedSessions[day].map((session, idx) => (
                <div key={session.id || idx} className="relative pl-7 group">
                  
                  {/* Timeline Dot */}
                  <div className="absolute -left-[9px] top-5 w-4 h-4 rounded-full border-2 border-white bg-brand-red shadow-sm group-hover:scale-125 group-hover:bg-brand-orange transition-all" />
                  
                  {/* Compact Schedule Item */}
                  <div className="bg-white border border-gray-100 p-5 rounded-2xl hover:border-brand-red/30 hover:shadow-lg hover:shadow-brand-red/5 transition-all">
                    <div className="flex items-center gap-2 text-xs font-bold text-brand-red uppercase mb-2">
                      <Clock size={13} />
                      {session.time} - {session.endTime}
                    </div>
                    
                    <h4 className="text-sm font-bold text-gray-900 mb-2 leading-snug">
                      {session.title}
                    </h4>

                    {session.venue && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                        <MapPin size={12} className="text-brand-red shrink-0" />
                        {session.venue}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default ScheduleList;
