from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field


class RoleSummary(BaseModel):
    name: str
    normalized_key: str
    job_count: int
    top_skills: List[str]


class SkillDemandResponse(BaseModel):
    skill: str
    count: int
    percentage: float
    demand_score: float
    demand_tier: str


class TrendResponse(BaseModel):
    years: List[str]
    trends: Dict[str, Dict[str, float]]
    top_growing_skills: List[Dict[str, Any]]
    emerging_skills: List[str]


class SalaryInsightItem(BaseModel):
    skill: str
    median_salary: float
    sample_count: int
    premium_vs_role_median: float
    insight_text: str


class SalaryResponse(BaseModel):
    has_salary_data: bool
    role_median_salary: Optional[float] = None
    sample_size: Optional[int] = None
    disclaimer: str
    top_paying_skills: List[SalaryInsightItem]


class SkillGapRequest(BaseModel):
    target_role: str
    user_skills: List[str]


class SkillGapResponse(BaseModel):
    target_role: str
    overall_match_score: float
    already_covered: List[str]
    high_priority_gaps: List[str]
    medium_priority_gaps: List[str]
    optional_gaps: List[str]


class RoadmapStage(BaseModel):
    stage: int
    skill: str
    category: str
    status: str  # "Already Completed" or "Learn Next"
    priority: str  # "High Priority", "Medium Priority", "Optional"
    project_recommendation: Optional[str] = None


class RoadmapRequest(BaseModel):
    target_role: str
    user_skills: List[str]


class RoadmapResponse(BaseModel):
    target_role: str
    total_stages: int
    completed_stages: int
    stages: List[RoadmapStage]
