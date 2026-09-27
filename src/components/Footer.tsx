import { Facebook, Instagram, Youtube, MapPin, Mail, Phone } from 'lucide-react';
import Logo from "/logo-wc.png";

const socialLinks = [
  {
    name: "Facebook",
    href: "https://facebook.com/hgbcinfluencers",
    icon: <Facebook className="w-5 h-5" />,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/hgbcinfluencers",
    icon: <Instagram className="w-5 h-5" />,
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@hgbcinfluencers",
    icon: <Youtube className="w-5 h-5" />,
  },
];

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Schedule", href: "/schedule" },
  { name: "Speakers", href: "/speakers" },
  { name: "Register", href: "/register" },
];

const contactInfo = [
  {
    icon: <MapPin className="w-4 h-4" />,
    text: "Ogbomoso, Nigeria",
  },
  {
    icon: <Mail className="w-4 h-4" />,
    text: "photizo@hgbcinfluencers.org",
  },
  {
    icon: <Phone className="w-4 h-4" />,
    text: "+234 (0) 123 456 7890",
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#09090b] text-white border-t border-white/10 relative overflow-hidden">
      {/* Top subtle gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-red/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-5">
            <div className="mb-6">
              <a href="/" className="inline-block transition-transform hover:scale-[1.02]">
                <img
                  src={Logo}
                  alt="BISUM Conference"
                  className="h-10 md:h-12 w-auto object-contain"
                />
              </a>
            </div>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-md font-normal">
              Join us to experience an atmosphere of learning, connection, and transformation.
              Gain practical insights, meet inspiring leaders, and take bold steps toward your future.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-base font-bold mb-5 text-white uppercase tracking-wider text-xs">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-brand-orange text-sm font-medium transition-colors duration-200 block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-3">
            <h4 className="text-base font-bold mb-5 text-white uppercase tracking-wider text-xs">
              Contact Info
            </h4>
            <ul className="space-y-3.5">
              {contactInfo.map((info, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-gray-400">
                  <span className="text-brand-red mt-0.5 shrink-0">
                    {info.icon}
                  </span>
                  <span>{info.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="lg:col-span-2">
            <h4 className="text-base font-bold mb-5 text-white uppercase tracking-wider text-xs">
              Follow Us
            </h4>    
            <div className="flex gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-brand-orange transition-all duration-200 p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-brand-orange/40 hover:bg-brand-orange/10 hover:-translate-y-0.5"
                  aria-label={`Follow us on ${social.name}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>   

        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-gray-400 text-xs font-normal text-center sm:text-left">
            © {currentYear} Photizo Conference. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
