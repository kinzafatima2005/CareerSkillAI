import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, Briefcase, TrendingUp, CheckCircle2, Database, Award, ArrowRight,
  Layers, Cpu, Target, BookOpen, Sparkles, ChevronRight, GraduationCap, Code2,
  Activity, Check, BarChart2, ShieldCheck, Compass
} from 'lucide-react';
import { fetchRoles } from '../services/api';
import { RoleSummary } from '../types';
import { useUserSkills } from '../utils/userSkillsStorage';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchRole, setSearchRole] = useState('');
  const [roles, setRoles] = useState<RoleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [userSkills] = useUserSkills();

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

  // Dynamic Student Skills & Progress Data based on saved skills
  const dynamicSkillProgress = userSkills.slice(0, 6).map((skill, index) => {
    const percentages = [90, 80, 75, 65, 60, 55];
    const percentage = percentages[index % percentages.length];
    const level = percentage >= 80 ? 'Advanced' : percentage >= 65 ? 'Intermediate' : 'Beginner';
    return { name: skill, percentage, level };
  });

  const achievements = [
    { title: 'Code Craftsman', desc: 'Core Programming & Logic', icon: Code2, color: 'text-blue-700 bg-blue-100 border-blue-200' },
    { title: 'Database Explorer', desc: 'Queries & Data Management', icon: Database, color: 'text-emerald-700 bg-emerald-100 border-emerald-200' },
    { title: 'System Architect', desc: 'Infrastructure & Tools', icon: Cpu, color: 'text-purple-700 bg-purple-100 border-purple-200' },
    { title: 'Pipeline Engineer', desc: 'Workflows & Integration', icon: Layers, color: 'text-indigo-700 bg-indigo-100 border-indigo-200' },
  ];

  return (
    <div className="space-y-8 pb-16 pt-6">

      {/* SECTION 1: HERO BLUE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* WELCOME HERO BLUE BANNER */}
        <div className="w-full rounded-2xl bg-[#0E73B9] text-white p-8 sm:p-10 shadow-card flex flex-col justify-between relative z-20 overflow-hidden">

          {/* Background Graphic Accents */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12" />
          </div>

          <div className="space-y-4 relative z-10">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-heading leading-tight text-white">
              Welcome Back, Career Explorer
            </h1>
            <p className="text-xs sm:text-sm text-white/90 max-w-2xl leading-relaxed font-medium">
              Explore job market skill demand, evaluate your empirical skill gap, and build your role execution roadmap.
            </p>
          </div>

          {/* Role Search Bar inside Hero */}
          <div className="pt-6 relative z-10 max-w-xl" ref={dropdownRef}>
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#738598]" />
                <input
                  type="text"
                  placeholder="Search target role (e.g. AI Engineer, Software Engineer, DevOps)..."
                  value={searchRole}
                  onChange={(e) => {
                    setSearchRole(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  className="w-full pl-10 pr-4 py-3 bg-white rounded-full text-[#1A2D42] placeholder-[#738598] text-xs font-medium focus:outline-none shadow-card border border-[#DFE6ED]"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-[#0084E2] hover:bg-[#0E73B9] text-white rounded-full text-xs font-bold flex items-center justify-center gap-2 shrink-0 shadow-card transition-colors"
              >
                <span>Analyze Role</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Autocomplete Dropdown */}
            {showDropdown && filteredRoles.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl border border-[#DFE6ED] p-2 shadow-2xl z-50 max-h-60 overflow-y-auto text-[#1A2D42]">
                <div className="px-3 py-1 text-[10px] font-bold text-[#738598] uppercase tracking-wider border-b border-[#DFE6ED]">
                  Target Role Matches ({filteredRoles.length})
                </div>
                {filteredRoles.map((role) => (
                  <button
                    key={role.normalized_key}
                    onClick={() => handleSelectRole(role.normalized_key)}
                    className="w-full px-3 py-2 rounded-xl hover:bg-[#EAF3FA] text-[#1A2D42] hover:text-[#0E73B9] flex items-center justify-between text-xs font-semibold transition-colors"
                  >
                    <span>{role.name}</span>
                    <span className="text-[11px] text-[#738598] font-mono">{role.job_count} jobs</span>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* SECTION 2: RECOMMENDED NEXT STEPS (Secondary Action Chips) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prof-panel p-6 rounded-2xl border border-[#DFE6ED] bg-white shadow-card space-y-4">
          <h3 className="text-xs font-bold text-[#1A2D42] uppercase tracking-wider font-heading flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#0E73B9]" />
            <span>Recommended Next Steps</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link
              to="/skill-gap"
              className="px-4 py-3 rounded-full border border-[#DFE6ED] hover:border-[#0084E2] bg-white hover:bg-[#EAF3FA] text-[#1A2D42] text-xs font-semibold flex items-center justify-between transition-all group shadow-card"
            >
              <span className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#EE6C4D]" />
                <span>Take Skill Gap Test</span>
              </span>
              <ChevronRight className="w-4 h-4 text-[#738598] group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              to="/roles"
              className="px-4 py-3 rounded-full border border-[#DFE6ED] hover:border-[#0084E2] bg-white hover:bg-[#EAF3FA] text-[#1A2D42] text-xs font-semibold flex items-center justify-between transition-all group shadow-card"
            >
              <span className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-[#18B29C]" />
                <span>Explore Role Demand</span>
              </span>
              <ChevronRight className="w-4 h-4 text-[#738598] group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              to="/roadmap"
              className="px-4 py-3 rounded-full border border-[#DFE6ED] hover:border-[#0084E2] bg-white hover:bg-[#EAF3FA] text-[#1A2D42] text-xs font-semibold flex items-center justify-between transition-all group shadow-card"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#0084E2]" />
                <span>Open Milestone Roadmap</span>
              </span>
              <ChevronRight className="w-4 h-4 text-[#738598] group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              to="/about"
              className="px-4 py-3 rounded-full border border-[#DFE6ED] hover:border-[#0084E2] bg-white hover:bg-[#EAF3FA] text-[#1A2D42] text-xs font-semibold flex items-center justify-between transition-all group shadow-card"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0E73B9]" />
                <span>Inspect Data Methodology</span>
              </span>
              <ChevronRight className="w-4 h-4 text-[#738598] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 3: SKILL PROFICIENCY TRACKER & STUDENT BADGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* SKILL PROFICIENCY BARS */}
          <div className="prof-panel p-6 rounded-2xl border border-[#DFE6ED] bg-white shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#EAF3FA] text-[#0E73B9] flex items-center justify-center font-bold">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#1A2D42] font-heading">Skill Proficiency Levels</h3>
              </div>
              <span className="text-xs font-semibold text-[#738598]">{userSkills.length} Tracked Skills</span>
            </div>

            <div className="space-y-4 pt-1">
              {dynamicSkillProgress.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#738598]">
                  No skills added yet. Add skills in the Skill Gap tab!
                </div>
              ) : (
                dynamicSkillProgress.map((skill) => (
                  <div key={skill.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#1A2D42]">{skill.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF3FA] text-[#0E73B9] border border-[#DFE6ED]">
                          {skill.level}
                        </span>
                        <span className="font-extrabold text-[#1A2D42] font-mono text-xs">{skill.percentage}%</span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-[#EAF3FA] overflow-hidden border border-[#DFE6ED]">
                      <div
                        className="h-full bg-[#0E73B9] rounded-full transition-all duration-500"
                        style={{ width: `${skill.percentage}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* STUDENT BADGES & ACHIEVEMENTS */}
          <div className="prof-panel p-6 rounded-2xl border border-[#DFE6ED] bg-white shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#EAF3FA] text-[#EE6C4D] flex items-center justify-center font-bold">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#1A2D42] font-heading">Student Achievements</h3>
              </div>
              <span className="text-xs font-semibold text-[#738598]">4 Badges Unlocked</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              {achievements.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="p-3.5 rounded-xl bg-[#F4F7FA] border border-[#DFE6ED] flex items-center gap-3 hover:border-[#0084E2] transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-[#DFE6ED] bg-[#EAF3FA] text-[#0E73B9]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1A2D42]">{item.title}</h4>
                      <p className="text-[11px] text-[#738598]">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 4: CANONICAL CAREER ROLES CATALOG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-[#DFE6ED] pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#1A2D42] tracking-tight font-heading">Career Roles Catalog</h2>
            <p className="text-xs text-[#738598] mt-1">Select a role to inspect employer skill frequencies, demand score rankings, and market trends.</p>
          </div>
          <Link to="/roles" className="text-xs font-bold text-[#0E73B9] hover:text-[#0084E2] flex items-center gap-1">
            <span>View All 20 Roles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-[#738598] text-xs">Loading career roles database...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {roles.slice(0, 9).map((role) => (
              <div
                key={role.normalized_key}
                onClick={() => navigate(`/role/${role.normalized_key}`)}
                className="prof-card rounded-2xl p-5 cursor-pointer space-y-4 group bg-white border border-[#DFE6ED] hover:border-[#0084E2] shadow-card transition-all"
              >

                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF3FA] border border-[#DFE6ED] text-[#0E73B9] flex items-center justify-center">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#EAF3FA] text-[#0E73B9] border border-[#DFE6ED]">
                    {role.job_count} Jobs
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#1A2D42] group-hover:text-[#0084E2] transition-colors font-heading">
                    {role.name}
                  </h3>
                  <p className="text-xs text-[#738598] mt-0.5">Employer demand analytics dashboard</p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-[#DFE6ED]">
                  <span className="text-[10px] font-bold text-[#738598] uppercase tracking-wider">Top Demanded Skills</span>
                  <div className="flex flex-wrap gap-1.5">
                    {role.top_skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#EAF3FA] text-[#1A2D42] border border-[#DFE6ED]"
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

    </div>
  );
};

export default HomePage;
