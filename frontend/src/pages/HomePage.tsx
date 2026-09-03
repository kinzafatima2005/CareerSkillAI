import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Briefcase, TrendingUp, CheckCircle, Database, Award, ArrowRight, Layers, Cpu, Zap, Activity } from 'lucide-react';
import { fetchRoles } from '../services/api';
import { RoleSummary } from '../types';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchRole, setSearchRole] = useState('');
  const [roles, setRoles] = useState<RoleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchRoles()
      .then(setRoles)
      .finally(() => setLoading(false));
  }, []);

  const filteredRoles = searchRole.trim()
    ? roles.filter(
        (r) =>
          r.name.toLowerCase().includes(searchRole.toLowerCase()) ||
          r.normalized_key.includes(searchRole.toLowerCase().replace(/\s+/g, '-'))
      )
    : roles;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchRole.trim()) {
      const matched = roles.find(
        (r) => r.name.toLowerCase() === searchRole.trim().toLowerCase()
      );
      const slug = matched ? matched.normalized_key : searchRole.trim().toLowerCase().replace(/\s+/g, '-');
      setShowDropdown(false);
      navigate(`/role/${slug}`);
    }
  };

  const handleSelectRole = (slug: string) => {
    setShowDropdown(false);
    navigate(`/role/${slug}`);
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* HERO SECTION */}
      <section className="pt-12 pb-14 text-center border-b border-slate-800/80 bg-gradient-to-b from-[#0f172a]/60 to-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400">
            <Activity className="w-3.5 h-3.5" />
            <span>Empirical Job Market Skill Intelligence Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Understand What Employers <span className="text-blue-500">Genuinely Demand</span>.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Quantify technical skill demand across {roles.length > 0 ? roles.length : 20} canonical roles, measure personal skill-gap alignment %, and generate stage-by-stage learning roadmaps.
          </p>

          {/* Search Box */}
          <div className="max-w-xl mx-auto relative text-left" ref={dropdownRef}>
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search role (e.g. AI Engineer, MLOps, Cybersecurity)..."
                  value={searchRole}
                  onChange={(e) => {
                    setSearchRole(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  className="w-full pl-10 pr-4 py-3 prof-input rounded-xl text-slate-100 placeholder-slate-500 text-xs font-medium focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 prof-button-primary rounded-xl text-xs font-bold flex items-center justify-center gap-2 shrink-0"
              >
                <span>Analyze Role</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Autocomplete Dropdown */}
            {showDropdown && filteredRoles.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 prof-panel rounded-xl border border-slate-700 p-2 shadow-xl z-50 max-h-60 overflow-y-auto">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Target Role Matches ({filteredRoles.length})
                </div>
                {filteredRoles.map((role) => (
                  <button
                    key={role.normalized_key}
                    onClick={() => handleSelectRole(role.normalized_key)}
                    className="w-full px-3 py-2 rounded-lg hover:bg-blue-600/20 text-slate-200 hover:text-white flex items-center justify-between text-xs font-semibold transition-colors"
                  >
                    <span>{role.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{role.job_count} jobs</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 pt-1">
            <span className="font-semibold text-slate-500">Popular Searches:</span>
            {['AI Engineer', 'MLOps Engineer', 'Cybersecurity Engineer', 'Data Scientist', 'Software Engineer'].map((role) => (
              <button
                key={role}
                onClick={() => handleSelectRole(role.toLowerCase().replace(/\s+/g, '-'))}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800"
              >
                {role}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* METRICS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 prof-panel rounded-2xl border border-slate-800">
          
          <div className="text-center space-y-1 border-r border-slate-800 last:border-0 p-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">568+</div>
            <div className="text-xs text-slate-400 font-semibold">Real Job Postings Analyzed</div>
          </div>

          <div className="text-center space-y-1 border-r border-slate-800 last:border-0 p-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">70</div>
            <div className="text-xs text-slate-400 font-semibold">Canonical Tech Skills</div>
          </div>

          <div className="text-center space-y-1 border-r border-slate-800 last:border-0 p-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">95.8%</div>
            <div className="text-xs text-slate-400 font-semibold">NLP Normalization Accuracy</div>
          </div>

          <div className="text-center space-y-1 p-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400">20 Roles</div>
            <div className="text-xs text-slate-400 font-semibold">Canonical Technical Categories</div>
          </div>

        </div>
      </section>

      {/* FEATURED ROLES DIRECTORY GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Canonical Career Roles Catalog</h2>
            <p className="text-xs text-slate-400 mt-1">Select a role to inspect employer skill frequencies, demand score rankings, and trends.</p>
          </div>
          <Link to="/roles" className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
            <span>View All 20 Roles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs">Loading career roles database...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {roles.slice(0, 9).map((role) => (
              <div
                key={role.normalized_key}
                onClick={() => navigate(`/role/${role.normalized_key}`)}
                className="prof-card rounded-xl p-5 cursor-pointer space-y-4 group"
              >
                
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800">
                    {role.job_count} Jobs
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                    {role.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Employer demand analytics dashboard</p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Top Demanded Skills</span>
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

      </section>

      {/* CORE PIPELINE HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prof-panel rounded-2xl p-8 border border-slate-800 space-y-8">
          
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-white">How CareerSkill AI Works</h2>
            <p className="text-xs text-slate-400">Data science & NLP pipeline translating thousands of raw job postings into actionable career execution paths.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-600/15 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="text-sm font-bold text-white">1. NLP Skill Extraction</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Raw job listings pass through our controlled taxonomy parser to isolate exact technical skill tokens while avoiding string corruption.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="text-sm font-bold text-white">2. Skill Gap Analysis</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Compare your technical skills against market requirements to receive your Estimated Market Skill Alignment %.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-600/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="text-sm font-bold text-white">3. Learning Roadmap</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generate a stage-by-stage learning path with practical portfolio project blueprints tailored specifically to your target role.
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
