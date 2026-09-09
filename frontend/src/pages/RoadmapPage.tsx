import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Map, Download, CheckCircle2, Trophy, Activity, Check, ChevronRight
} from 'lucide-react';
import { fetchRoles, fetchRoadmap } from '../services/api';
import { RoleSummary, RoadmapResponse } from '../types';

export const RoadmapPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const initialRole = searchParams.get('role') || 'data-scientist';
  const initialSkillsParam = searchParams.get('skills');
  const userSkills = initialSkillsParam
    ? initialSkillsParam.split(',').filter(Boolean)
    : ['Python', 'SQL', 'Pandas', 'Docker'];

  const [roles, setRoles] = useState<RoleSummary[]>([]);
  const [targetRole, setTargetRole] = useState(initialRole);
  const [roadmapData, setRoadmapData] = useState<RoadmapResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoles().then(setRoles);
  }, []);

  useEffect(() => {
    if (targetRole) {
      setLoading(true);
      fetchRoadmap(targetRole, userSkills)
        .then(setRoadmapData)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [targetRole]);

  const handleDownloadJSON = () => {
    if (!roadmapData) return;
    const blob = new Blob([JSON.stringify(roadmapData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `career-roadmap-${targetRole}.json`;
    a.click();
  };

  const currentRoleName = roles.find((r) => r.normalized_key === targetRole)?.name || targetRole;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="prof-panel rounded-2xl p-6 sm:p-8 border border-[#DFE6ED] bg-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAF3FA] text-[#0E73B9] text-xs font-bold border border-[#0E73B9]/20">
            <Map className="w-3.5 h-3.5" /> Dynamic Role Roadmap Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A2D42] font-heading">
            Personalized Career Execution Roadmap
          </h1>
          <p className="text-xs text-[#738598]">
            Tailored learning path specifically generated for <strong className="text-[#1A2D42]">{currentRoleName}</strong> based on empirical job postings and your skill profile.
          </p>
        </div>

        {/* Target Role Selector & Export */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="px-4 py-2.5 prof-input rounded-full text-[#1A2D42] text-xs font-semibold focus:outline-none bg-white border border-[#DFE6ED]"
          >
            {roles.map((r) => (
              <option key={r.normalized_key} value={r.normalized_key} className="bg-white text-[#1A2D42]">
                {r.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleDownloadJSON}
            className="px-4 py-2.5 bg-white hover:bg-[#EAF3FA] text-[#1A2D42] border border-[#DFE6ED] rounded-full text-xs font-bold flex items-center gap-2 shrink-0 transition-colors shadow-card"
          >
            <Download className="w-4 h-4 text-[#738598]" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>
        </div>

      </div>

      {/* DYNAMIC STAGE-BY-STAGE ROADMAP */}
      <section className="prof-panel p-6 sm:p-8 rounded-2xl border border-[#DFE6ED] bg-white shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#DFE6ED] pb-4">
          <div>
            <h2 className="text-lg font-bold text-[#1A2D42] font-heading">
              {currentRoleName} Learning Sequence
            </h2>
            <p className="text-xs text-[#738598] mt-0.5">
              Targeted skill acquisition pipeline ordered by prerequisite dependencies and market demand frequency.
            </p>
          </div>

          {roadmapData && (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs text-[#18B29C] font-bold bg-[#18B29C]/10 px-3.5 py-1.5 rounded-full border border-[#18B29C]/20">
                <CheckCircle2 className="w-4 h-4" />
                <span>{roadmapData.completed_stages} of {roadmapData.total_stages} Skills Verified</span>
              </span>
            </div>
          )}
        </div>

        {loading || !roadmapData ? (
          <div className="py-16 text-center text-[#738598] text-xs font-medium">
            Generating customized roadmap sequence for {currentRoleName}...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
            {roadmapData.stages.map((stage) => {
              const isCompleted = stage.status === 'Already Completed';
              const isHighPriority = stage.priority === 'High Priority';
              const isMediumPriority = stage.priority === 'Medium Priority';

              return (
                <div
                  key={stage.skill}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCompleted
                      ? 'border-[#18B29C]/40 bg-[#18B29C]/10 text-[#1A2D42]'
                      : isHighPriority
                      ? 'border-[#EE6C4D]/40 bg-[#EE6C4D]/10 text-[#1A2D42]'
                      : isMediumPriority
                      ? 'border-[#0084E2]/30 bg-[#EAF3FA] text-[#1A2D42]'
                      : 'border-[#DFE6ED] bg-white text-[#1A2D42]'
                  } shadow-card hover:shadow-card-hover flex flex-col justify-between relative group space-y-3`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/90 border border-[#DFE6ED] text-[#0E73B9] font-mono text-[10px] shadow-xs">
                      Stage {stage.stage}
                    </span>
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-[#18B29C] font-bold text-[10px]">
                        <Check className="w-3.5 h-3.5 stroke-[3]" /> Covered
                      </span>
                    ) : isHighPriority ? (
                      <span className="flex items-center gap-1 text-[#EE6C4D] font-bold text-[10px]">
                        High Priority
                      </span>
                    ) : (
                      <span className="text-[#0084E2] font-semibold text-[10px]">
                        {stage.priority}
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-extrabold text-[#1A2D42] font-heading group-hover:text-[#0E73B9] transition-colors">
                      {stage.skill}
                    </h4>
                    <p className="text-[11px] text-[#738598] mt-0.5 font-medium">
                      Category: {stage.category}
                    </p>
                  </div>

                  {stage.project_recommendation && (
                    <div className="p-2.5 rounded-xl bg-white/80 border border-[#DFE6ED] space-y-0.5 text-[11px]">
                      <span className="font-bold text-[#0E73B9] text-[10px] block uppercase tracking-wider">Recommended Project:</span>
                      <p className="text-[#1A2D42] leading-snug font-medium">{stage.project_recommendation}</p>
                    </div>
                  )}

                  {stage.learning_resources && stage.learning_resources.length > 0 && (
                    <div className="pt-2 border-t border-[#DFE6ED] space-y-1">
                      <span className="text-[10px] font-bold text-[#738598] uppercase tracking-wider block">Learning Resources:</span>
                      <div className="flex flex-wrap gap-1">
                        {stage.learning_resources.slice(0, 2).map((res) => (
                          <a
                            key={res.title}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF3FA] text-[#0E73B9] hover:bg-[#0E73B9] hover:text-white transition-colors border border-[#DFE6ED]"
                          >
                            <span>{res.platform}</span>
                            <ChevronRight className="w-3 h-3" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* SUCCESS TROPHY TARGET STEP */}
            <div className="p-4 rounded-2xl border border-[#EE6C4D]/40 bg-[#EE6C4D]/10 text-[#1A2D42] shadow-card flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="px-2.5 py-0.5 rounded-full bg-[#EE6C4D] text-white font-extrabold uppercase text-[9px] tracking-wider">
                  SUCCESS
                </span>
                <Trophy className="w-5 h-5 text-[#EE6C4D]" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-[#1A2D42] font-heading">
                  {currentRoleName} Market Readiness
                </h4>
                <p className="text-[11px] text-[#738598] mt-1 leading-snug">
                  Verified Skill Portfolio & Target Alignment
                </p>
              </div>
              <div className="pt-3 border-t border-[#EE6C4D]/30 flex items-center justify-between text-[10px] text-[#EE6C4D] font-bold">
                <span>Career Target Unlocked</span>
                <CheckCircle2 className="w-4 h-4 text-[#EE6C4D]" />
              </div>
            </div>

          </div>
        )}
      </section>

    </div>
  );
};

export default RoadmapPage;
