import React from 'react';
import { SkillDemandItem } from '../types';

interface SkillBarChartProps {
  skills: SkillDemandItem[];
  maxDisplay?: number;
}

export const SkillBarChart: React.FC<SkillBarChartProps> = ({ skills, maxDisplay = 10 }) => {
  const displaySkills = skills.slice(0, maxDisplay);

  return (
    <div className="space-y-3.5">
      {displaySkills.map((item, idx) => {
        const isTop = idx === 0;

        return (
          <div key={item.skill} className="space-y-1.5 p-2 rounded-lg hover:bg-slate-800/40 transition-colors">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              
              <div className="flex items-center gap-2.5">
                <span className="w-5 text-slate-500 font-mono text-xs font-semibold">
                  #{idx + 1}
                </span>

                <span className="font-bold text-slate-100 hover:text-blue-400 transition-colors">
                  {item.skill}
                </span>

                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                  item.demand_tier === 'High'
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    : item.demand_tier === 'Medium'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  Score: {item.demand_score}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="font-mono text-slate-400 hidden sm:inline">{item.count} jobs</span>
                <span className="text-blue-400 font-bold bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/50">
                  {item.percentage}%
                </span>
              </div>

            </div>

            {/* Bar Container */}
            <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, Math.max(4, item.percentage))}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
