import React, { useEffect, useState } from 'react';
import { TrendingUp, Sparkles, Layers, Zap } from 'lucide-react';
import { fetchRoleTrends, fetchRoles } from '../services/api';
import { TrendData, RoleSummary } from '../types';
import { TrendChart } from '../components/TrendChart';

export const TrendsPage: React.FC = () => {
  const [roles, setRoles] = useState<RoleSummary[]>([]);
  const [selectedRole, setSelectedRole] = useState('ai-engineer');
  const [trendData, setTrendData] = useState<TrendData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoles().then((data) => {
      setRoles(data);
      if (data.length > 0) setSelectedRole(data[0].normalized_key);
    });
  }, []);

  useEffect(() => {
    if (selectedRole) {
      setLoading(true);
      fetchRoleTrends(selectedRole)
        .then(setTrendData)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [selectedRole]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="prof-panel rounded-2xl p-6 sm:p-8 border border-[#DFE6ED] bg-white shadow-card space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAF3FA] text-[#0E73B9] text-xs font-bold border border-[#0E73B9]/20">
          <TrendingUp className="w-3.5 h-3.5" /> Trajectory & Growth Analytics
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A2D42] font-heading">Demand Trajectories & Emerging Tech</h1>
        <p className="text-xs sm:text-sm text-[#738598] max-w-xl leading-relaxed">
          Track how technical skill demand evolves over time across canonical AI, Data Science, DevOps, and Engineering roles.
        </p>
      </div>

      {/* Role Selection Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-[#DFE6ED] pb-4">
        {roles.map((r) => (
          <button
            key={r.normalized_key}
            onClick={() => setSelectedRole(r.normalized_key)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
              selectedRole === r.normalized_key
                ? 'bg-[#0E73B9] text-white shadow-sm'
                : 'bg-white text-[#738598] hover:text-[#1A2D42] hover:bg-[#EAF3FA] border border-[#DFE6ED]'
            }`}
          >
            {r.name}
          </button>
        ))}
      </div>

      {loading || !trendData ? (
        <div className="prof-panel rounded-2xl p-16 text-center text-[#738598] text-xs font-medium">
          Calculating skill growth trajectory metrics...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="prof-panel rounded-2xl p-6 border border-[#DFE6ED] bg-white shadow-card space-y-6">
            <h3 className="text-lg font-bold text-[#1A2D42] font-heading flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#0084E2]" /> Emerging Technology Growth
            </h3>
            <TrendChart trendData={trendData} />
          </div>

          <div className="prof-panel rounded-2xl p-6 border border-[#DFE6ED] bg-white shadow-card space-y-6">
            <h3 className="text-lg font-bold text-[#1A2D42] font-heading flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#18B29C]" /> Market Trajectory Insights
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white border border-[#DFE6ED] shadow-card space-y-1.5">
                <span className="text-xs font-bold text-[#0E73B9] uppercase tracking-widest block font-heading">
                  Generative AI & LLM Momentum
                </span>
                <p className="text-xs text-[#738598] leading-relaxed">
                  LLM-related skills (RAG, Vector Databases, LangChain, Prompt Engineering) are appearing in an increasing percentage of modern AI and ML Engineer job specifications.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#DFE6ED] shadow-card space-y-1.5">
                <span className="text-xs font-bold text-[#0084E2] uppercase tracking-widest block font-heading">
                  Production Infrastructure Standard
                </span>
                <p className="text-xs text-[#738598] leading-relaxed">
                  FastAPI, Docker, and Cloud infrastructure (AWS/Azure/GCP) co-occur in over 60% of modern production AI and engineering role specifications.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
