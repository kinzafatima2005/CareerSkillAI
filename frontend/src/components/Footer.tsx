import React from 'react';
import { Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#DFE6ED] bg-white text-[#738598] text-xs py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3 col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#0E73B9] flex items-center justify-center text-white shadow-sm">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-sm font-extrabold text-[#1A2D42] tracking-tight font-heading">CareerSkill AI</span>
            </div>
            <p className="text-[#738598] max-w-md leading-relaxed text-xs">
              Full-stack Data Science & AI platform analyzing thousands of job postings to quantify employer skill demand, perform skill-gap analysis, and generate personalized learning roadmaps.
            </p>
            <p className="text-[11px] text-[#738598]/80">
              * Analytics calculated strictly from empirical job market datasets.
            </p>
          </div>

          <div>
            <h4 className="text-[#1A2D42] font-bold mb-3 text-xs uppercase tracking-wider font-heading">
              Platform Features
            </h4>
            <ul className="space-y-2 text-[#738598]">
              <li><Link to="/roles" className="hover:text-[#0084E2] transition-colors">Role Market Intelligence</Link></li>
              <li><Link to="/skill-gap" className="hover:text-[#0084E2] transition-colors">Personalized Skill Gap</Link></li>
              <li><Link to="/roadmap" className="hover:text-[#0084E2] transition-colors">Career Roadmap Generator</Link></li>
              <li><Link to="/trends" className="hover:text-[#0084E2] transition-colors">Emerging Tech Growth</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#1A2D42] font-bold mb-3 text-xs uppercase tracking-wider font-heading">
              Data Pipeline
            </h4>
            <ul className="space-y-2 text-[#738598]">
              <li><Link to="/about" className="hover:text-[#0084E2] transition-colors">Controlled Skill Taxonomy</Link></li>
              <li><Link to="/about" className="hover:text-[#0084E2] transition-colors">Demand Score Formula</Link></li>
              <li><Link to="/about" className="hover:text-[#0084E2] transition-colors">Data Quality Reports</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-[#DFE6ED] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#738598] text-[11px]">
          <p>© {new Date().getFullYear()} CareerSkill AI. Student Career Intelligence.</p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF3FA] text-[#18B29C] border border-[#DFE6ED] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#18B29C] animate-pulse" />
              Data Engine Online (568 Jobs Analyzed)
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
