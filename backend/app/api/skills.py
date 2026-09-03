import os
import pandas as pd
from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.database.connection import get_db
from backend.app.nlp.skill_taxonomy import SKILL_TAXONOMY
from backend.app.schemas.api import SkillGapRequest, SkillGapResponse
from backend.app.services.roadmap_service import compute_skill_gap
from backend.app.api.roles import slug_to_role_name

router = APIRouter(tags=["Skills & Skill Gap"])

DATA_PATH = "data/processed/jobs_with_skills.csv"


def load_dataset() -> pd.DataFrame:
    if os.path.exists(DATA_PATH):
        return pd.read_csv(DATA_PATH)
    return pd.DataFrame()


@router.get("/api/skills", response_model=List[Dict[str, str]])
def get_all_skills():
    """Lists all canonical skills and their categories for user skill profiles."""
    skills_list = []
    for skill_name, meta in SKILL_TAXONOMY.items():
        skills_list.append({
            "name": skill_name,
            "category": meta["category"]
        })
    skills_list.sort(key=lambda x: (x["category"], x["name"]))
    return skills_list


@router.post("/api/skill-gap", response_model=SkillGapResponse)
def analyze_skill_gap(request: SkillGapRequest):
    """Compares market required skills vs user's skills and computes Estimated Market Skill Alignment."""
    df = load_dataset()
    role_name = slug_to_role_name(request.target_role)
    gap = compute_skill_gap(df, role_name, request.user_skills)
    return gap
