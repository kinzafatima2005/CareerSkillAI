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
        <h4 className="text-xs font-bold text-[#738598] uppercase tracking-wider flex items-center gap-1.5 font-heading">
          <Sparkles className="w-3.5 h-3.5 text-[#0084E2]" />
          <span>Emerging Technical Stack</span>
        </h4>
        <div className="flex flex-wrap gap-2">
          {emerging_skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF3FA] text-[#0E73B9] border border-[#0E73B9]/20"
            >
              <TrendingUp className="w-3 h-3 text-[#0084E2]" />
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Growth Trajectory Ranking */}
      <div className="space-y-2.5 pt-4 border-t border-[#DFE6ED]">
        <h4 className="text-xs font-bold text-[#738598] uppercase tracking-wider flex items-center gap-1.5 font-heading">
          <Zap className="w-3.5 h-3.5 text-[#18B29C]" />
          <span>Fastest Growing Demand Trajectory (+Delta)</span>
        </h4>
        <div className="space-y-2">
          {top_growing_skills.slice(0, 5).map((item) => (
            <div
              key={item.skill}
              className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#DFE6ED] shadow-card hover:border-[#0084E2] transition-colors"
            >
              <span className="text-xs font-bold text-[#1A2D42]">{item.skill}</span>

              <div className="flex items-center gap-3">
                <span className="px-3 py-0.5 rounded-full bg-[#18B29C]/10 text-[#18B29C] border border-[#18B29C]/20 font-bold text-xs">
                  +{item.growth_delta}% growth
                </span>
                <span className="text-xs text-[#738598] font-mono">({item.current_pct}% target)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
