import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.app.database.connection import Base
from backend.app.models.job import Job, Skill, SkillAlias, JobSkill, Role, RoadmapNode, SkillDependency, User, UserSkill
from scripts.populate_database import populate_database


@pytest.fixture
def test_db():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = TestingSessionLocal()
    yield db
    db.close()


def test_create_and_query_models(test_db):
    # Create Skill & Alias
    py_skill = Skill(name="Python", category="Languages", description="Python programming language")
    test_db.add(py_skill)
    test_db.flush()

    alias = SkillAlias(skill_id=py_skill.id, alias="python3")
    test_db.add(alias)

    # Create Job
    job = Job(
        id="job_001",
        raw_title="ML Engineer",
        normalized_title="Machine Learning Engineer",
        company="TechCorp",
        location="Remote",
        description="Python PyTorch ML engineer role",
        salary_min=100000,
        salary_max=150000
    )
    test_db.add(job)
    test_db.flush()

    # Link JobSkill
    js = JobSkill(job_id=job.id, skill_id=py_skill.id, confidence=1.0)
    test_db.add(js)
    test_db.commit()

    # Queries
    queried_job = test_db.query(Job).filter_by(id="job_001").first()
    assert queried_job is not None
    assert queried_job.normalized_title == "Machine Learning Engineer"
    assert len(queried_job.job_skills) == 1
    assert queried_job.job_skills[0].skill.name == "Python"


def test_role_and_roadmap_nodes(test_db):
    role = Role(name="AI Engineer", description="AI Engineer role")
    skill = Skill(name="LLMs", category="Generative AI")
    test_db.add_all([role, skill])
    test_db.flush()

    node = RoadmapNode(role_id=role.id, skill_id=skill.id, stage=1, priority="High")
    test_db.add(node)
    test_db.commit()

    queried_node = test_db.query(RoadmapNode).filter_by(role_id=role.id).first()
    assert queried_node is not None
    assert queried_node.skill.name == "LLMs"
    assert queried_node.priority == "High"


def test_user_and_user_skills(test_db):
    user = User(id="user_123", email="test@example.com")
    skill = Skill(name="SQL", category="Languages")
    test_db.add_all([user, skill])
    test_db.flush()

    user_skill = UserSkill(user_id=user.id, skill_id=skill.id, proficiency="Advanced")
    test_db.add(user_skill)
    test_db.commit()

    queried_user = test_db.query(User).filter_by(id="user_123").first()
    assert queried_user is not None
    assert len(queried_user.user_skills) == 1
    assert queried_user.user_skills[0].proficiency == "Advanced"
