"""
Market Trend Analysis Engine for CareerSkill AI
"""

import json
import pandas as pd
from typing import Dict, List, Any


def calculate_skill_trends(df: pd.DataFrame, target_role: str = None) -> Dict[str, Any]:
    """
    Calculates time-series demand trajectory for skills over time (grouped by year/month).
    Identifies top growing, declining, and emerging skills.
    """
    if df.empty:
        return {"trends": {}, "emerging_skills": [], "top_growing_skills": []}

    role_df = df if not target_role else df[df["normalized_title"].str.lower() == target_role.lower()].copy()
    if role_df.empty:
        return {"trends": {}, "emerging_skills": [], "top_growing_skills": []}

    # Ensure posted_date is parsed as datetime
    role_df["year"] = pd.to_datetime(role_df["posted_date"], errors="coerce").dt.year.fillna(2024).astype(int)
    years = sorted(role_df["year"].unique())

    skill_year_counts: Dict[str, Dict[int, int]] = {}
    year_job_totals: Dict[int, int] = role_df["year"].value_counts().to_dict()

    for _, row in role_df.iterrows():
        yr = row["year"]
        skills = json.loads(row["extracted_skills"]) if isinstance(row["extracted_skills"], str) else row["extracted_skills"]
        for s in set(skills):
            if s not in skill_year_counts:
                skill_year_counts[s] = {y: 0 for y in years}
            skill_year_counts[s][yr] = skill_year_counts[s].get(yr, 0) + 1

    trends_data = {}
    growing_skills = []

    for skill, year_data in skill_year_counts.items():
        yearly_pct = {}
        for yr in years:
            total = year_job_totals.get(yr, 1)
            cnt = year_data.get(yr, 0)
            yearly_pct[str(yr)] = round((cnt / total) * 100, 1)

        trends_data[skill] = yearly_pct

        # Growth calculation between earliest and latest year
        if len(years) >= 2:
            first_yr_pct = yearly_pct[str(years[0])]
            last_yr_pct = yearly_pct[str(years[-1])]
            growth_delta = last_yr_pct - first_yr_pct
            growing_skills.append({
                "skill": skill,
                "growth_delta": round(growth_delta, 1),
                "current_pct": last_yr_pct
            })

    growing_skills.sort(key=lambda x: x["growth_delta"], reverse=True)
    emerging = [s["skill"] for s in growing_skills if s["skill"] in ["LLMs", "RAG", "Generative AI", "Vector Databases", "LangChain", "Prompt Engineering"]]

    return {
        "years": [str(y) for y in years],
        "trends": trends_data,
        "top_growing_skills": growing_skills[:5],
        "emerging_skills": emerging
    }
