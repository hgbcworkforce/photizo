import { useState } from "react";
import { Linkedin, Twitter, Facebook, Instagram, ArrowRight, User } from "lucide-react";

export default function SpeakerCard({ speaker, onSpeakerClick }: { speaker: any, onSpeakerClick: (s: any) => void }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="group bg-white border border-gray-100 rounded-3xl transition-all duration-500 hover:border-brand-red/40 hover:shadow-[0_20px_45px_rgba(239,64,35,0.08)] hover:-translate-y-1 flex flex-col lg:flex-row items-stretch overflow-hidden min-h-[220px]"
    >
      {/* Left Side: Large Edge-to-Edge Image */}
      <div className="h-[420px] sm:h-[460px] lg:h-auto lg:w-[45%] relative overflow-hidden bg-gray-100 shrink-0">
        {imageError ? (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
            <User size={48} strokeWidth={1} />
          </div>
        ) : (
          <img
            src={speaker.image}
            alt={speaker.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={() => setImageError(true)}
          />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-brand-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
      </div>

      {/* Right Side: Speaker Details */}
      <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between min-w-0 bg-white">
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {(speaker.category && Array.isArray(speaker.category) ? speaker.category : [speaker.category || "Main Stage"]).map((cat: string, index: number) => (
              <div key={index} className="inline-block bg-brand-red/10 border border-brand-red/20 text-brand-red text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {cat}
              </div>
            ))}
          </div>
          
          <h3 
            className="text-2xl font-extrabold text-gray-900 mb-1.5 group-hover:text-brand-red transition-colors cursor-pointer leading-tight tracking-tight"
            onClick={() => onSpeakerClick(speaker)}
          >
            {speaker.name}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 leading-snug font-normal">
            {speaker.title} <span className="text-gray-400 mx-1">@</span> 
            <span className="text-gray-900 font-semibold">{speaker.company}</span>
          </p>
        </div>

        <div className="pt-6 mt-4 border-t border-gray-100 flex items-center justify-between gap-4">
          {/* Social Icons */}
          <div className="flex items-center gap-1.5">
            {speaker.social?.twitter && (
              <a href={speaker.social.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl text-gray-400 bg-gray-50 hover:text-brand-orange hover:bg-brand-orange/10 transition-all">
                <Twitter size={16} />
              </a>
            )}
            {speaker.social?.linkedin && (
              <a href={speaker.social.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl text-gray-400 bg-gray-50 hover:text-brand-orange hover:bg-brand-orange/10 transition-all">
                <Linkedin size={16} />
              </a>
            )}
            {speaker.social?.facebook && (
              <a href={speaker.social.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl text-gray-400 bg-gray-50 hover:text-brand-orange hover:bg-brand-orange/10 transition-all">
                <Facebook size={16} />
              </a>
            )}
            {speaker.social?.instagram && (
              <a href={speaker.social.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl text-gray-400 bg-gray-50 hover:text-brand-red hover:bg-brand-red/10 transition-all">
                <Instagram size={16} />
              </a>
            )}
          </div>

          <button 
            onClick={() => onSpeakerClick(speaker)}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-red hover:text-brand-orange transition-colors cursor-pointer"
          >
            View Profile
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

    </div>
  );
}
