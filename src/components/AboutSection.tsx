import { ArrowRight, Target, Zap } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Visual Side (Left on desktop to break the pattern) */}
          <div className="lg:col-span-6 relative">
            {/* Background Decorative Element */}
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            
            {/* Main Image with custom frame */}
            <div className="relative z-10">
              <img
                src="https://media.hgbcinfluencers.org/bisum/about_image-p.png"
                alt="Bisum'25 banner"
                className="rounded-[2rem] shadow-2xl w-full object-cover aspect-[4/5] lg:h-[650px] border-8 border-white"
              />
              
              {/* Floating Stat Card */}
              <div className="absolute -bottom-6 -right-6 md:right-10 bg-blue-600 p-8 rounded-2xl shadow-xl text-white max-w-[200px] hidden md:block">
                <p className="text-4xl font-bold mb-1 underline decoration-blue-300 underline-offset-4">2026</p>
                <p className="text-sm font-medium opacity-90 uppercase tracking-wider leading-tight">The Future of Leadership & Investment</p>
              </div>
            </div>
          </div>

          {/* Text Content Side */}
          <div className="lg:col-span-6">
            <div className="space-y-8">
              <div>
                <span className="inline-block py-1 px-4 rounded-full bg-blue-50 text-blue-600 text-sm font-bold uppercase tracking-widest mb-4">
                  The Experience
                </span>
                <h2 className="text-4xl lg:text-6xl font-black text-gray-900 leading-tight">
                  About <span className="text-blue-600">Photizo</span> <br />
                </h2>
              </div>

              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  The BISUM Conference is a transformative event designed to empower 
                  <span className="text-gray-900 font-semibold"> students and young professionals</span> with the knowledge, 
                  skills, and mindset needed to excel in business and leadership.
                </p>
                
                <p>
                  Through engaging sessions and expert insights, we inspire participants 
                  to think beyond academics and embrace actionable innovation.
                </p>
              </div>

              {/* Icon Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                    <Target size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Purpose Driven</h4>
                    <p className="text-sm text-gray-500">Building impact-focused futures.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Expert Insights</h4>
                    <p className="text-sm text-gray-500">Learn from industry veterans.</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <a 
                  href="/speakers" 
                  className="inline-flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all group shadow-lg shadow-gray-200"
                >
                  Meet Our Speakers
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
