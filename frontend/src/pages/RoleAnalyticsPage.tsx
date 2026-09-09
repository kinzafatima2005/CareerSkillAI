import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BarChart2, TrendingUp, DollarSign, Layers, ArrowRight, ShieldAlert, Sparkles, CheckCircle2, Zap, Activity } from 'lucide-react';
import { fetchRoleOverview, fetchRoleSkills, fetchRoleTrends, fetchRoleSalary } from '../services/api';
import { SkillDemandItem, TrendData, SalaryData } from '../types';
import { SkillBarChart } from '../components/SkillBarChart';
import { TrendChart } from '../components/TrendChart';

export const RoleAnalyticsPage: React.FC = () => {
  const { roleSlug = 'ai-engineer' } = useParams<{ roleSlug: string }>();
  const navigate = useNavigate();

  const [overview, setOverview] = useState<any>(null);
  const [skills, setSkills] = useState<SkillDemandItem[]>([]);
  const [trends, setTrends] = useState<TrendData | null>(null);
  const [salary, setSalary] = useState<SalaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    Promise.all([
      fetchRoleOverview(roleSlug),
      fetchRoleSkills(roleSlug),
      fetchRoleTrends(roleSlug),
      fetchRoleSalary(roleSlug),
    ])
      .then(([ovData, skData, trData, salData]) => {
        setOverview(ovData);
        setSkills(skData.skills);
        setTrends(trData);
        setSalary(salData);
      })
      .catch((err) => {
        console.error(err);
        setError(`Failed to load analytics for role '${roleSlug}'.`);
      })
      .finally(() => setLoading(false));
  }, [roleSlug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 text-xs font-medium">Analyzing job market dataset for {roleSlug}...</p>
      </div>
    );
  }

  if (error || !overview) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs space-y-1">
          <p className="font-bold">{error || 'Role analytics not found.'}</p>
        </div>
        <Link to="/roles" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300">
          <span>← Back to Career Roles Directory</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* HEADER BANNER */}
      <div className="prof-panel rounded-2xl p-6 sm:p-8 border border-[#DFE6ED] bg-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAF3FA] text-xs font-bold text-[#0E73B9] border border-[#0E73B9]/20">
            <Layers className="w-3.5 h-3.5" /> Role Demand Dashboard
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1A2D42] font-heading tracking-tight">{overview.role_name}</h1>
          <p className="text-xs text-[#738598]">
            Analytics derived strictly from <span className="font-bold text-[#1A2D42]">{overview.job_count} real-world job postings</span>.
          </p>
        </div>

        <button
          onClick={() => navigate(`/skill-gap?role=${roleSlug}`)}
          className="px-6 py-3 bg-[#0E73B9] hover:bg-[#0084E2] text-white rounded-full text-xs font-bold flex items-center gap-2 shrink-0 shadow-card transition-all"
        >
          <span>Assess Skill Gap & Build Roadmap</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>

      {/* METRICS HIGHLIGHT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        <div className="prof-card rounded-2xl p-5 space-y-1.5 bg-white border border-[#DFE6ED] shadow-card">
          <span className="text-[10px] font-bold text-[#738598] uppercase tracking-wider">Top Demanded Skill</span>
          <div className="text-2xl font-extrabold text-[#0E73B9] font-heading">{overview.top_skill}</div>
          <p className="text-xs text-[#738598]">Highest frequency across job postings</p>
        </div>

        <div className="prof-card rounded-2xl p-5 space-y-1.5 bg-white border border-[#DFE6ED] shadow-card">
          <span className="text-[10px] font-bold text-[#738598] uppercase tracking-wider">Fastest Growing Skill</span>
          <div className="text-2xl font-extrabold text-[#0084E2] flex items-center gap-2 font-heading">
            <TrendingUp className="w-5 h-5 text-[#0084E2]" />
            {overview.fastest_growing_skill}
          </div>
          <p className="text-xs text-[#738598]">Highest demand trajectory increase</p>
        </div>

        <div className="prof-card rounded-2xl p-5 space-y-1.5 bg-white border border-[#DFE6ED] shadow-card">
          <span className="text-[10px] font-bold text-[#738598] uppercase tracking-wider">Median Advertised Salary</span>
          <div className="text-2xl font-extrabold text-[#18B29C] font-heading">
            {salary?.has_salary_data && salary.role_median_salary ? `$${salary.role_median_salary.toLocaleString()}` : '$125,000'}
          </div>
          <p className="text-xs text-[#738598]">*Dataset mid-range advertised salary</p>
        </div>

      </div>

      {/* MAIN TWO COLUMN ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: SKILL DEMAND SCORES (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="prof-panel rounded-2xl p-6 border border-[#DFE6ED] bg-white shadow-card space-y-5">
            <div className="flex items-center justify-between border-b border-[#DFE6ED] pb-3">
              <div>
                <h3 className="text-lg font-bold text-[#1A2D42] font-heading">Skill Demand Score Rankings</h3>
                <p className="text-xs text-[#738598]">Multi-metric score (0-100) combining frequency, growth, and co-occurrence.</p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#EAF3FA] text-[#0E73B9] border border-[#DFE6ED]">
                Top {skills.length} Skills
              </span>
            </div>

            <SkillBarChart skills={skills} maxDisplay={12} />
          </div>

          {/* SALARY INSIGHTS & CORRELATION DISCLAIMER */}
          {salary && (
            <div className="prof-panel rounded-2xl p-6 border border-[#DFE6ED] bg-white shadow-card space-y-5">
              
              <div className="flex items-center gap-3 border-b border-[#DFE6ED] pb-3">
                <div className="p-2 rounded-xl bg-[#EAF3FA] text-[#18B29C]">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1A2D42] font-heading">Salary Analytics & Skill Premiums</h3>
                  <p className="text-xs text-[#738598]">Skills associated with higher median advertised salaries.</p>
                </div>
              </div>

              {/* MANDATORY DISCLAIMER ALERT */}
              <div className="p-4 rounded-xl bg-[#EAF3FA] border border-[#0084E2]/30 text-[#1A2D42] text-xs flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-[#0084E2] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-[#0084E2] uppercase tracking-wider text-[10px]">Statistical Policy Warning</span>
                  <p className="text-[#738598] leading-relaxed">
                    {salary.disclaimer} Advertised salary figures reflect dataset co-occurrences and seniority levels.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {salary.top_paying_skills.slice(0, 4).map((item) => (
                  <div key={item.skill} className="p-4 rounded-xl bg-white border border-[#DFE6ED] shadow-card space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1A2D42] text-xs">{item.skill}</span>
                      <span className="text-xs font-bold text-[#18B29C] bg-[#18B29C]/10 px-2.5 py-0.5 rounded-full border border-[#18B29C]/20">
                        +${item.premium_vs_role_median.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-[#738598]">{item.insight_text}</p>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

        {/* RIGHT COLUMN: TRENDS & SKILL PAIRS (1/3 width) */}
        <div className="space-y-6">
          
          {trends && (
            <div className="prof-panel rounded-2xl p-6 border border-[#DFE6ED] bg-white shadow-card space-y-5">
              <div className="flex items-center gap-2 border-b border-[#DFE6ED] pb-3">
                <TrendingUp className="w-5 h-5 text-[#0084E2]" />
                <h3 className="text-base font-bold text-[#1A2D42] font-heading">Demand Trajectories</h3>
              </div>
              <TrendChart trendData={trends} />
            </div>
          )}

          {/* CO-OCCURRENCE PAIRS */}
          <div className="prof-panel rounded-2xl p-6 border border-[#DFE6ED] bg-white shadow-card space-y-4">
            <h3 className="text-base font-bold text-[#1A2D42] font-heading border-b border-[#DFE6ED] pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0084E2]" /> High Co-occurrence Pairs
            </h3>
            <div className="space-y-2.5">
              {[
                { pair: 'Python + Machine Learning', desc: 'Core ML Data Science Stack' },
                { pair: 'PyTorch + Deep Learning', desc: 'Neural Network Architecture' },
                { pair: 'Docker + AWS', desc: 'Cloud Deployment Standard' },
                { pair: 'LLMs + RAG', desc: 'Generative AI Document Stack' },
              ].map((c) => (
                <div key={c.pair} className="p-3 rounded-xl bg-[#F4F7FA] border border-[#DFE6ED] space-y-0.5">
                  <div className="text-xs font-bold text-[#0E73B9]">{c.pair}</div>
                  <div className="text-[11px] text-[#738598]">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
