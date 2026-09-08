import React from 'react';
import { Info, Database, Cpu, BarChart2, ShieldAlert, Award, Layers } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="prof-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
          <Info className="w-3.5 h-3.5" /> Methodology & Data Quality Specifications
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">How CareerSkill AI Operates</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          Documentation of our dataset cleaning pipelines, natural language skill extraction, canonical title normalization, and demand score algorithms.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* SECTION 1: DATASET & MULTI-SOURCE PIPELINE */}
        <div className="prof-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3 text-blue-400 border-b border-slate-800 pb-3">
            <Database className="w-5 h-5" />
            <h2 className="text-lg font-bold text-white">1. Multi-Source Architecture & Data Pipeline</h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            CareerSkill AI combines four complementary data sources into a unified intelligence & roadmap engine:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="font-bold text-blue-400 block">1. O*NET Standard Taxonomy</span>
              <p className="text-slate-400 text-[11px]">Establishes canonical occupation titles and baseline foundational skills (SOC codes).</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="font-bold text-indigo-400 block">2. Kaggle Job Datasets</span>
              <p className="text-slate-400 text-[11px]">Bulk historical postings for deep NLP skill co-occurrence and salary distribution modeling.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="font-bold text-purple-400 block">3. Real-Time Job APIs</span>
              <p className="text-slate-400 text-[11px]">Live Adzuna & JSearch fetchers providing up-to-the-minute hiring demand momentum.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="font-bold text-emerald-400 block">4. Learning Platform Integrations</span>
              <p className="text-slate-400 text-[11px]">Curated courses and certifications from Coursera, Udemy, FreeCodeCamp, and Official Docs.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
              <span className="text-2xl font-extrabold text-white block">4</span>
              <span className="text-[11px] text-slate-400 font-semibold">Data Sources Integrated</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
              <span className="text-2xl font-extrabold text-white block">568+</span>
              <span className="text-[11px] text-slate-400 font-semibold">Clean Jobs Analyzed</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
              <span className="text-2xl font-extrabold text-white block">95.8%</span>
              <span className="text-[11px] text-slate-400 font-semibold">Title Accuracy</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
              <span className="text-2xl font-extrabold text-white block">4,335</span>
              <span className="text-[11px] text-slate-400 font-semibold">Extracted Skills</span>
            </div>
          </div>
        </div>

        {/* SECTION 2: SKILL EXTRACTION & TAXONOMY */}
        <div className="prof-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3 text-indigo-400 border-b border-slate-800 pb-3">
            <Cpu className="w-5 h-5" />
            <h2 className="text-lg font-bold text-white">2. Controlled Skill Taxonomy & Alias Mapping</h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Skill extraction uses a controlled skill taxonomy dictionary mapping text variations and aliases into 70 canonical skills across technical domains using word-boundary matching (<code className="text-indigo-300 font-mono">\b</code>).
          </p>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs font-mono text-slate-400">
            <div>"Amazon Web Services" | "aws cloud" | "amazon aws" → <span className="text-blue-400 font-bold">AWS</span></div>
            <div>"PyTorch framework" | "experience with pytorch" → <span className="text-blue-400 font-bold">PyTorch</span></div>
            <div>"scikit-learn" | "sklearn" → <span className="text-blue-400 font-bold">Scikit-Learn</span></div>
          </div>
        </div>

        {/* SECTION 3: DEMAND SCORE FORMULA */}
        <div className="prof-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3 text-purple-400 border-b border-slate-800 pb-3">
            <BarChart2 className="w-5 h-5" />
            <h2 className="text-lg font-bold text-white">3. CareerSkill Demand Score Formula</h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Rather than relying solely on raw frequency, our composite demand score evaluates skills on a 0–100 scale:
          </p>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-purple-300 overflow-x-auto">
            <div>DemandScore = 0.45 * Frequency + 0.25 * Growth + 0.15 * CoOccurrence + 0.15 * SalaryAssociation</div>
          </div>
        </div>

        {/* SECTION 4: SALARY DISCLAIMER */}
        <div className="prof-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3 text-amber-400 border-b border-slate-800 pb-3">
            <ShieldAlert className="w-5 h-5" />
            <h2 className="text-lg font-bold text-white">4. Salary Analytics & Statistical Correlation Policy</h2>
          </div>
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2">
            <span className="font-bold uppercase tracking-wider text-[10px] block">Methodology Enforced Rule:</span>
            <p className="text-slate-300 leading-relaxed">
              We explicitly distinguish correlation from causation. We do NOT claim "Learning Docker increases salary by $15,000". Instead, we report: "In this dataset, job postings mentioning Docker have a median advertised salary of $130,000."
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
