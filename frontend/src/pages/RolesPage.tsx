import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart2, Search, ArrowRight, Layers, Briefcase } from 'lucide-react';
import { fetchRoles } from '../services/api';
import { RoleSummary } from '../types';

export const RolesPage: React.FC = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<RoleSummary[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoles()
      .then(setRoles)
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', 'AI & Machine Learning', 'Data & Analytics', 'Cloud & DevOps', 'Software & Web', 'Cybersecurity', 'Product'];

  const filteredRoles = roles.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    if (activeCategory === 'All') return matchesSearch;
    if (activeCategory === 'AI & Machine Learning') {
      return matchesSearch && (r.name.includes('AI') || r.name.includes('Machine Learning') || r.name.includes('NLP') || r.name.includes('Vision') || r.name.includes('MLOps'));
    }
    if (activeCategory === 'Data & Analytics') {
      return matchesSearch && (r.name.includes('Data') || r.name.includes('Intelligence') || r.name.includes('Analyst') || r.name.includes('Database'));
    }
    if (activeCategory === 'Cloud & DevOps') {
      return matchesSearch && (r.name.includes('Cloud') || r.name.includes('DevOps') || r.name.includes('MLOps'));
    }
    if (activeCategory === 'Software & Web') {
      return matchesSearch && (r.name.includes('Software') || r.name.includes('Frontend') || r.name.includes('Mobile'));
    }
    if (activeCategory === 'Cybersecurity') {
      return matchesSearch && (r.name.includes('Security') || r.name.includes('Cybersecurity'));
    }
    if (activeCategory === 'Product') {
      return matchesSearch && (r.name.includes('Product') || r.name.includes('Program'));
    }
    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="prof-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
          <BarChart2 className="w-3.5 h-3.5" /> Canonical Career Roles Directory ({roles.length} Roles)
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Explore Job Market Skill Demand
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          Select any canonical role below to inspect empirical employer skill frequency, demand score rankings (0-100), time-series growth trajectories, and salary insights.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Category Pill Filters */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Filter Box */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Filter roles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 prof-input rounded-lg text-slate-200 placeholder-slate-500 text-xs font-medium focus:outline-none"
          />
        </div>

      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 text-xs">Loading career roles database...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRoles.map((role) => (
            <div
              key={role.normalized_key}
              onClick={() => navigate(`/role/${role.normalized_key}`)}
              className="prof-card rounded-xl p-5 cursor-pointer space-y-4 group"
            >
              
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800">
                  {role.job_count} Jobs
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                  {role.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Skill demand & growth trajectory</p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Top Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {role.top_skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-900 text-slate-300 border border-slate-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
