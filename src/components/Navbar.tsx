import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "/logo-c.png";


type NavItem = {
  id: string;
  label: string;
  path: string;
  isCTA?: boolean;
  isRoute?: boolean;
};


const navItems: NavItem[] = [
  { id: "schedule", label: "Schedule", path: "/schedule", isRoute: true },
  { id: "speakers", label: "Speakers", path: "/speakers", isRoute: true },
  { id: "merchandise",label: "Merchandise",path: "/merchandise",isRoute: true, },
  { id: "register",label: "Register",path: "/register",isCTA: true,isRoute: true,},
];

export default function Navbar({ onNavigate }: { onNavigate?: (sectionId: string) => void }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleNavigation = (item: NavItem) => {
    if (!item.isRoute) {
      // For non-route items (like 'merchandise')
      if (location.pathname !== "/") {
        // If not on homepage, navigate to homepage first
        window.location.href = `/#${item.id}`; // This will reload the page and scroll
      } else if (onNavigate) {
        // If already on homepage, just scroll
        onNavigate(item.id);
      }
    } else {
      // For route items (like 'schedule', 'speakers')
      // No change needed here, Link component handles it
    }
    setIsMobileMenuOpen(false);
  };

  const isActive = (item: NavItem) => {
    if (item.isRoute) {
      return location.pathname === item.path;
    }
    return false;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a href="/" className="flex-shrink-0">
            <img
              src={Logo}
              alt="BISUM Conference"
              className="w-28 md:w-36"
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => {
                const baseClasses = `px-3 py-2 text-lg font-medium transition-all duration-200`;
                const ctaClasses =
                  "bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl";
                const regularClasses = `text-gray-700 hover:text-orange-600 ${isActive(item) ? "text-orange-600 font-semibold" : ""}`;

                if (item.isRoute) {
                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      className={`${baseClasses} ${item.isCTA ? ctaClasses : regularClasses}`}
                    >
                      {item.label}
                    </Link>
                  );
                } else {
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item)}
                      className={`${baseClasses} ${item.isCTA ? ctaClasses : regularClasses}`}
                    >
                      {item.label}
                    </button>
                  );
                }
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-orange-600 p-2 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              {navItems.map((item) => {
                const baseClasses =
                  "block px-3 py-2 text-base font-medium transition-colors duration-200 w-full text-left";
                const ctaClasses =
                  "bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-lg";
                const regularClasses = `text-gray-700 hover:text-orange-600 ${isActive(item) ? "text-orange-600 font-semibold" : ""}`;

                if (item.isRoute) {
                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      className={`${baseClasses} ${item.isCTA ? ctaClasses : regularClasses}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  );
                } else {
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item)}
                      className={`${baseClasses} ${item.isCTA ? ctaClasses : regularClasses}`}
                    >
                      {item.label}
                    </button>
                  );
                }
              })}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
