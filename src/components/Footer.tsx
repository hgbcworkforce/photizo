import { Facebook, Instagram, Youtube, MapPin, Mail, Phone } from 'lucide-react';
import Logo from "/logo-wc.png";


  const socialLinks = [
    {
      name: "Facebook",
      href: "https://facebook.com/hgbcinfluencers",
      icon: <Facebook className="w-6 h-6" />,
    },
    {
      name: "Instagram",
      href: "https://instagram.com/hgbcinfluencers",
      icon: <Instagram className="w-6 h-6" />,
    },
    {
      name: "YouTube",
      href: "https://youtube.com/@hgbcinfluencers",
      icon: <Youtube className="w-6 h-6" />,
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
      icon: <MapPin className="w-5 h-5" />,
      text: "Ogbomoso, Nigeria",
    },
    {
      icon: <Mail className="w-5 h-5" />,
      text: "photizo@hgbcinfluencers.org",
    },
    {
      icon: <Phone className="w-5 h-5" />,
      text: "+234 (0) 123 456 7890",
    },
  ];

export default function Footer() {
  const currentYear = new Date().getFullYear();

    return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
               {/* Logo */}
          <a href="/" className="flex-shrink-0">
            <img
              src={Logo}
              alt="BISUM Conference"
              className="w-1/2"
            />
          </a>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Join us to experience an atmosphere of learning, connection, and transformation.
              Gain practical insights, meet inspiring leaders, and take bold steps toward your future.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-white">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href ={link.href}
                    // onClick={() => scrollToSection(link.href)}
                    className="text-gray-400 hover:text-brand-red transition-colors duration-200 text-left"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-white">
              Contact Info
            </h4>
            <ul className="space-y-4">
              {contactInfo.map((info, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="text-brand-red mt-1 flex-shrink-0">
                    {info.icon}
                  </span>
                  <span className="text-gray-400">{info.text}</span>
                </li>
              ))}
            </ul>
          </div>

                      {/* Social Media Links */}
            <div>
            <h4 className="text-xl font-semibold mb-6 text-white">
              Follow Us
            </h4>    
                   
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-brand-red/70 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-800"
                  aria-label={`Follow us on ${social.name}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            </div>   
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-row justify-center items-center space-y-4 md:space-y-0">
          {/* Copyright */}
          <div className="text-gray-400 text-sm">
            © {currentYear} Photizo Conference. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
