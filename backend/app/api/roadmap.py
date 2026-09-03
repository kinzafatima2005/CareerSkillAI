import os
import pandas as pd
from fastapi import APIRouter
from backend.app.schemas.api import RoadmapRequest, RoadmapResponse
from backend.app.services.roadmap_service import generate_personalized_roadmap
from backend.app.api.roles import slug_to_role_name

router = APIRouter(prefix="/api/roadmap", tags=["Personalized Roadmap"])

DATA_PATH = "data/processed/jobs_with_skills.csv"


def load_dataset() -> pd.DataFrame:
    if os.path.exists(DATA_PATH):
        return pd.read_csv(DATA_PATH)
    return pd.DataFrame()


@router.post("", response_model=RoadmapResponse)
def get_personalized_roadmap(request: RoadmapRequest):
    """Generates an interactive, stage-by-stage personalized learning roadmap."""
    df = load_dataset()
    role_name = slug_to_role_name(request.target_role)
    roadmap = generate_personalized_roadmap(df, role_name, request.user_skills)
    return roadmap
