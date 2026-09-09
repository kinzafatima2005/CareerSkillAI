import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, BarChart2, CheckSquare, Map, TrendingUp, Info, Briefcase, Menu, X, Activity } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: Compass },
    { path: '/roles', label: 'Career Roles', icon: BarChart2 },
    { path: '/skill-gap', label: 'Skill Gap', icon: CheckSquare },
    { path: '/roadmap', label: 'Roadmap', icon: Map },
    { path: '/trends', label: 'Trends', icon: TrendingUp },
    { path: '/about', label: 'Methodology', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 border-b border-[#DFE6ED] backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div>
              <span className="text-base font-extrabold tracking-tight text-[#1A2D42] flex items-center gap-2 font-heading">
                CareerSkill <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF3FA] text-[#0E73B9] border border-[#DFE6ED]">AI</span>
              </span>
              <p className="text-[10px] text-[#738598] font-medium">Student Career Intelligence</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#0E73B9] text-white shadow-sm font-semibold'
                      : 'bg-transparent text-[#738598] hover:text-[#1A2D42] hover:bg-[#EAF3FA]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#738598]'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full bg-[#EAF3FA] text-[#1A2D42] hover:bg-[#DFE6ED] border border-[#DFE6ED]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#DFE6ED] bg-white p-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-medium ${
                  isActive ? 'bg-[#0E73B9] text-white font-semibold' : 'text-[#738598] hover:bg-[#EAF3FA] hover:text-[#1A2D42]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#0E73B9]'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default Navbar;
