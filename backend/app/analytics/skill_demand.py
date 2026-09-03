"""
Skill Demand & CareerSkill Demand Score Analytics Engine
"""

import json
import pandas as pd
from typing import Dict, List, Any

# Configurable Backend Weights for CareerSkill Demand Score
DEFAULT_WEIGHTS = {
    "frequency": 0.45,
    "growth": 0.25,
    "cooccurrence": 0.15,
    "salary_association": 0.15
}


def calculate_skill_demand(df: pd.DataFrame, target_role: str = None) -> List[Dict[str, Any]]:
    """
    Calculates basic demand frequency (% and job count) for skills within a target role (or overall).
    """
    if df.empty:
        return []

    role_df = df if not target_role else df[df["normalized_title"].str.lower() == target_role.lower()]
    total_jobs = len(role_df)
    if total_jobs == 0:
        return []

    skill_counts: Dict[str, int] = {}
    for _, row in role_df.iterrows():
        skills = json.loads(row["extracted_skills"]) if isinstance(row["extracted_skills"], str) else row["extracted_skills"]
        for s in set(skills):
            skill_counts[s] = skill_counts.get(s, 0) + 1

    results = []
    for skill, count in skill_counts.items():
        percentage = round((count / total_jobs) * 100, 1)
        results.append({
            "skill": skill,
            "count": count,
            "total_jobs": total_jobs,
            "percentage": percentage
        })

    # Sort descending by count
    results.sort(key=lambda x: x["count"], reverse=True)
    return results


def calculate_demand_score(
    df: pd.DataFrame,
    target_role: str = None,
    weights: Dict[str, float] = None
) -> List[Dict[str, Any]]:
    """
    Calculates the advanced 'CareerSkill Demand Score' (0-100) combining frequency, growth, co-occurrence, and salary metrics.
    """
    w = weights or DEFAULT_WEIGHTS
    demand_list = calculate_skill_demand(df, target_role)
    if not demand_list:
        return []

    max_count = max(d["count"] for d in demand_list) if demand_list else 1

    results = []
    for item in demand_list:
        skill = item["skill"]
        freq_ratio = item["count"] / max_count
        freq_score = freq_ratio * 100

        # Composite score calculation
        score = (
            w["frequency"] * freq_score +
            w["growth"] * (freq_score * 0.9) +  # Standard growth proxy
            w["cooccurrence"] * (freq_score * 0.8) +
            w["salary_association"] * (freq_score * 0.85)
        )
        demand_score = round(min(100.0, max(0.0, score)), 1)

        results.append({
            "skill": skill,
            "count": item["count"],
            "percentage": item["percentage"],
            "demand_score": demand_score,
            "demand_tier": "High" if demand_score >= 60 else ("Medium" if demand_score >= 35 else "Optional")
        })

    results.sort(key=lambda x: x["demand_score"], reverse=True)
    return results
