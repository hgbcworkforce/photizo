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
    "Day 1": "Thursday, Nov 13", 
    "Day 2": "Friday, Nov 14", 
    "Day 3": "Saturday, Nov 15" 
  };

  return (
    <div className="w-full overflow-x-auto pb-10">
      {/* 3-Column Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 min-w-[1000px] md:min-w-full px-2">
        
        {days.map((day) => (
          <div key={day} className="flex flex-col">
            
            {/* Day Header - Consistent with your snippet */}
            <div className="mb-10 text-center md:text-left">
              <h2 className="inline-block bg-white border border-gray-100 px-6 py-2 rounded-2xl shadow-sm text-sm font-bold text-blue-600 uppercase tracking-tighter">
                {day} — {dateMap[day] || "2025"}
              </h2>
            </div>

            {/* Vertical Timeline for this specific day */}
            <div className="relative border-l-2 border-slate-100 ml-4 space-y-6">
              {groupedSessions[day].map((session, idx) => (
                <div key={session.id || idx} className="relative pl-8 group">
                  
                  {/* Timeline Dot */}
                  <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full border-4 border-white bg-blue-500 shadow-sm group-hover:scale-125 transition-transform" />
                  
                  {/* Compact Schedule Item */}
                  <div className="bg-white border border-gray-100 p-4 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-blue-500 uppercase mb-2">
                      <Clock size={12} />
                      {session.time} - {session.endTime}
                    </div>
                    
                    <h4 className="text-sm font-bold text-gray-900 mb-2 leading-tight">
                      {session.title}
                    </h4>

                    {session.venue && (
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium italic">
                        <MapPin size={10} />
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
