import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Map, Download, CheckCircle, ArrowRight, Layers, Award, Sparkles, BookOpen } from 'lucide-react';
import { fetchRoles, fetchRoadmap } from '../services/api';
import { RoleSummary, RoadmapResponse, RoadmapStage } from '../types';

export const RoadmapPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const initialRole = searchParams.get('role') || 'ai-engineer';
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="prof-panel rounded-2xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
            <Map className="w-3.5 h-3.5" /> Stage-by-Stage Learning Roadmap
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Career Execution Blueprint
          </h1>
          <p className="text-xs text-slate-400">
            Custom learning sequence structured according to skill dependencies and prerequisite chains.
          </p>
        </div>

        {/* Target Role Selector & Export */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="px-3.5 py-2.5 prof-input rounded-xl text-white text-xs font-semibold focus:outline-none"
          >
            {roles.map((r) => (
              <option key={r.normalized_key} value={r.normalized_key} className="bg-slate-900 text-white">
                {r.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleDownloadJSON}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>
        </div>

      </div>

      {loading || !roadmapData ? (
        <div className="prof-panel rounded-2xl p-16 text-center text-slate-400 text-xs font-medium">
          Generating roadmap timeline graph...
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* OVERVIEW STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="prof-card rounded-xl p-4 text-center space-y-1">
              <span className="text-2xl font-extrabold text-blue-400">{roadmapData.total_stages}</span>
              <span className="text-xs font-bold text-slate-400 block">Total Learning Stages</span>
            </div>
            <div className="prof-card rounded-xl p-4 text-center space-y-1">
              <span className="text-2xl font-extrabold text-emerald-400">{roadmapData.completed_stages}</span>
              <span className="text-xs font-bold text-slate-400 block">Skills Completed</span>
            </div>
            <div className="prof-card rounded-xl p-4 text-center space-y-1">
              <span className="text-2xl font-extrabold text-indigo-400">{roadmapData.target_role}</span>
              <span className="text-xs font-bold text-slate-400 block">Target Role</span>
            </div>
          </div>

          {/* TIMELINE STAGES */}
          <div className="space-y-6 relative before:absolute before:inset-0 before:left-6 sm:before:left-8 before:w-0.5 before:bg-slate-800">
            {roadmapData.stages.map((stage: RoadmapStage) => {
              const isCompleted = stage.status === 'Already Completed';

              return (
                <div key={stage.stage} className="relative pl-12 sm:pl-16 space-y-3">
                  
                  {/* Timeline Node Icon */}
                  <div className={`absolute left-0 top-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-xs shadow-md border ${
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-blue-600 text-white border-blue-500'
                  }`}>
                    {isCompleted ? '✓' : stage.stage}
                  </div>

                  {/* Stage Card */}
                  <div className="prof-panel rounded-2xl p-6 border border-slate-800 space-y-4">
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Stage {stage.stage} • {stage.category}
                        </span>
                        <h3 className="text-lg font-bold text-white mt-0.5">{stage.skill}</h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded text-xs font-bold border ${
                          stage.priority === 'High Priority'
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : stage.priority === 'Medium Priority'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {stage.priority}
                        </span>

                        <span className={`px-2.5 py-1 rounded text-xs font-bold border ${
                          isCompleted
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                          {stage.status}
                        </span>
                      </div>
                    </div>

                    {/* Project Recommendation Blueprint */}
                    {stage.project_recommendation && (
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
                        <div className="flex items-center gap-2 font-bold text-blue-400">
                          <BookOpen className="w-4 h-4" /> Recommended Project Blueprint
                        </div>
                        <p className="text-slate-300 font-semibold">{stage.project_recommendation}</p>
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
