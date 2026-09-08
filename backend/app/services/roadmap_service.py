"""
Roadmap & Skill Gap Business Logic Service
"""

import json
from typing import Dict, List, Any
import pandas as pd
from backend.app.analytics.skill_demand import calculate_demand_score
from backend.app.nlp.skill_normalizer import normalize_skill, get_skill_category

# Practical Project Recommendations per Skill (Spec Section 18)
PROJECT_RECOMMENDATIONS = {
    "Python": "Python Automation & Data Processing Scripts",
    "SQL": "E-Commerce Database Querying & Aggregation Engine",
    "Pandas": "Exploratory Data Analysis Dashboard",
    "Scikit-Learn": "House Price & Sales Prediction Model",
    "Machine Learning": "Predictive Customer Churn Classifier",
    "Deep Learning": "Image Classification System with CNNs",
    "PyTorch": "Custom Neural Network Training & Evaluation Pipeline",
    "TensorFlow": "Handwritten Digit Recognizer Model",
    "NLP": "Resume Skill & Entity Extractor",
    "Computer Vision": "Real-Time Object Detection System",
    "LLMs": "Fine-Tuned Domain Question-Answering Model",
    "RAG": "RAG-Based Document Assistant with Vector DB",
    "Generative AI": "AI Text & Summarization Studio",
    "FastAPI": "Deploy ML Model API with FastAPI & Swagger",
    "Docker": "Containerize ML API Service with Docker",
    "AWS": "Deploy Scalable ML Pipeline on AWS Lambda / EC2",
    "Spark": "Large Scale Distributed Data Processing Pipeline",
    "Tableau": "Executive Business Intelligence Dashboard",
    "Power BI": "Sales Performance Interactive Dashboard",
}


def compute_skill_gap(df: pd.DataFrame, target_role: str, user_skills: List[str]) -> Dict[str, Any]:
    """
    Compares market required skills for target role against user's skills.
    Calculates Estimated Market Skill Alignment Score.
    """
    normalized_user_skills = set(normalize_skill(s) for s in user_skills if s)
    demand_items = calculate_demand_score(df, target_role)

    already_covered = []
    high_priority = []
    medium_priority = []
    optional = []

    total_weighted_demand = 0.0
    covered_weighted_demand = 0.0

    for item in demand_items:
        skill = item["skill"]
        score = item["demand_score"]
        total_weighted_demand += score

        if skill in normalized_user_skills:
            already_covered.append(skill)
            covered_weighted_demand += score
        else:
            if score >= 60:
                high_priority.append(skill)
            elif score >= 35:
                medium_priority.append(skill)
            else:
                optional.append(skill)

    match_score = (
        round((covered_weighted_demand / total_weighted_demand) * 100, 1)
        if total_weighted_demand > 0
        else 0.0
    )

    return {
        "target_role": target_role,
        "overall_match_score": match_score,
        "already_covered": already_covered,
        "high_priority_gaps": high_priority,
        "medium_priority_gaps": medium_priority,
        "optional_gaps": optional,
    }


from backend.app.services.learning_resources import get_learning_resources_for_skill


def generate_personalized_roadmap(df: pd.DataFrame, target_role: str, user_skills: List[str]) -> Dict[str, Any]:
    """
    Generates a stage-by-stage learning roadmap respecting prerequisites and existing user skills.
    """
    gap_result = compute_skill_gap(df, target_role, user_skills)
    normalized_user_skills = set(normalize_skill(s) for s in user_skills if s)

    demand_items = calculate_demand_score(df, target_role)
    stages = []
    stage_idx = 1
    completed_count = 0

    # Skill dependency ordering heuristic
    skill_order = [
        "Python", "SQL", "Pandas", "NumPy", "Statistics", "Machine Learning",
        "Deep Learning", "PyTorch", "TensorFlow", "NLP", "Computer Vision",
        "LLMs", "RAG", "Generative AI", "Vector Databases", "Prompt Engineering",
        "FastAPI", "Docker", "AWS", "Kubernetes", "MLOps"
    ]

    role_skills_map = {item["skill"]: item for item in demand_items}

    # First add ordered skills
    for skill_name in skill_order:
        if skill_name in role_skills_map:
            item = role_skills_map[skill_name]
            is_completed = skill_name in normalized_user_skills
            if is_completed:
                completed_count += 1

            prio = "High Priority" if item["demand_score"] >= 60 else ("Medium Priority" if item["demand_score"] >= 35 else "Optional")

            stages.append({
                "stage": stage_idx,
                "skill": skill_name,
                "category": get_skill_category(skill_name),
                "status": "Already Completed" if is_completed else "Learn Next",
                "priority": prio,
                "project_recommendation": PROJECT_RECOMMENDATIONS.get(skill_name, f"Build a hands-on project using {skill_name}"),
                "learning_resources": get_learning_resources_for_skill(skill_name)
            })
            stage_idx += 1
            del role_skills_map[skill_name]

    # Add remaining role skills
    for skill_name, item in role_skills_map.items():
        is_completed = skill_name in normalized_user_skills
        if is_completed:
            completed_count += 1

        prio = "High Priority" if item["demand_score"] >= 60 else ("Medium Priority" if item["demand_score"] >= 35 else "Optional")

        stages.append({
            "stage": stage_idx,
            "skill": skill_name,
            "category": get_skill_category(skill_name),
            "status": "Already Completed" if is_completed else "Learn Next",
            "priority": prio,
            "project_recommendation": PROJECT_RECOMMENDATIONS.get(skill_name, f"Build a project demonstrating {skill_name}"),
            "learning_resources": get_learning_resources_for_skill(skill_name)
        })
        stage_idx += 1

    return {
        "target_role": target_role,
        "total_stages": len(stages),
        "completed_stages": completed_count,
        "stages": stages,
    }
