from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text, Table
from sqlalchemy.orm import relationship
from backend.app.database.connection import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(String, primary_key=True, index=True)
    raw_title = Column(String, nullable=False)
    normalized_title = Column(String, nullable=False, index=True)
    company = Column(String, nullable=False, index=True)
    location = Column(String, default="Remote")
    description = Column(Text, nullable=False)
    salary_min = Column(Float, nullable=True)
    salary_max = Column(Float, nullable=True)
    employment_type = Column(String, default="Full-time")
    experience_level = Column(String, default="Unspecified")
    posted_date = Column(String, nullable=True)
    source = Column(String, default="kaggle_linkedin")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    job_skills = relationship("JobSkill", back_populates="job", cascade="all, delete-orphan")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, unique=True, nullable=False, index=True)
    category = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)

    # Relationships
    aliases = relationship("SkillAlias", back_populates="skill", cascade="all, delete-orphan")
    job_skills = relationship("JobSkill", back_populates="skill", cascade="all, delete-orphan")


class SkillAlias(Base):
    __tablename__ = "skill_aliases"

    id = Column(Integer, primary_key=True, autoincrement=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    alias = Column(String, unique=True, nullable=False, index=True)

    skill = relationship("Skill", back_populates="aliases")


class JobSkill(Base):
    __tablename__ = "job_skills"

    job_id = Column(String, ForeignKey("jobs.id"), primary_key=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), primary_key=True)
    confidence = Column(Float, default=1.0)

    job = relationship("Job", back_populates="job_skills")
    skill = relationship("Skill", back_populates="job_skills")


class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)

    roadmap_nodes = relationship("RoadmapNode", back_populates="role", cascade="all, delete-orphan")


class RoadmapNode(Base):
    __tablename__ = "roadmap_nodes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    stage = Column(Integer, nullable=False)
    priority = Column(String, default="High")

    role = relationship("Role", back_populates="roadmap_nodes")
    skill = relationship("Skill")


class SkillDependency(Base):
    __tablename__ = "skill_dependencies"

    skill_id = Column(Integer, ForeignKey("skills.id"), primary_key=True)
    prerequisite_skill_id = Column(Integer, ForeignKey("skills.id"), primary_key=True)

    skill = relationship("Skill", foreign_keys=[skill_id])
    prerequisite = relationship("Skill", foreign_keys=[prerequisite_skill_id])


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user_skills = relationship("UserSkill", back_populates="user", cascade="all, delete-orphan")


class UserSkill(Base):
    __tablename__ = "user_skills"

    user_id = Column(String, ForeignKey("users.id"), primary_key=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), primary_key=True)
    proficiency = Column(String, default="Intermediate")  # Beginner, Intermediate, Advanced

    user = relationship("User", back_populates="user_skills")
    skill = relationship("Skill")
