import React from 'react';
import { TrendData } from '../types';
import { TrendingUp, Sparkles, Zap } from 'lucide-react';

interface TrendChartProps {
  trendData: TrendData;
}

export const TrendChart: React.FC<TrendChartProps> = ({ trendData }) => {
  const { top_growing_skills, emerging_skills } = trendData;

  return (
    <div className="space-y-6">
      
      {/* Emerging Tech Badges */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Emerging Technical Stack</span>
        </h4>
        <div className="flex flex-wrap gap-2">
          {emerging_skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20"
            >
              <TrendingUp className="w-3 h-3 text-blue-400" />
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Growth Trajectory Ranking */}
      <div className="space-y-2.5 pt-2 border-t border-slate-800">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>Fastest Growing Demand Trajectory (+Delta)</span>
        </h4>
        <div className="space-y-2">
          {top_growing_skills.slice(0, 5).map((item) => (
            <div
              key={item.skill}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800"
            >
              <span className="text-xs font-bold text-slate-200">{item.skill}</span>

              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-xs">
                  +{item.growth_delta}% growth
                </span>
                <span className="text-xs text-slate-400 font-mono">({item.current_pct}% target)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
