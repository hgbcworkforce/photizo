import { useState } from "react";
import { Linkedin, Twitter, Facebook, Instagram, ArrowRight, User } from "lucide-react";

export default function SpeakerCard({ speaker, onSpeakerClick }: { speaker: any, onSpeakerClick: (s: any) => void }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="group bg-white border border-gray-100 rounded-3xl transition-all duration-500 hover:border-blue-500/30 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] flex  flex-col lg:flex-row items-stretch overflow-hidden min-h-[220px]"
    >

              {/* Left Side: Large Edge-to-Edge Image */}
      <div className="h-[500px] md:h-[450px] lg:flex-1 relative overflow-hidden block">
        {imageError ? (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
            <User size={48} strokeWidth={1} />
          </div>
        ) : (
          <img
            src={speaker.image}
            alt={speaker.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
            onError={() => setImageError(true)}
          />
        )}
        {/* Subtle overlay to blend the edge */}
        <div className="absolute inset-0 bg-gradient-to-l from-white/20 to-transparent pointer-events-none" />
      </div>

      {/* Right Side: Speaker Details */}
      <div className="flex-[1.1] p-6 md:p-8 flex flex-col justify-center min-w-0">
        <div className="mb-4">
          <div className="inline-block bg-blue-50 text-blue-600 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-widest mb-3">
            {speaker.category || "Main Stage"}
          </div>
          <h3 
            className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors cursor-pointer leading-tight"
            onClick={() => onSpeakerClick(speaker)}
          >
            {speaker.name}
          </h3>
          <p className="text-base text-gray-500 leading-snug">
            {speaker.title} <span className="text-gray-300 mx-1">@</span> 
            <span className="text-gray-800 font-semibold">{speaker.company}</span>
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-2 mb-6">
          {speaker.social?.twitter && (
            <a href={speaker.social.twitter} target="_blank" className="p-2 rounded-xl text-gray-400 bg-gray-50 hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10 transition-all">
              <Twitter size={18} />
            </a>
          )}
          {speaker.social?.linkedin && (
            <a href={speaker.social.linkedin} target="_blank" className="p-2 rounded-xl text-gray-400 bg-gray-50 hover:text-[#0077B5] hover:bg-[#0077B5]/10 transition-all">
              <Linkedin size={18} />
            </a>
          )}
          {speaker.social?.facebook && (
            <a href={speaker.social.facebook} target="_blank" className="p-2 rounded-xl text-gray-400 bg-gray-50 hover:text-[#3b5998] hover:bg-[#3b5998]/10 transition-all">
              <Facebook size={18} />
            </a>
          )}
          {speaker.social?.instagram && (
            <a href={speaker.social.instagram} target="_blank" className="p-2 rounded-xl text-gray-400 bg-gray-50 hover:text-[#E1306C] hover:bg-[#E1306C]/10 transition-all">
              <Instagram size={18} />
            </a>
          )}
        </div>

        <button 
          onClick={() => onSpeakerClick(speaker)}
          className="flex items-center text-sm font-bold text-blue-600 group-hover:gap-2 transition-all"
        >
          View Profile
          <ArrowRight size={16} className="ml-1 opacity-0 group-hover:opacity-100 transition-all" />
        </button>
      </div>

    </div>
  );
}
