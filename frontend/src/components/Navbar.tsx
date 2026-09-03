import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, BarChart2, CheckSquare, Map, TrendingUp, Info, Briefcase, Menu, X, ArrowRight, Activity, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home', icon: Compass },
    { path: '/roles', label: 'Career Roles', icon: BarChart2 },
    { path: '/skill-gap', label: 'Skill Gap', icon: CheckSquare },
    { path: '/roadmap', label: 'Roadmap', icon: Map },
    { path: '/trends', label: 'Trends', icon: TrendingUp },
    { path: '/about', label: 'Methodology', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#090d16]/95 border-b border-slate-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white flex items-center gap-2">
                CareerSkill <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30">AI</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium">Job Market Skill Intelligence</p>
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
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Action CTA */}
          <div className="flex items-center space-x-3">
            <Link
              to="/skill-gap"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-all"
            >
              <Activity className="w-3.5 h-3.5 text-blue-200" />
              <span>Skill Gap Analysis</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0f172a] p-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold ${
                  isActive ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 text-blue-400" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
