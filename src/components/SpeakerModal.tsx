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
        className="absolute inset-0 bg-brand-black/70 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-[32px] sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 border border-gray-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-2.5 bg-gray-100 hover:bg-brand-red hover:text-white rounded-full transition-all text-gray-500 hover:scale-105 shadow-sm"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="overflow-y-auto">
          {/* Header Section */}
          <div className="p-8 lg:p-12 pb-8 border-b border-gray-100 flex flex-col md:flex-row gap-8 lg:gap-10 items-start bg-gradient-to-b from-gray-50/80 to-white">
            <div className="relative shrink-0">
              <div className="w-32 h-32 md:w-44 md:h-44 rounded-3xl overflow-hidden ring-4 ring-white shadow-xl bg-gray-100">
                <img src={speaker.image} alt={speaker.name} className="w-full h-full object-cover" />
              </div>
              {speaker.featured && (
                <div className="absolute -bottom-2.5 -right-2.5 bg-gradient-to-r from-brand-red to-brand-orange text-white px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-md shadow-brand-red/30">
                  Featured
                </div>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                  {speaker.name}
                </h2>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                  <p className="text-lg md:text-xl text-brand-red font-bold">{speaker.title}</p>
                  <span className="text-gray-300 hidden md:block">•</span>
                  <p className="text-lg md:text-xl text-gray-600 font-medium">{speaker.company}</p>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { icon: <Linkedin size={16} />, link: speaker.social?.linkedin, label: "LinkedIn" },
                  { icon: <Twitter size={16} />, link: speaker.social?.twitter, label: "Twitter" },
                  { icon: <Globe size={16} />, link: speaker.social?.website, label: "Website" }
                ].map((social, i) => social.link && (
                  <a 
                    key={i} 
                    href={social.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:border-brand-red/30 hover:bg-brand-red/5 text-gray-700 hover:text-brand-red transition-all text-xs font-bold"
                  >
                    {social.icon} <span>{social.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-8 lg:p-12 pt-8 grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
            
            {/* Left: Bio & Quote (Main Content) */}
            <div className="lg:col-span-2 space-y-8">
              <section>
                <div className="flex items-center gap-2 text-brand-red mb-3">
                  <User size={18} />
                  <h3 className="font-bold uppercase tracking-widest text-xs">Biography</h3>
                </div>
                <div className="text-gray-600 text-base md:text-lg leading-relaxed space-y-4 font-normal">
                  {speaker.bio.split("\n").map((p: string, i: number) => <p key={i}>{p}</p>)}
                </div>
              </section>

              {speaker.quote && (
                <div className="relative p-6 sm:p-8 bg-gradient-to-br from-brand-red/5 to-brand-orange/5 border border-brand-red/15 rounded-3xl overflow-hidden group">
                  <Quote size={60} className="absolute -top-2 -left-2 text-brand-red/10" />
                  <blockquote className="relative z-10 text-lg md:text-xl text-gray-800 italic font-medium leading-relaxed">
                    "{speaker.quote}"
                  </blockquote>
                </div>
              )}
            </div>

            {/* Right: Sidebar Info */}
            <div className="space-y-6">
              {/* Session Highlight */}
              {speaker.session && (
                <div className="bg-gradient-to-br from-brand-red to-brand-orange text-white p-6 rounded-3xl shadow-xl shadow-brand-red/20">
                  <div className="flex items-center gap-2 mb-3 opacity-90 uppercase tracking-widest text-[10px] font-bold">
                    <Calendar size={14} />
                    <span>On Stage</span>
                  </div>
                  <h4 className="text-xl font-bold mb-2 leading-tight">{speaker.session.title}</h4>
                  <p className="text-white/80 text-sm font-medium">{speaker.session.time} • {speaker.session.venue}</p>
                </div>
              )}

              {/* Expertise Tags */}
              {speaker.expertise?.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Lightbulb size={16} className="text-brand-orange" />
                    <h3 className="font-bold uppercase tracking-widest text-xs">Expertise</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {speaker.expertise.map((tag: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg text-xs font-bold uppercase tracking-wide">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience Info */}
              {speaker.experience && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Briefcase size={16} className="text-brand-red" />
                    <h3 className="font-bold uppercase tracking-widest text-xs">Experience</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed font-normal">{speaker.experience}</p>
                </div>
              )}
            </div>

          </div>

          {/* Footer */}
          <div className="px-8 lg:px-12 py-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
             <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest">EMERGE - Photizo'26</p>
             <button onClick={onClose} className="text-xs font-bold uppercase tracking-wider text-brand-red hover:text-brand-orange transition-colors">
               Return to Speakers
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakerModal;
