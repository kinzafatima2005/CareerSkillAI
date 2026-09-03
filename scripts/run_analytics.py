import os
import sys
import json
import pandas as pd

# Add parent directory to path to allow imports from backend
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.analytics.skill_demand import calculate_demand_score
from backend.app.analytics.trend_analysis import calculate_skill_trends
from backend.app.analytics.skill_cooccurrence import calculate_skill_cooccurrence
from backend.app.analytics.salary_analysis import calculate_salary_insights

SKILLS_DATA_PATH = "data/processed/jobs_with_skills.csv"
ANALYTICS_OUTPUT_PATH = "data/processed/analytics_summary.json"


def run_phase3_pipeline(input_path: str = SKILLS_DATA_PATH, output_path: str = ANALYTICS_OUTPUT_PATH) -> dict:
    print("==================================================")
    print("       CAREERSKILL AI - PHASE 3 ANALYTICS LAYER    ")
    print("==================================================")

    if not os.path.exists(input_path):
        print(f"[-] Enriched skills dataset not found at {input_path}.")
        print("[+] Running Phase 2 skill extraction pipeline first...")
        from scripts.extract_skills import run_phase2_pipeline
        run_phase2_pipeline(output_path=input_path)

    print(f"[1/4] Loading processed jobs with skills from: {input_path}")
    df = pd.read_csv(input_path)
    print(f"      Total records to analyze: {len(df)}")

    roles = ["Overall"] + sorted(list(df["normalized_title"].dropna().unique()))
    print(f"[2/4] Analyzing {len(roles) - 1} canonical career roles...")

    summary_by_role = {}
    for role in roles:
        role_key = role.lower().replace(" ", "_") if role != "Overall" else "overall"
        target = None if role == "Overall" else role

        demand_scores = calculate_demand_score(df, target)
        trends = calculate_skill_trends(df, target)
        cooccurrence = calculate_skill_cooccurrence(df, target)
        salary_insights = calculate_salary_insights(df, target)

        summary_by_role[role_key] = {
            "role_name": role,
            "job_count": len(df) if role == "Overall" else len(df[df["normalized_title"] == role]),
            "demand_scores": demand_scores,
            "trends": trends,
            "cooccurrence": cooccurrence,
            "salary_insights": salary_insights
        }

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(summary_by_role, f, indent=2)

    print(f"[3/4] Analytics summary exported to: {output_path}")

    # Summary Output for AI Engineer
    print("\n[4/4] --- PHASE 3 ANALYTICS SUMMARY (AI Engineer Sample) ---")
    ai_eng_summary = summary_by_role.get("ai_engineer", {})
    print(f"  Target Role        : AI Engineer")
    print(f"  Analyzed Jobs      : {ai_eng_summary.get('job_count', 0)}")
    print(f"  Top 5 Demand Scores:")
    for item in ai_eng_summary.get("demand_scores", [])[:5]:
        print(f"    - {item['skill']:20s}: Demand Score = {item['demand_score']} ({item['percentage']}%)")

    print("\n  Top Co-occurring Skill Pairs:")
    for pair in ai_eng_summary.get("cooccurrence", [])[:4]:
        pair_str = pair['pair_label'].replace("↔", "<->")
        print(f"    - {pair_str:30s}: {pair['cooccurrence_count']} jobs (Jaccard: {pair['jaccard_similarity']})")

    print("==================================================")
    print("[SUCCESS] Phase 3 Analytics Layer Execution Complete!")
    print("==================================================")
    return summary_by_role

if __name__ == "__main__":
    run_phase3_pipeline()
