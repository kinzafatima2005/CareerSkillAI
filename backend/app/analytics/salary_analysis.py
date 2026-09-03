"""
Salary Analysis Engine for CareerSkill AI
"""

import json
import pandas as pd
from typing import Dict, List, Any


def calculate_salary_insights(df: pd.DataFrame, target_role: str = None, min_sample_size: int = 2) -> Dict[str, Any]:
    """
    Calculates median advertised salary per role and skill.
    Includes explicit disclaimer: correlation != causation.
    """
    if df.empty:
        return {"has_salary_data": False, "role_median_salary": None, "top_paying_skills": []}

    role_df = df if not target_role else df[df["normalized_title"].str.lower() == target_role.lower()].copy()
    if role_df.empty:
        return {"has_salary_data": False, "role_median_salary": None, "top_paying_skills": []}

    # Filter rows with valid salary
    role_df["mid_salary"] = (role_df["salary_min"] + role_df["salary_max"]) / 2.0
    valid_salary_df = role_df.dropna(subset=["mid_salary"])

    if len(valid_salary_df) < min_sample_size:
        return {
            "has_salary_data": False,
            "disclaimer": "Insufficient salary data available for statistical reporting.",
            "role_median_salary": None,
            "top_paying_skills": []
        }

    overall_median = round(float(valid_salary_df["mid_salary"].median()), -2)

    skill_salaries: Dict[str, List[float]] = {}
    for _, row in valid_salary_df.iterrows():
        sal = row["mid_salary"]
        skills = json.loads(row["extracted_skills"]) if isinstance(row["extracted_skills"], str) else row["extracted_skills"]
        for s in set(skills):
            if s not in skill_salaries:
                skill_salaries[s] = []
            skill_salaries[s].append(sal)

    skill_metrics = []
    for skill, sal_list in skill_salaries.items():
        if len(sal_list) >= 3:
            med_sal = round(float(pd.Series(sal_list).median()), -2)
            diff = med_sal - overall_median
            skill_metrics.append({
                "skill": skill,
                "median_salary": med_sal,
                "sample_count": len(sal_list),
                "premium_vs_role_median": diff,
                "insight_text": f"In this dataset, job postings mentioning {skill} have a median advertised salary of ${med_sal:,.0f}."
            })

    skill_metrics.sort(key=lambda x: x["median_salary"], reverse=True)

    return {
        "has_salary_data": True,
        "role_median_salary": overall_median,
        "sample_size": len(valid_salary_df),
        "disclaimer": "Note: Correlation does not equal causation. Salary differences reflect dataset co-occurrences.",
        "top_paying_skills": skill_metrics[:8]
    }
