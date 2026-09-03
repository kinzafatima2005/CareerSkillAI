import {
  RoleSummary,
  SkillDemandItem,
  TrendData,
  SalaryData,
  SkillGapResponse,
  RoadmapResponse,
  SkillCategoryItem,
} from '../types';

const API_BASE = '/api';

export async function fetchRoles(): Promise<RoleSummary[]> {
  try {
    const res = await fetch(`${API_BASE}/roles`);
    if (!res.ok) throw new Error('Failed to fetch roles');
    return await res.json();
  } catch (err) {
    console.error('API Error:', err);
    // Fallback mock data if server offline
    return [
      { name: 'AI Engineer', normalized_key: 'ai-engineer', job_count: 53, top_skills: ['AWS', 'Azure', 'GCP'] },
      { name: 'Machine Learning Engineer', normalized_key: 'machine-learning-engineer', job_count: 92, top_skills: ['Python', 'PyTorch', 'Docker'] },
      { name: 'Data Scientist', normalized_key: 'data-scientist', job_count: 57, top_skills: ['Python', 'SQL', 'Statistics'] },
      { name: 'Data Engineer', normalized_key: 'data-engineer', job_count: 65, top_skills: ['SQL', 'Spark', 'AWS'] },
      { name: 'Software Engineer', normalized_key: 'software-engineer', job_count: 63, top_skills: ['Python', 'FastAPI', 'Docker'] },
    ];
  }
}

export async function fetchRoleOverview(roleSlug: string) {
  const res = await fetch(`${API_BASE}/roles/${roleSlug}`);
  if (!res.ok) throw new Error(`Failed to fetch role overview for ${roleSlug}`);
  return await res.json();
}

export async function fetchRoleSkills(roleSlug: string): Promise<{ role_name: string; skills: SkillDemandItem[] }> {
  const res = await fetch(`${API_BASE}/roles/${roleSlug}/skills`);
  if (!res.ok) throw new Error(`Failed to fetch skills for ${roleSlug}`);
  return await res.json();
}

export async function fetchRoleTrends(roleSlug: string): Promise<TrendData> {
  const res = await fetch(`${API_BASE}/roles/${roleSlug}/trends`);
  if (!res.ok) throw new Error(`Failed to fetch trends for ${roleSlug}`);
  return await res.json();
}

export async function fetchRoleSalary(roleSlug: string): Promise<SalaryData> {
  const res = await fetch(`${API_BASE}/roles/${roleSlug}/salary`);
  if (!res.ok) throw new Error(`Failed to fetch salary for ${roleSlug}`);
  return await res.json();
}

export async function fetchAllSkills(): Promise<SkillCategoryItem[]> {
  try {
    const res = await fetch(`${API_BASE}/skills`);
    if (!res.ok) throw new Error('Failed to fetch skills taxonomy');
    return await res.json();
  } catch (err) {
    return [
      { name: 'Python', category: 'Languages' },
      { name: 'SQL', category: 'Languages' },
      { name: 'PyTorch', category: 'Deep Learning' },
      { name: 'Docker', category: 'DevOps & Cloud' },
      { name: 'AWS', category: 'Cloud Platform' },
      { name: 'LLMs', category: 'Generative AI' },
      { name: 'RAG', category: 'Generative AI' },
      { name: 'FastAPI', category: 'Web & APIs' },
    ];
  }
}

export async function computeSkillGap(targetRole: string, userSkills: string[]): Promise<SkillGapResponse> {
  const res = await fetch(`${API_BASE}/skill-gap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ target_role: targetRole, user_skills: userSkills }),
  });
  if (!res.ok) throw new Error('Failed to calculate skill gap');
  return await res.json();
}

export async function fetchRoadmap(targetRole: string, userSkills: string[]): Promise<RoadmapResponse> {
  const res = await fetch(`${API_BASE}/roadmap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ target_role: targetRole, user_skills: userSkills }),
  });
  if (!res.ok) throw new Error('Failed to generate roadmap');
  return await res.json();
}
