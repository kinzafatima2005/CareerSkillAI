import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Map, Download, CheckCircle2, Trophy, Check, ChevronRight,
  LayoutGrid, GitCommit, Sparkles, ArrowRight, ShieldCheck, RefreshCw
} from 'lucide-react';
import { fetchRoles, fetchRoadmap } from '../services/api';
import { RoleSummary, RoadmapResponse, RoadmapStage } from '../types';
import { useUserSkills } from '../utils/userSkillsStorage';

export const RoadmapPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const initialRole = searchParams.get('role') || 'ai-engineer';
  const [userSkills] = useUserSkills();

  const [roles, setRoles] = useState<RoleSummary[]>([]);
  const [targetRole, setTargetRole] = useState(initialRole);
  const [roadmapData, setRoadmapData] = useState<RoadmapResponse | null>(null);
  const [localStages, setLocalStages] = useState<RoadmapStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');

  useEffect(() => {
    fetchRoles().then(setRoles);
  }, []);

  useEffect(() => {
    if (targetRole) {
      setLoading(true);
      fetchRoadmap(targetRole, userSkills)
        .then((data) => {
          setRoadmapData(data);
          setLocalStages(data.stages || []);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [targetRole]);

  const toggleStageCompletion = (skillName: string) => {
    setLocalStages((prev) =>
      prev.map((s) => {
        if (s.skill === skillName) {
          const isDone = s.status === 'Already Completed';
          return {
            ...s,
            status: isDone ? 'Learn Next' : 'Already Completed'
          };
        }
        return s;
      })
    );
  };

  const completedCount = localStages.filter((s) => s.status === 'Already Completed').length;
  const totalCount = localStages.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleDownloadJSON = () => {
    if (!roadmapData) return;
    const exportPayload = {
      ...roadmapData,
      completed_stages: completedCount,
      completion_percentage: progressPercent,
      stages: localStages
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `career-roadmap-${targetRole}.json`;
    a.click();
  };

  const currentRoleName = roles.find((r) => r.normalized_key === targetRole)?.name || targetRole;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in-up">
      
      {/* Header Banner */}
      <div className="prof-panel rounded-2xl p-6 sm:p-8 border border-[#DFE6ED] bg-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden group">
        
        {/* Subtle decorative background glow */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br from-[#0E73B9]/10 via-[#0084E2]/5 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />

        <div className="space-y-2 relative z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A2D42] font-heading tracking-tight">
            Personalized Career Execution Roadmap
          </h1>
          <p className="text-xs text-[#738598] max-w-2xl leading-relaxed">
            Tailored learning path specifically generated for <strong className="text-[#1A2D42]">{currentRoleName}</strong> based on empirical job market analytics and your verified skills.
          </p>
        </div>

        {/* Target Role Selector & Export */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto relative z-10">
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="px-4 py-2.5 prof-input rounded-full text-[#1A2D42] text-xs font-semibold focus:outline-none bg-white border border-[#DFE6ED] shadow-xs cursor-pointer hover:border-[#0084E2] transition-colors"
          >
            {roles.map((r) => (
              <option key={r.normalized_key} value={r.normalized_key} className="bg-white text-[#1A2D42]">
                {r.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleDownloadJSON}
            className="px-4 py-2.5 bg-white hover:bg-[#EAF3FA] text-[#1A2D42] border border-[#DFE6ED] rounded-full text-xs font-bold flex items-center gap-2 shrink-0 transition-all shadow-xs hover:border-[#0E73B9] hover:shadow-card active:scale-95"
          >
            <Download className="w-4 h-4 text-[#738598]" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>
        </div>

      </div>

      {/* DYNAMIC PROGRESS & CONTROLS BAR */}
      <section className="prof-panel p-6 rounded-2xl border border-[#DFE6ED] bg-white shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#1A2D42] font-heading">
                {currentRoleName} Learning Sequence
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF3FA] text-[#0E73B9] border border-[#0E73B9]/20">
                {totalCount} Skill Stages
              </span>
            </div>
            <p className="text-xs text-[#738598] mt-0.5">
              Click any stage card to toggle your completion status and track progress in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* View Mode Switcher */}
            <div className="flex items-center p-1 bg-[#F4F7FA] border border-[#DFE6ED] rounded-full">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-[#0E73B9] shadow-card border border-[#DFE6ED]'
                    : 'text-[#738598] hover:text-[#1A2D42]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid View</span>
              </button>

              <button
                onClick={() => setViewMode('timeline')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  viewMode === 'timeline'
                    ? 'bg-white text-[#0E73B9] shadow-card border border-[#DFE6ED]'
                    : 'text-[#738598] hover:text-[#1A2D42]'
                }`}
              >
                <GitCommit className="w-3.5 h-3.5" />
                <span>Timeline Path</span>
              </button>
            </div>

            {/* Overall Progress Badge */}
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs text-[#18B29C] font-bold bg-[#18B29C]/10 px-3.5 py-1.5 rounded-full border border-[#18B29C]/20 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-[#18B29C]" />
                <span>{completedCount} of {totalCount} Verified ({progressPercent}%)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full bg-[#EAF3FA] rounded-full h-2.5 overflow-hidden border border-[#DFE6ED]">
          <div
            className="bg-gradient-to-r from-[#0E73B9] via-[#0084E2] to-[#18B29C] h-full rounded-full transition-all duration-700 ease-out relative"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>
      </section>

      {/* ROADMAP CONTENT AREA */}
      {loading ? (
        /* Skeleton Shimmer Grid Loading State */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="p-5 rounded-2xl border border-[#DFE6ED] bg-white shadow-card space-y-4 skeleton-shimmer"
            >
              <div className="flex justify-between items-center">
                <div className="h-4 w-16 bg-[#DFE6ED] rounded-full" />
                <div className="h-3 w-12 bg-[#DFE6ED] rounded-full" />
              </div>
              <div className="h-5 w-3/4 bg-[#DFE6ED] rounded-md" />
              <div className="h-3 w-1/2 bg-[#DFE6ED] rounded-md" />
              <div className="h-12 w-full bg-[#DFE6ED]/60 rounded-xl" />
            </div>
          ))}
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW MODE WITH STAGGERED ENTRANCE */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {localStages.map((stage, idx) => {
            const isCompleted = stage.status === 'Already Completed';
            const isHighPriority = stage.priority === 'High Priority';
            const isMediumPriority = stage.priority === 'Medium Priority';

            return (
              <div
                key={stage.skill}
                onClick={() => toggleStageCompletion(stage.skill)}
                style={{ animationDelay: `${idx * 60}ms` }}
                className={`animate-fade-in-up p-5 rounded-2xl border cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5 ${
                  isCompleted
                    ? 'border-[#18B29C]/50 bg-gradient-to-br from-[#18B29C]/10 to-white text-[#1A2D42] shadow-card hover:border-[#18B29C]'
                    : isHighPriority
                    ? 'border-[#EE6C4D]/40 bg-gradient-to-br from-[#EE6C4D]/5 to-white text-[#1A2D42] shadow-card hover:border-[#EE6C4D]'
                    : isMediumPriority
                    ? 'border-[#0084E2]/30 bg-gradient-to-br from-[#EAF3FA] to-white text-[#1A2D42] shadow-card hover:border-[#0084E2]'
                    : 'border-[#DFE6ED] bg-white text-[#1A2D42] shadow-card hover:border-[#0E73B9]'
                } hover:shadow-xl flex flex-col justify-between relative group space-y-3.5`}
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#DFE6ED] text-[#0E73B9] font-mono text-[10px] shadow-xs group-hover:border-[#0E73B9] transition-colors">
                    Stage {stage.stage}
                  </span>

                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-[#18B29C] font-extrabold text-[10px] bg-[#18B29C]/15 px-2 py-0.5 rounded-full border border-[#18B29C]/30 animate-pop-in">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Verified
                    </span>
                  ) : isHighPriority ? (
                    <span className="flex items-center gap-1 text-[#EE6C4D] font-extrabold text-[10px] bg-[#EE6C4D]/10 px-2 py-0.5 rounded-full border border-[#EE6C4D]/30 animate-pulse-glow">
                      High Priority
                    </span>
                  ) : (
                    <span className="text-[#0084E2] font-semibold text-[10px] bg-[#0084E2]/10 px-2 py-0.5 rounded-full">
                      {stage.priority}
                    </span>
                  )}
                </div>

                {/* Title & Category */}
                <div>
                  <h4 className="text-sm font-extrabold text-[#1A2D42] font-heading group-hover:text-[#0E73B9] transition-colors flex items-center justify-between">
                    <span>{stage.skill}</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-between transition-colors ${
                      isCompleted ? 'bg-[#18B29C] border-[#18B29C] text-white' : 'border-[#DFE6ED] group-hover:border-[#0084E2]'
                    }`}>
                      {isCompleted && <Check className="w-3 h-3 stroke-[3] mx-auto" />}
                    </div>
                  </h4>
                  <p className="text-[11px] text-[#738598] mt-0.5 font-medium">
                    Category: {stage.category}
                  </p>
                </div>

                {/* Project Recommendation */}
                {stage.project_recommendation && (
                  <div className="p-3 rounded-xl bg-white/90 border border-[#DFE6ED] space-y-0.5 text-[11px] shadow-xs group-hover:border-[#DFE6ED]/80 transition-colors">
                    <span className="font-extrabold text-[#0E73B9] text-[10px] block uppercase tracking-wider">Recommended Project:</span>
                    <p className="text-[#1A2D42] leading-relaxed font-medium">{stage.project_recommendation}</p>
                  </div>
                )}

                {/* Learning Resources */}
                {stage.learning_resources && stage.learning_resources.length > 0 && (
                  <div className="pt-2 border-t border-[#DFE6ED] space-y-1.5" onClick={(e) => e.stopPropagation()}>
                    <span className="text-[10px] font-bold text-[#738598] uppercase tracking-wider block">Learning Resources:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {stage.learning_resources.slice(0, 2).map((res) => (
                        <a
                          key={res.title}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#EAF3FA] text-[#0E73B9] hover:bg-[#0E73B9] hover:text-white transition-all duration-200 border border-[#DFE6ED] hover:scale-105"
                        >
                          <span>{res.platform}</span>
                          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* FINAL SUCCESS CARD */}
          <div className="animate-fade-in-up p-5 rounded-2xl border border-[#EE6C4D]/40 bg-gradient-to-br from-[#EE6C4D]/15 via-white to-[#EE6C4D]/5 text-[#1A2D42] shadow-card flex flex-col justify-between space-y-4 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="px-2.5 py-0.5 rounded-full bg-[#EE6C4D] text-white font-extrabold uppercase text-[9px] tracking-wider shadow-xs">
                TARGET GOAL
              </span>
              <Trophy className="w-5 h-5 text-[#EE6C4D] animate-bounce" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-[#1A2D42] font-heading">
                {currentRoleName} Market Readiness
              </h4>
              <p className="text-[11px] text-[#738598] mt-1 leading-snug">
                Complete all skill stages to unlock 100% job readiness certification.
              </p>
            </div>
            <div className="pt-3 border-t border-[#EE6C4D]/30 flex items-center justify-between text-[10px] text-[#EE6C4D] font-extrabold">
              <span>{progressPercent}% Complete</span>
              <CheckCircle2 className="w-4 h-4 text-[#EE6C4D]" />
            </div>
          </div>
        </div>
      ) : (
        /* STEPPER TIMELINE PATH VIEW MODE */
        <div className="prof-panel p-6 sm:p-8 rounded-2xl border border-[#DFE6ED] bg-white shadow-card relative">
          
          {/* Vertical Connecting Line */}
          <div className="absolute left-10 sm:left-12 top-12 bottom-12 w-0.5 bg-gradient-to-b from-[#0E73B9] via-[#0084E2] to-[#18B29C] rounded-full" />

          <div className="space-y-8 relative">
            {localStages.map((stage, idx) => {
              const isCompleted = stage.status === 'Already Completed';
              const isHighPriority = stage.priority === 'High Priority';

              return (
                <div
                  key={stage.skill}
                  style={{ animationDelay: `${idx * 70}ms` }}
                  onClick={() => toggleStageCompletion(stage.skill)}
                  className="animate-fade-in-up flex items-start gap-4 sm:gap-6 group cursor-pointer"
                >
                  {/* Step Timeline Node */}
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 transition-all duration-300 shadow-md ${
                    isCompleted
                      ? 'bg-[#18B29C] text-white ring-4 ring-[#18B29C]/20 scale-110 animate-teal-pulse'
                      : isHighPriority
                      ? 'bg-[#EE6C4D] text-white ring-4 ring-[#EE6C4D]/20 animate-pulse-glow'
                      : 'bg-[#0E73B9] text-white ring-4 ring-[#0E73B9]/15 group-hover:scale-110'
                  }`}>
                    {isCompleted ? <Check className="w-5 h-5 stroke-[3]" /> : idx + 1}
                  </div>

                  {/* Card Content Body */}
                  <div className={`flex-1 p-5 rounded-2xl border transition-all duration-300 transform group-hover:-translate-y-1 ${
                    isCompleted
                      ? 'border-[#18B29C]/40 bg-[#18B29C]/5'
                      : isHighPriority
                      ? 'border-[#EE6C4D]/30 bg-[#EE6C4D]/5'
                      : 'border-[#DFE6ED] bg-white hover:border-[#0E73B9]'
                  } shadow-card group-hover:shadow-lg space-y-3`}>
                    
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#0E73B9] px-2.5 py-0.5 rounded-full bg-[#EAF3FA] border border-[#DFE6ED]">
                          Stage {stage.stage}
                        </span>
                        <h4 className="text-base font-extrabold text-[#1A2D42] font-heading group-hover:text-[#0E73B9] transition-colors">
                          {stage.skill}
                        </h4>
                      </div>

                      {isCompleted ? (
                        <span className="flex items-center gap-1 text-[#18B29C] font-extrabold text-xs bg-[#18B29C]/15 px-3 py-1 rounded-full border border-[#18B29C]/30">
                          <Check className="w-3.5 h-3.5 stroke-[3]" /> Skill Mastered
                        </span>
                      ) : isHighPriority ? (
                        <span className="text-[#EE6C4D] font-extrabold text-xs bg-[#EE6C4D]/10 px-3 py-1 rounded-full border border-[#EE6C4D]/30 animate-pulse">
                          High Priority Requirement
                        </span>
                      ) : (
                        <span className="text-[#0084E2] font-bold text-xs bg-[#0084E2]/10 px-3 py-1 rounded-full">
                          {stage.priority}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#738598]">
                      Category: <strong className="text-[#1A2D42]">{stage.category}</strong>
                    </p>

                    {stage.project_recommendation && (
                      <div className="p-3 rounded-xl bg-white border border-[#DFE6ED] text-xs space-y-1">
                        <span className="font-extrabold text-[#0E73B9] text-[10px] uppercase tracking-wider block">Recommended Portfolio Hands-on Project:</span>
                        <p className="text-[#1A2D42] font-medium leading-relaxed">{stage.project_recommendation}</p>
                      </div>
                    )}

                    {stage.learning_resources && stage.learning_resources.length > 0 && (
                      <div className="pt-2 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <span className="text-[11px] font-bold text-[#738598]">Resources:</span>
                        <div className="flex flex-wrap gap-2">
                          {stage.learning_resources.map((res) => (
                            <a
                              key={res.title}
                              href={res.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#EAF3FA] text-[#0E73B9] hover:bg-[#0E73B9] hover:text-white transition-all border border-[#DFE6ED]"
                            >
                              <span>{res.platform}</span>
                              <ChevronRight className="w-3 h-3" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

export default RoadmapPage;

