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
          <div key={item.skill} className="space-y-1.5 p-2 rounded-xl hover:bg-[#EAF3FA] transition-colors">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              
              <div className="flex items-center gap-2.5">
                <span className="w-5 text-[#738598] font-mono text-xs font-semibold">
                  #{idx + 1}
                </span>

                <span className="font-bold text-[#1A2D42] hover:text-[#0E73B9] transition-colors">
                  {item.skill}
                </span>

                <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                  item.demand_tier === 'High'
                    ? 'bg-[#EAF3FA] text-[#0E73B9] border-[#0E73B9]/30'
                    : item.demand_tier === 'Medium'
                    ? 'bg-[#0084E2]/10 text-[#0084E2] border-[#0084E2]/30'
                    : 'bg-[#EAF3FA] text-[#738598] border-[#DFE6ED]'
                }`}>
                  Score: {item.demand_score}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="font-mono text-[#738598] hidden sm:inline">{item.count} jobs</span>
                <span className="text-[#0E73B9] font-bold bg-[#EAF3FA] px-2.5 py-0.5 rounded-full border border-[#DFE6ED]">
                  {item.percentage}%
                </span>
              </div>

            </div>

            {/* Bar Container */}
            <div className="h-2.5 w-full bg-[#EAF3FA] rounded-full overflow-hidden border border-[#DFE6ED]">
              <div
                className="h-full bg-gradient-to-r from-[#0E73B9] to-[#0084E2] rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, Math.max(4, item.percentage))}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
