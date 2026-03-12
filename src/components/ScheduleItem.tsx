import { Clock, MapPin, User, ChevronRight } from "lucide-react";
import type { Sessions } from "../data/schedule";

interface ScheduleItemProps {
  session: Sessions;
  compact?: boolean;
}

const ScheduleItem = ({ session, compact }: ScheduleItemProps) => {
  // Simple time formatter
  const formatTime = (time: string) => {
    if (!time) return "";
    return new Date(`2025-01-01 ${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Modern type-based color mapping
  const typeStyles: Record<string, string> = {
    keynote: "bg-blue-50 text-blue-700 border-blue-100",
    story: "bg-emerald-50 text-emerald-700 border-emerald-100",
    panel: "bg-amber-50 text-amber-700 border-amber-100",
    default: "bg-slate-50 text-slate-700 border-slate-100",
  };

  const currentStyle = typeStyles[session.type] || typeStyles.default;

  return (
    <div className="group bg-white rounded-[24px] border border-gray-100 p-5 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:border-blue-500/20 h-full flex flex-col justify-between">
      <div>
        {/* Header: Time & Type */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-brand-red font-bold text-[11px] uppercase tracking-wider">
            <Clock size={14} strokeWidth={2.5} />
            <span>{formatTime(session.time)} — {formatTime(session.endTime)}</span>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-extrabold uppercase tracking-tight ${currentStyle}`}>
            {session.type}
          </span>
        </div>

        {/* Title */}
        <h3 className={`font-bold text-gray-900 leading-tight mb-4 group-hover:text-blue-600 transition-colors ${compact ? 'text-lg line-clamp-2' : 'text-xl'}`}>
          {session.title}
        </h3>

        {/* Speaker Row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative shrink-0">
            {session.speaker?.avatar ? (
              <img
                src={session.speaker.avatar}
                alt={session.speaker.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-50"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <User size={18} />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-800 truncate">{session.speaker?.name}</p>
            <p className="text-[11px] text-gray-400 font-medium truncate uppercase tracking-tighter">
              {session.speaker?.title}
            </p>
          </div>
        </div>
      </div>

      {/* Footer: Venue & Action */}
      <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-gray-400">
          <MapPin size={14} />
          <span className="text-xs font-medium truncate max-w-[120px]">{session.venue || "Main Hall"}</span>
        </div>
        
        <button className="flex items-center gap-1 text-[11px] font-bold text-brand-red opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
          DETAILS <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default ScheduleItem;
