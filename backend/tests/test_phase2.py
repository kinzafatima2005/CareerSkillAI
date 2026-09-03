import json
import pytest
import pandas as pd
from backend.app.nlp.skill_normalizer import normalize_skill, get_skill_category
from backend.app.nlp.skill_extractor import extract_skills_from_text
from scripts.extract_skills import run_phase2_pipeline


def test_skill_normalization():
    assert normalize_skill("Amazon Web Services") == "AWS"
    assert normalize_skill("aws cloud") == "AWS"
    assert normalize_skill("PyTorch framework") == "PyTorch"
    assert normalize_skill("experience with pytorch") == "PyTorch"
    assert normalize_skill("sklearn") == "Scikit-Learn"
    assert normalize_skill("retrieval augmented generation") == "RAG"
    assert normalize_skill("large language models") == "LLMs"


def test_skill_categories():
    assert get_skill_category("Python") == "Languages"
    assert get_skill_category("AWS") == "Cloud Platform"
    assert get_skill_category("PyTorch") == "Deep Learning"
    assert get_skill_category("LLMs") == "Generative AI"


def test_skill_extraction_phrases():
    sample_text = (
        "Seeking an AI Engineer with expertise in Python, PyTorch framework, "
        "and experience with PyTorch. Must have hands-on experience with Amazon Web Services (AWS), "
        "Docker containerization, and building RAG pipelines with LLMs and FastAPI."
    )
    extracted = extract_skills_from_text(sample_text)
    
    assert "Python" in extracted
    assert "PyTorch" in extracted
    assert "AWS" in extracted
    assert "Docker" in extracted
    assert "RAG" in extracted
    assert "LLMs" in extracted
    assert "FastAPI" in extracted
    
    # Verify no duplicate PyTorch
    assert extracted.count("PyTorch") == 1


def test_phase2_pipeline(tmp_path):
    cleaned_csv = tmp_path / "cleaned_jobs.csv"
    output_csv = tmp_path / "jobs_with_skills.csv"

    data = [
        {
            "job_id": "101",
            "raw_title": "AI Engineer",
            "normalized_title": "AI Engineer",
            "company": "TechCorp",
            "location": "Remote",
            "cleaned_description": "We need an AI Engineer skilled in Python, PyTorch, LLMs, RAG, and Docker.",
            "salary_min": 120000,
            "salary_max": 160000,
            "employment_type": "Full-time",
            "experience_level": "Mid",
            "posted_date": "2024-01-01",
            "source": "test",
        }
    ]

    pd.DataFrame(data).to_csv(cleaned_csv, index=False)

    df_out = run_phase2_pipeline(input_path=str(cleaned_csv), output_path=str(output_csv))

    assert "extracted_skills" in df_out.columns
    extracted = json.loads(df_out["extracted_skills"].iloc[0])
    assert "Python" in extracted
    assert "PyTorch" in extracted
    assert "LLMs" in extracted
    assert "RAG" in extracted
    assert "Docker" in extracted
