import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"


def test_list_roles():
    response = client.get("/api/roles")
    assert response.status_code == 200
    roles = response.json()
    assert isinstance(roles, list)
    assert len(roles) > 0
    assert "name" in roles[0]


def test_get_role_overview():
    response = client.get("/api/roles/ai-engineer")
    assert response.status_code == 200
    data = response.json()
    assert data["role_name"] == "AI Engineer"
    assert "job_count" in data
    assert "top_skill" in data


def test_get_role_skills():
    response = client.get("/api/roles/ai-engineer/skills")
    assert response.status_code == 200
    data = response.json()
    assert data["role_name"] == "AI Engineer"
    assert isinstance(data["skills"], list)


def test_get_role_trends():
    response = client.get("/api/roles/ai-engineer/trends")
    assert response.status_code == 200
    data = response.json()
    assert "trends" in data


def test_get_role_salary():
    response = client.get("/api/roles/ai-engineer/salary")
    assert response.status_code == 200
    data = response.json()
    assert "disclaimer" in data


def test_get_all_skills():
    response = client.get("/api/skills")
    assert response.status_code == 200
    skills = response.json()
    assert isinstance(skills, list)
    assert len(skills) > 0


def test_post_skill_gap():
    payload = {
        "target_role": "AI Engineer",
        "user_skills": ["Python", "SQL", "Pandas"]
    }
    response = client.post("/api/skill-gap", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["target_role"] == "AI Engineer"
    assert "overall_match_score" in data
    assert "Python" in data["already_covered"]


def test_post_roadmap():
    payload = {
        "target_role": "AI Engineer",
        "user_skills": ["Python", "SQL", "Pandas"]
    }
    response = client.post("/api/roadmap", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["target_role"] == "AI Engineer"
    assert data["total_stages"] > 0
    assert len(data["stages"]) > 0
