import os
import json
import pandas as pd
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from backend.app.database.connection import get_db
from backend.app.models.job import Job, Role
from backend.app.analytics.skill_demand import calculate_skill_demand, calculate_demand_score
from backend.app.analytics.trend_analysis import calculate_skill_trends
from backend.app.analytics.salary_analysis import calculate_salary_insights

router = APIRouter(prefix="/api/roles", tags=["Career Roles"])

DATA_PATH = "data/processed/jobs_with_skills.csv"


def load_dataset() -> pd.DataFrame:
    if os.path.exists(DATA_PATH):
        return pd.read_csv(DATA_PATH)
    return pd.DataFrame()


def slug_to_role_name(slug: str, available_roles: List[str] = None) -> str:
    """Converts 'ai-engineer', 'data-science', or 'ml' to canonical role name."""
    clean = slug.replace("-", " ").replace("_", " ").lower().strip()
    role_map = {
        "ai engineer": "AI Engineer",
        "ai": "AI Engineer",
        "genai": "AI Engineer",
        "genai engineer": "AI Engineer",
        "machine learning engineer": "Machine Learning Engineer",
        "machine learning": "Machine Learning Engineer",
        "ml engineer": "Machine Learning Engineer",
        "ml": "Machine Learning Engineer",
        "data scientist": "Data Scientist",
        "data science": "Data Scientist",
        "data engineer": "Data Engineer",
        "data engineering": "Data Engineer",
        "data analyst": "Data Analyst",
        "data analytics": "Data Analyst",
        "nlp engineer": "NLP Engineer",
        "nlp": "NLP Engineer",
        "computer vision engineer": "Computer Vision Engineer",
        "computer vision": "Computer Vision Engineer",
        "cv engineer": "Computer Vision Engineer",
        "software engineer": "Software Engineer",
        "software developer": "Software Engineer",
        "developer": "Software Engineer",
        "business intelligence analyst": "Business Intelligence Analyst",
        "bi analyst": "Business Intelligence Analyst",
        "bi developer": "Business Intelligence Analyst",
        "bi": "Business Intelligence Analyst",
    }
    if clean in role_map:
        return role_map[clean]

    if available_roles:
        for r in available_roles:
            r_lower = r.lower()
            if clean in r_lower or r_lower in clean:
                return r

    return clean.title()


@router.api_route("", methods=["GET", "HEAD"], response_model=List[Dict[str, Any]])
def list_roles(db: Session = Depends(get_db)):
    """Lists all available career roles with total analyzed job counts."""
    df = load_dataset()
    if df.empty:
        roles_db = db.query(Role).all()
        return [{"name": r.name, "normalized_key": r.name.lower().replace(" ", "-"), "job_count": 0, "top_skills": []} for r in roles_db]

    roles_data = []
    unique_roles = sorted(df["normalized_title"].dropna().unique())

    for rname in unique_roles:
        role_df = df[df["normalized_title"] == rname]
        demands = calculate_skill_demand(df, rname)
        top_3 = [d["skill"] for d in demands[:3]]

        roles_data.append({
            "name": rname,
            "normalized_key": rname.lower().replace(" ", "-"),
            "job_count": len(role_df),
            "top_skills": top_3
        })

    return roles_data


@router.api_route("/{role_slug}", methods=["GET", "HEAD"])
def get_role_overview(role_slug: str):
    """Returns analytics overview summary for a specific career role."""
    df = load_dataset()
    available = df["normalized_title"].dropna().unique().tolist() if not df.empty else []
    role_name = slug_to_role_name(role_slug, available)
    role_df = df[df["normalized_title"].str.lower() == role_name.lower()] if not df.empty else pd.DataFrame()

    if role_df.empty:
        raise HTTPException(
            status_code=404, 
            detail=f"Role '{role_slug}' not found. Available roles: {', '.join(available)}"
        )

    demands = calculate_demand_score(df, role_name)
    trends = calculate_skill_trends(df, role_name)
    top_skill = demands[0]["skill"] if demands else "N/A"
    fastest_growing = trends["top_growing_skills"][0]["skill"] if trends.get("top_growing_skills") else "LLMs"

    return {
        "role_name": role_name,
        "job_count": len(role_df),
        "top_skill": top_skill,
        "fastest_growing_skill": fastest_growing,
        "top_skills_summary": demands[:7],
        "emerging_skills": trends.get("emerging_skills", []),
    }


@router.api_route("/{role_slug}/skills", methods=["GET", "HEAD"])
def get_role_skills(role_slug: str):
    """Returns detailed skill demand scores and frequencies for a role."""
    df = load_dataset()
    available = df["normalized_title"].dropna().unique().tolist() if not df.empty else []
    role_name = slug_to_role_name(role_slug, available)
    demands = calculate_demand_score(df, role_name)
    if not demands:
        raise HTTPException(status_code=404, detail=f"Role '{role_name}' not found.")
    return {"role_name": role_name, "skills": demands}


@router.api_route("/{role_slug}/trends", methods=["GET", "HEAD"])
def get_role_trends(role_slug: str):
    """Returns time-series skill growth trends and emerging technologies."""
    df = load_dataset()
    available = df["normalized_title"].dropna().unique().tolist() if not df.empty else []
    role_name = slug_to_role_name(role_slug, available)
    trends = calculate_skill_trends(df, role_name)
    return {"role_name": role_name, **trends}


@router.api_route("/{role_slug}/salary", methods=["GET", "HEAD"])
def get_role_salary(role_slug: str):
    """Returns salary insights and skill premiums with correlation vs causation disclaimers."""
    df = load_dataset()
    available = df["normalized_title"].dropna().unique().tolist() if not df.empty else []
    role_name = slug_to_role_name(role_slug, available)
    insights = calculate_salary_insights(df, role_name)
    return {"role_name": role_name, **insights}
