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
  { id: "merchandise", label: "Merchandise", path: "/merchandise", isRoute: true },
  { id: "register", label: "Register", path: "/register", isCTA: true, isRoute: true },
];

export default function Navbar({ onNavigate }: { onNavigate?: (sectionId: string) => void }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleNavigation = (item: NavItem) => {
    if (!item.isRoute) {
      if (location.pathname !== "/") {
        window.location.href = `/#${item.id}`;
      } else if (onNavigate) {
        onNavigate(item.id);
      }
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-xl border-b border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <a href="/" className="flex-shrink-0 transition-transform duration-200 hover:scale-[1.02]">
            <img
              src={Logo}
              alt="BISUM Conference"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              if (item.isCTA) {
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className="ml-4 inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-brand-red to-brand-orange shadow-md shadow-brand-red/25 hover:shadow-lg hover:shadow-brand-red/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 tracking-wide"
                  >
                    {item.label}
                  </Link>
                );
              }

              const active = isActive(item);
              const linkClasses = `relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                active
                  ? "text-brand-red font-bold bg-brand-red/10"
                  : "text-gray-700 hover:text-brand-red hover:bg-brand-red/5"
              }`;

              if (item.isRoute) {
                return (
                  <Link key={item.id} to={item.path} className={linkClasses}>
                    {item.label}
                  </Link>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  className={linkClasses}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl text-gray-700 hover:text-brand-red hover:bg-brand-red/5 focus:outline-none transition-colors"
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
                    strokeWidth={2.2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 px-3 bg-white/95 backdrop-blur-2xl border-t border-gray-100 rounded-b-2xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-1.5">
              {navItems.map((item) => {
                if (item.isCTA) {
                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      className="mt-3 block text-center px-4 py-3 text-base font-bold text-white rounded-xl bg-gradient-to-r from-brand-red to-brand-orange shadow-md shadow-brand-red/25 active:scale-[0.98] transition-all"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  );
                }

                const active = isActive(item);
                const itemClasses = `block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  active
                    ? "bg-brand-red/10 text-brand-red font-bold"
                    : "text-gray-700 hover:bg-brand-red/5 hover:text-brand-red"
                }`;

                if (item.isRoute) {
                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      className={itemClasses}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item)}
                    className={`w-full text-left ${itemClasses}`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
