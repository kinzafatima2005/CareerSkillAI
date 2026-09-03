export interface RoleSummary {
  name: string;
  normalized_key: string;
  job_count: number;
  top_skills: string[];
}

export interface SkillDemandItem {
  skill: string;
  count: number;
  percentage: number;
  demand_score: number;
  demand_tier: 'High' | 'Medium' | 'Optional';
}

export interface TrendData {
  years: string[];
  trends: Record<string, Record<string, number>>;
  top_growing_skills: Array<{ skill: string; growth_delta: number; current_pct: number }>;
  emerging_skills: string[];
}

export interface SalaryInsightItem {
  skill: string;
  median_salary: number;
  sample_count: number;
  premium_vs_role_median: number;
  insight_text: string;
}

export interface SalaryData {
  has_salary_data: boolean;
  role_median_salary?: number;
  sample_size?: number;
  disclaimer: string;
  top_paying_skills: SalaryInsightItem[];
}

export interface SkillGapResponse {
  target_role: string;
  overall_match_score: number;
  already_covered: string[];
  high_priority_gaps: string[];
  medium_priority_gaps: string[];
  optional_gaps: string[];
}

export interface RoadmapStage {
  stage: number;
  skill: string;
  category: string;
  status: 'Already Completed' | 'Learn Next';
  priority: 'High Priority' | 'Medium Priority' | 'Optional';
  project_recommendation?: string;
}

export interface RoadmapResponse {
  target_role: string;
  total_stages: number;
  completed_stages: number;
  stages: RoadmapStage[];
}

export interface SkillCategoryItem {
  name: string;
  category: string;
}
