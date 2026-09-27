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

  // Modern type-based color mapping utilizing brand palettes
  const typeStyles: Record<string, string> = {
    keynote: "bg-brand-red/10 text-brand-red border-brand-red/20",
    story: "bg-brand-orange/10 text-brand-orange border-brand-orange/20",
    panel: "bg-brand-yellow/15 text-yellow-800 border-brand-yellow/30",
    default: "bg-gray-100 text-gray-700 border-gray-200",
  };

  const currentStyle = typeStyles[session.type] || typeStyles.default;

  return (
    <div className="group bg-white rounded-3xl border border-gray-100 p-5 transition-all duration-300 hover:shadow-xl hover:shadow-brand-red/5 hover:border-brand-red/30 h-full flex flex-col justify-between">
      <div>
        {/* Header: Time & Type */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-brand-red font-bold text-xs uppercase tracking-wider">
            <Clock size={14} strokeWidth={2.5} />
            <span>{formatTime(session.time)} — {formatTime(session.endTime)}</span>
          </div>
          <span className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${currentStyle}`}>
            {session.type}
          </span>
        </div>

        {/* Title */}
        <h3 className={`font-bold text-gray-900 leading-snug mb-4 group-hover:text-brand-red transition-colors ${compact ? 'text-base line-clamp-2' : 'text-lg'}`}>
          {session.title}
        </h3>

        {/* Speaker Row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative shrink-0">
            {session.speaker?.avatar ? (
              <img
                src={session.speaker.avatar}
                alt={session.speaker.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-orange/20"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                <User size={18} />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-800 truncate">{session.speaker?.name}</p>
            <p className="text-[11px] text-gray-500 font-medium truncate uppercase tracking-tighter">
              {session.speaker?.title}
            </p>
          </div>
        </div>
      </div>

      {/* Footer: Venue & Action */}
      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-gray-500">
          <MapPin size={13} className="text-brand-red shrink-0" />
          <span className="text-xs font-medium truncate max-w-[130px]">{session.venue || "Main Hall"}</span>
        </div>
        
        <button className="flex items-center gap-1 text-xs font-bold text-brand-red opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 cursor-pointer">
          DETAILS <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default ScheduleItem;
