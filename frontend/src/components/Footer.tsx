import React from 'react';
import { Briefcase, Shield, Layers, Terminal, Database, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-[#070b12] text-slate-400 text-xs py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3 col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-sm font-extrabold text-white tracking-tight">CareerSkill AI</span>
            </div>
            <p className="text-slate-400 max-w-md leading-relaxed text-xs">
              Full-stack Data Science & AI platform analyzing thousands of job postings to quantify employer skill demand, perform skill-gap analysis, and generate personalized learning roadmaps.
            </p>
            <p className="text-[11px] text-slate-500">
              * Analytics calculated strictly from empirical job market datasets. Correlation does not imply causation.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-wider text-slate-300">
              Platform Features
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/roles" className="hover:text-blue-400 transition-colors">Role Market Intelligence</Link></li>
              <li><Link to="/skill-gap" className="hover:text-blue-400 transition-colors">Personalized Skill Gap</Link></li>
              <li><Link to="/roadmap" className="hover:text-blue-400 transition-colors">Career Roadmap Generator</Link></li>
              <li><Link to="/trends" className="hover:text-blue-400 transition-colors">Emerging Tech Growth</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-wider text-slate-300">
              Data Science Pipeline
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/about" className="hover:text-blue-400 transition-colors">Controlled Skill Taxonomy</Link></li>
              <li><Link to="/about" className="hover:text-blue-400 transition-colors">Demand Score Formula</Link></li>
              <li><Link to="/about" className="hover:text-blue-400 transition-colors">Data Quality Reports</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} CareerSkill AI. Enterprise Data Product.</p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Data Engine Online (568 Jobs Analyzed)
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
