import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckSquare, Plus, X, ArrowRight, Award, CheckCircle2, AlertCircle, Sparkles, Layers, Activity } from 'lucide-react';
import { fetchAllSkills, fetchRoles, computeSkillGap } from '../services/api';
import { SkillCategoryItem, RoleSummary, SkillGapResponse } from '../types';

export const SkillGapPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialRole = searchParams.get('role') || 'ai-engineer';
  const [targetRole, setTargetRole] = useState(initialRole);
  const [roles, setRoles] = useState<RoleSummary[]>([]);
  const [allSkills, setAllSkills] = useState<SkillCategoryItem[]>([]);
  const [userSkills, setUserSkills] = useState<string[]>(['Python', 'SQL', 'Pandas', 'Docker']);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const [gapResult, setGapResult] = useState<SkillGapResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRoles().then(setRoles);
    fetchAllSkills().then(setAllSkills);
  }, []);

  useEffect(() => {
    if (targetRole && userSkills.length > 0) {
      setLoading(true);
      computeSkillGap(targetRole, userSkills)
        .then(setGapResult)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [targetRole, userSkills]);

  const handleAddSkill = (skillName: string) => {
    if (skillName && !userSkills.includes(skillName)) {
      setUserSkills([...userSkills, skillName]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillName: string) => {
    setUserSkills(userSkills.filter((s) => s !== skillName));
  };

  const categories = ['All', ...Array.from(new Set(allSkills.map((s) => s.category)))];

  const filteredSkillSuggestions = allSkills.filter((s) => {
    const isNotAdded = !userSkills.includes(s.name);
    if (selectedCategory === 'All') return isNotAdded;
    return isNotAdded && s.category === selectedCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="prof-panel rounded-2xl p-6 sm:p-8 border border-[#DFE6ED] bg-white shadow-card space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAF3FA] text-[#0E73B9] text-xs font-bold border border-[#0E73B9]/20">
          <Activity className="w-3.5 h-3.5" /> Skill Gap Analytics Engine
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A2D42] font-heading">Skill Gap Analysis & Market Alignment</h1>
        <p className="text-xs sm:text-sm text-[#738598] max-w-2xl leading-relaxed">
          Select your target career path, input your current technical skills, and calculate your empirical Market Alignment Score.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: USER PROFILE BUILDER (1/3 width) */}
        <div className="space-y-6">
          
          <div className="prof-panel rounded-2xl p-6 border border-[#DFE6ED] bg-white shadow-card space-y-5">
            
            {/* Target Role Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1A2D42] uppercase tracking-wider block font-heading">
                Target Role
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3.5 py-2.5 prof-input rounded-full text-[#1A2D42] text-xs font-semibold focus:outline-none border border-[#DFE6ED]"
              >
                {roles.map((r) => (
                  <option key={r.normalized_key} value={r.normalized_key} className="bg-white text-[#1A2D42]">
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* My Skills Selector */}
            <div className="space-y-3 pt-3 border-t border-[#DFE6ED]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#1A2D42] uppercase tracking-wider block font-heading">
                  My Technical Skills ({userSkills.length})
                </label>
                <button
                  onClick={() => setUserSkills([])}
                  className="text-[10px] text-[#738598] hover:text-[#1A2D42] transition-colors"
                >
                  Clear All
                </button>
              </div>

              {/* Add Custom Skill Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type skill name..."
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill(newSkillInput.trim()))}
                  className="flex-1 px-3 py-2 prof-input rounded-full text-xs text-[#1A2D42] placeholder-[#738598] focus:outline-none border border-[#DFE6ED]"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill(newSkillInput.trim())}
                  className="px-4 py-2 bg-[#0E73B9] hover:bg-[#0084E2] text-white rounded-full text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              {/* Selected Skill Badges */}
              <div className="flex flex-wrap gap-1.5 min-h-[60px] p-3 rounded-2xl bg-[#F4F7FA] border border-[#DFE6ED]">
                {userSkills.length === 0 ? (
                  <span className="text-xs text-[#738598] italic p-1">No skills added yet. Select below.</span>
                ) : (
                  userSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF3FA] text-[#0E73B9] border border-[#0E73B9]/20"
                    >
                      <span>✓ {skill}</span>
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-[#EE6C4D] transition-colors ml-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Quick Add Suggestions Filtered by Category */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-bold text-[#738598] uppercase tracking-wider block">
                  Quick Add Taxonomy Skills:
                </span>
                
                {/* Category Pill Filters */}
                <div className="flex flex-wrap gap-1">
                  {categories.slice(0, 5).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-colors ${
                        selectedCategory === cat
                          ? 'bg-[#0E73B9] text-white'
                          : 'bg-[#EAF3FA] text-[#738598] border border-[#DFE6ED] hover:text-[#1A2D42]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {filteredSkillSuggestions.slice(0, 20).map((s) => (
                    <button
                      key={s.name}
                      onClick={() => handleAddSkill(s.name)}
                      className="px-2.5 py-0.5 rounded-full text-xs bg-white hover:bg-[#EAF3FA] hover:text-[#0E73B9] text-[#1A2D42] border border-[#DFE6ED] transition-colors"
                    >
                      + {s.name}
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: SKILL GAP RESULTS (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {loading || !gapResult ? (
            <div className="prof-panel rounded-2xl p-12 text-center text-[#738598] text-xs font-medium">
              Calculating skill gap alignment matrix...
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* ESTIMATED MARKET ALIGNMENT SCORE CARD */}
              <div className="prof-panel rounded-2xl p-6 sm:p-8 border border-[#DFE6ED] bg-white shadow-card space-y-4">
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-[#0E73B9] uppercase tracking-wider">
                      Calculated Skill Match
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#1A2D42] font-heading mt-0.5">
                      Target Role: {gapResult.target_role}
                    </h3>
                  </div>

                  <div className="flex items-baseline gap-2 bg-[#EAF3FA] px-4 py-2.5 rounded-2xl border border-[#DFE6ED]">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#0E73B9] font-heading">
                      {gapResult.overall_match_score}%
                    </span>
                    <span className="text-xs font-bold text-[#738598]">Alignment %</span>
                  </div>
                </div>

                {/* Score Progress Bar */}
                <div className="h-3 w-full bg-[#EAF3FA] rounded-full overflow-hidden border border-[#DFE6ED]">
                  <div
                    className="h-full bg-[#0E73B9] rounded-full transition-all duration-700"
                    style={{ width: `${gapResult.overall_match_score}%` }}
                  />
                </div>

                <p className="text-xs text-[#738598]">
                  * Calculated strictly against empirical skill frequency weights for {gapResult.target_role}.
                </p>
              </div>

              {/* GAP CATEGORIZATION GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Already Covered */}
                <div className="prof-card rounded-2xl p-5 space-y-2.5 bg-white border border-[#DFE6ED] shadow-card">
                  <h4 className="text-xs font-bold text-[#18B29C] flex items-center gap-2 font-heading">
                    <CheckCircle2 className="w-4 h-4 text-[#18B29C]" /> Already Covered ({gapResult.already_covered.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {gapResult.already_covered.map((skill) => (
                      <span key={skill} className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#18B29C]/10 text-[#18B29C] border border-[#18B29C]/20">
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* High Priority Gaps */}
                <div className="prof-card rounded-2xl p-5 space-y-2.5 bg-white border border-[#DFE6ED] shadow-card">
                  <h4 className="text-xs font-bold text-[#EE6C4D] flex items-center gap-2 font-heading">
                    <AlertCircle className="w-4 h-4 text-[#EE6C4D]" /> High Priority Gaps ({gapResult.high_priority_gaps.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {gapResult.high_priority_gaps.map((skill) => (
                      <span key={skill} className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#EE6C4D]/10 text-[#EE6C4D] border border-[#EE6C4D]/20">
                        ! {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Medium Priority Gaps */}
                <div className="prof-card rounded-2xl p-5 space-y-2.5 bg-white border border-[#DFE6ED] shadow-card">
                  <h4 className="text-xs font-bold text-[#0084E2] flex items-center gap-2 font-heading">
                    <Sparkles className="w-4 h-4 text-[#0084E2]" /> Medium Priority Gaps ({gapResult.medium_priority_gaps.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {gapResult.medium_priority_gaps.map((skill) => (
                      <span key={skill} className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#0084E2]/10 text-[#0084E2] border border-[#0084E2]/20">
                        → {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Optional / Lower Priority */}
                <div className="prof-card rounded-2xl p-5 space-y-2.5 bg-white border border-[#DFE6ED] shadow-card">
                  <h4 className="text-xs font-bold text-[#738598] flex items-center gap-2 font-heading">
                    <Layers className="w-4 h-4 text-[#738598]" /> Optional Gaps ({gapResult.optional_gaps.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {gapResult.optional_gaps.map((skill) => (
                      <span key={skill} className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#EAF3FA] text-[#738598] border border-[#DFE6ED]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* ACTION CTA TO ROADMAP */}
              <div className="prof-panel rounded-2xl p-6 border border-[#DFE6ED] bg-white shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold text-[#1A2D42] font-heading">Generate Stage-by-Stage Learning Roadmap</h4>
                  <p className="text-xs text-[#738598] mt-0.5">Receive structured learning stages with project recommendations.</p>
                </div>
                <button
                  onClick={() => navigate(`/roadmap?role=${targetRole}&skills=${encodeURIComponent(userSkills.join(','))}`)}
                  className="w-full sm:w-auto px-6 py-3 bg-[#0E73B9] hover:bg-[#0084E2] text-white rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-card transition-all"
                >
                  <span>Build My Roadmap</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
