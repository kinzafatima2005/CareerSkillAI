import pytest
import pandas as pd
from backend.app.nlp.text_cleaner import clean_text, clean_company_name
from backend.app.nlp.title_normalizer import normalize_job_title
from scripts.preprocess import run_phase1_pipeline


def test_text_cleaner():
    raw_html = "<p>Looking for a <b>Python</b> engineer &amp; AI expert!</p>"
    cleaned = clean_text(raw_html)
    assert cleaned == "Looking for a Python engineer & AI expert!"


def test_company_cleaner():
    assert clean_company_name("TechCorp LLC.") == "TechCorp"
    assert clean_company_name("DataMind AI Inc") == "DataMind AI"


def test_title_normalization():
    assert normalize_job_title("ML Engineer") == "Machine Learning Engineer"
    assert normalize_job_title("Machine Learning Developer") == "Machine Learning Engineer"
    assert normalize_job_title("AI/ML Engineer") == "Machine Learning Engineer"
    assert normalize_job_title("GenAI Engineer") == "AI Engineer"
    assert normalize_job_title("Senior Data Scientist") == "Data Scientist"
    assert normalize_job_title("Lead Big Data Engineer") == "Data Engineer"
    assert normalize_job_title("NLP Specialist") == "NLP Engineer"
    assert normalize_job_title("Computer Vision Engineer") == "Computer Vision Engineer"


def test_phase1_pipeline(tmp_path):
    # Create mock raw dataset with duplicates and missing values
    raw_csv = tmp_path / "raw_test.csv"
    processed_csv = tmp_path / "processed_test.csv"

    data = [
        {"job_id": "1", "title": "ML Engineer", "company": "TechCorp", "location": "Remote", "description": "<p>Python and PyTorch</p>", "salary_min": 100000, "salary_max": 150000, "employment_type": "Full-time", "experience_level": "Senior", "posted_date": "2024-01-01", "source": "test"},
        # Duplicate of job 1
        {"job_id": "2", "title": "ML Engineer", "company": "TechCorp", "location": "Remote", "description": "<p>Python and PyTorch</p>", "salary_min": 100000, "salary_max": 150000, "employment_type": "Full-time", "experience_level": "Senior", "posted_date": "2024-01-01", "source": "test"},
        # Missing description - should be dropped
        {"job_id": "3", "title": "AI Engineer", "company": "AILab", "location": "NYC", "description": "", "salary_min": 120000, "salary_max": 160000, "employment_type": "Full-time", "experience_level": "Mid", "posted_date": "2024-01-02", "source": "test"},
        # Valid AI Engineer job
        {"job_id": "4", "title": "GenAI Developer", "company": "AILab", "location": "NYC", "description": "<p>LLMs & RAG experience</p>", "salary_min": 130000, "salary_max": 170000, "employment_type": "Full-time", "experience_level": "Mid", "posted_date": "2024-01-02", "source": "test"},
    ]

    df_raw = pd.DataFrame(data)
    df_raw.to_csv(raw_csv, index=False)

    df_cleaned = run_phase1_pipeline(input_path=str(raw_csv), output_path=str(processed_csv))

    # Assertions
    assert len(df_cleaned) == 2  # Duplicate removed, empty description dropped
    assert "Machine Learning Engineer" in df_cleaned["normalized_title"].values
    assert "AI Engineer" in df_cleaned["normalized_title"].values
    assert df_cleaned["cleaned_description"].iloc[0] == "Python and PyTorch"
