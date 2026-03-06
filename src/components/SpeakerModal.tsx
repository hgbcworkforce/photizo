import { useEffect } from "react";
import type { Speaker } from "../data/speakers";
import { 
  X, Linkedin, Twitter, Globe, User, 
  Lightbulb, Quote, Briefcase, Calendar 
} from "lucide-react";

const SpeakerModal = ({ speaker, isOpen, onClose }: { speaker: Speaker | null; isOpen: boolean; onClose: () => void }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !speaker) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl transition-opacity duration-500"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-all text-gray-500 hover:scale-110"
        >
          <X size={20} />
        </button>

        <div className="overflow-y-auto custom-scrollbar">
          {/* Header Section */}
          <div className="p-8 lg:p-12 pb-6 border-b border-gray-50 flex flex-col md:flex-row gap-10 items-start">
            <div className="relative shrink-0">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-[32px] overflow-hidden ring-8 ring-slate-50">
                <img src={speaker.image} alt={speaker.name} className="w-full h-full object-cover" />
              </div>
              {speaker.featured && (
                <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                  Featured
                </div>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
                  {speaker.name}
                </h2>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                  <p className="text-xl text-blue-600 font-semibold">{speaker.title}</p>
                  <span className="text-gray-300 hidden md:block">•</span>
                  <p className="text-xl text-gray-400 font-medium">{speaker.company}</p>
                </div>
              </div>

              {/* Social Links - Minimal Outlined */}
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: <Linkedin size={16} />, link: speaker.social?.linkedin, label: "LinkedIn" },
                  { icon: <Twitter size={16} />, link: speaker.social?.twitter, label: "Twitter" },
                  { icon: <Globe size={16} />, link: speaker.social?.website, label: "Website" }
                ].map((social, i) => social.link && (
                  <a key={i} href={social.link} target="_blank" className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all text-sm font-medium">
                    {social.icon} <span>{social.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-8 lg:p-12 pt-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left: Bio & Quote (Main Content) */}
            <div className="lg:col-span-2 space-y-10">
              <section>
                <div className="flex items-center gap-2 text-blue-600 mb-4">
                  <User size={20} />
                  <h3 className="font-bold uppercase tracking-widest text-xs">Biography</h3>
                </div>
                <div className="text-gray-600 text-lg leading-relaxed space-y-4 font-light">
                  {speaker.bio.split("\n").map((p: string, i: number) => <p key={i}>{p}</p>)}
                </div>
              </section>

              {speaker.quote && (
                <div className="relative p-8 bg-slate-50 rounded-[32px] overflow-hidden group">
                  <Quote size={80} className="absolute -top-4 -left-4 text-white group-hover:text-blue-100/50 transition-colors" />
                  <blockquote className="relative z-10 text-xl md:text-2xl text-slate-700 italic font-medium leading-relaxed">
                    "{speaker.quote}"
                  </blockquote>
                </div>
              )}
            </div>

            {/* Right: Sidebar Info */}
            <div className="space-y-8">
              {/* Session Highlight */}
              {speaker.session && (
                <div className="bg-blue-600 text-white p-6 rounded-[32px] shadow-xl shadow-blue-200">
                  <div className="flex items-center gap-2 mb-4 opacity-80 uppercase tracking-widest text-[10px] font-bold">
                    <Calendar size={14} />
                    <span>On Stage</span>
                  </div>
                  <h4 className="text-xl font-bold mb-2 leading-tight">{speaker.session.title}</h4>
                  <p className="text-blue-100 text-sm font-medium">{speaker.session.time} • {speaker.session.venue}</p>
                </div>
              )}

              {/* Expertise Tags */}
              {speaker.expertise?.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Lightbulb size={18} />
                    <h3 className="font-bold uppercase tracking-widest text-xs">Expertise</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {speaker.expertise.map((tag: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold uppercase tracking-wide">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience Info */}
              {speaker.experience && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Briefcase size={18} />
                    <h3 className="font-bold uppercase tracking-widest text-xs">Experience</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{speaker.experience}</p>
                </div>
              )}
            </div>

          </div>

          {/* Footer */}
          <div className="px-8 lg:px-12 py-8 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
             <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">EMERGE - Photizo'26</p>
             <button onClick={onClose} className="text-sm font-bold text-blue-600 hover:underline">Return to Speakers</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakerModal;
