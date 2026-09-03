import json
import pytest
import pandas as pd
from backend.app.analytics.skill_demand import calculate_skill_demand, calculate_demand_score
from backend.app.analytics.trend_analysis import calculate_skill_trends
from backend.app.analytics.skill_cooccurrence import calculate_skill_cooccurrence
from backend.app.analytics.salary_analysis import calculate_salary_insights
from scripts.run_analytics import run_phase3_pipeline


@pytest.fixture
def sample_analytics_df():
    data = [
        {
            "job_id": "1",
            "normalized_title": "AI Engineer",
            "cleaned_description": "Python PyTorch LLMs RAG Docker AWS",
            "extracted_skills": json.dumps(["Python", "PyTorch", "LLMs", "RAG", "Docker", "AWS"]),
            "salary_min": 120000,
            "salary_max": 160000,
            "posted_date": "2024-01-15",
        },
        {
            "job_id": "2",
            "normalized_title": "AI Engineer",
            "cleaned_description": "Python PyTorch LLMs FastAPI Docker",
            "extracted_skills": json.dumps(["Python", "PyTorch", "LLMs", "FastAPI", "Docker"]),
            "salary_min": 130000,
            "salary_max": 170000,
            "posted_date": "2025-02-10",
        },
        {
            "job_id": "3",
            "normalized_title": "AI Engineer",
            "cleaned_description": "Python SQL Pandas Machine Learning",
            "extracted_skills": json.dumps(["Python", "SQL", "Pandas", "Machine Learning"]),
            "salary_min": 100000,
            "salary_max": 140000,
            "posted_date": "2024-05-20",
        },
        {
            "job_id": "4",
            "normalized_title": "Data Scientist",
            "cleaned_description": "Python SQL Statistics Scikit-Learn",
            "extracted_skills": json.dumps(["Python", "SQL", "Statistics", "Scikit-Learn"]),
            "salary_min": 110000,
            "salary_max": 150000,
            "posted_date": "2024-06-01",
        },
        {
            "job_id": "5",
            "normalized_title": "Data Scientist",
            "cleaned_description": "Python SQL R Tableau",
            "extracted_skills": json.dumps(["Python", "SQL", "R", "Tableau"]),
            "salary_min": 105000,
            "salary_max": 145000,
            "posted_date": "2025-01-10",
        },
    ]
    return pd.DataFrame(data)


def test_skill_demand_calculations(sample_analytics_df):
    ai_demand = calculate_skill_demand(sample_analytics_df, "AI Engineer")
    assert len(ai_demand) > 0
    top_skill = ai_demand[0]
    assert top_skill["skill"] == "Python"
    assert top_skill["count"] == 3
    assert top_skill["percentage"] == 100.0


def test_demand_score_ranges(sample_analytics_df):
    scores = calculate_demand_score(sample_analytics_df, "AI Engineer")
    assert len(scores) > 0
    top_score = scores[0]
    assert "demand_score" in top_score
    assert 0.0 <= top_score["demand_score"] <= 100.0
    assert top_score["demand_tier"] in ["High", "Medium", "Optional"]


def test_skill_trends(sample_analytics_df):
    trends = calculate_skill_trends(sample_analytics_df, "AI Engineer")
    assert "years" in trends
    assert "trends" in trends
    assert "LLMs" in trends["trends"]


def test_cooccurrence_matrix(sample_analytics_df):
    co_pairs = calculate_skill_cooccurrence(sample_analytics_df, "AI Engineer")
    assert len(co_pairs) > 0
    first_pair = co_pairs[0]
    assert "skill_a" in first_pair
    assert "skill_b" in first_pair
    assert "cooccurrence_count" in first_pair
    assert first_pair["jaccard_similarity"] >= 0.0


def test_salary_insights(sample_analytics_df):
    sal_info = calculate_salary_insights(sample_analytics_df, "AI Engineer")
    assert sal_info["has_salary_data"] is True
    assert sal_info["role_median_salary"] > 0
    assert "disclaimer" in sal_info
    assert "correlation" in sal_info["disclaimer"].lower()


def test_phase3_pipeline(tmp_path, sample_analytics_df):
    skills_csv = tmp_path / "jobs_with_skills.csv"
    summary_json = tmp_path / "analytics_summary.json"

    sample_analytics_df.to_csv(skills_csv, index=False)

    summary = run_phase3_pipeline(input_path=str(skills_csv), output_path=str(summary_json))

    assert "overall" in summary
    assert "ai_engineer" in summary
    assert summary["ai_engineer"]["job_count"] == 3
