import os
import sys
import json
import pandas as pd

# Add parent directory to path to allow imports from backend
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.database.connection import init_db, SessionLocal
from backend.app.models.job import Job, Skill, SkillAlias, JobSkill, Role, RoadmapNode, SkillDependency
from backend.app.nlp.skill_taxonomy import SKILL_TAXONOMY
from backend.app.nlp.title_normalizer import CANONICAL_ROLES

SKILLS_DATA_PATH = "data/processed/jobs_with_skills.csv"


def populate_database(input_path: str = SKILLS_DATA_PATH):
    print("==================================================")
    print("       CAREERSKILL AI - PHASE 4 DATABASE SEEDER   ")
    print("==================================================")

    # 1. Initialize Tables
    print("[1/5] Creating database tables...")
    init_db()
    db = SessionLocal()

    try:
        # Clear existing entries for fresh populate
        db.query(JobSkill).delete()
        db.query(Job).delete()
        db.query(SkillAlias).delete()
        db.query(SkillDependency).delete()
        db.query(RoadmapNode).delete()
        db.query(Role).delete()
        db.query(Skill).delete()
        db.commit()

        # 2. Seed Skills & Aliases
        print("[2/5] Seeding skills and skill aliases...")
        skill_name_to_obj = {}
        for skill_name, meta in SKILL_TAXONOMY.items():
            skill_obj = Skill(name=skill_name, category=meta["category"], description=f"Skill: {skill_name}")
            db.add(skill_obj)
            db.flush()
            skill_name_to_obj[skill_name] = skill_obj

            # Add aliases
            for alias in meta["aliases"]:
                if alias.lower() != skill_name.lower():
                    alias_obj = SkillAlias(skill_id=skill_obj.id, alias=alias.lower())
                    db.add(alias_obj)
        db.commit()
        print(f"      Seeded {len(skill_name_to_obj)} skills into database.")

        # 3. Seed Roles
        print("[3/5] Seeding canonical career roles...")
        role_name_to_obj = {}
        for rname in CANONICAL_ROLES:
            role_obj = Role(name=rname, description=f"Career Role: {rname}")
            db.add(role_obj)
            db.flush()
            role_name_to_obj[rname] = role_obj
        db.commit()
        print(f"      Seeded {len(role_name_to_obj)} roles.")

        # 4. Ingest Jobs & JobSkills
        if not os.path.exists(input_path):
            print(f"[-] Input file {input_path} not found. Running Phase 2 skill extraction first...")
            from scripts.extract_skills import run_phase2_pipeline
            run_phase2_pipeline(output_path=input_path)

        print(f"[4/5] Loading jobs from: {input_path}")
        df = pd.read_csv(input_path)
        job_skills_to_add = []

        for _, row in df.iterrows():
            job_obj = Job(
                id=str(row["job_id"]),
                raw_title=str(row["raw_title"]),
                normalized_title=str(row["normalized_title"]),
                company=str(row["company"]),
                location=str(row["location"]),
                description=str(row["cleaned_description"]),
                salary_min=float(row["salary_min"]) if pd.notnull(row["salary_min"]) else None,
                salary_max=float(row["salary_max"]) if pd.notnull(row["salary_max"]) else None,
                employment_type=str(row.get("employment_type", "Full-time")),
                experience_level=str(row.get("experience_level", "Unspecified")),
                posted_date=str(row["posted_date"]) if pd.notnull(row["posted_date"]) else None,
                source=str(row.get("source", "kaggle_linkedin")),
            )
            db.add(job_obj)

            # Link JobSkills
            skills = json.loads(row["extracted_skills"]) if isinstance(row["extracted_skills"], str) else row["extracted_skills"]
            for sname in set(skills):
                if sname in skill_name_to_obj:
                    job_skills_to_add.append(
                        JobSkill(job_id=job_obj.id, skill_id=skill_name_to_obj[sname].id, confidence=1.0)
                    )

        db.commit()
        db.bulk_save_objects(job_skills_to_add)
        db.commit()
        print(f"      Inserted {len(df)} jobs and {len(job_skills_to_add)} job-skill associations.")

        # 5. Seed Skill Dependencies for Roadmap Graph
        print("[5/5] Seeding skill dependencies...")
        dep_pairs = [
            ("Python", "Pandas"),
            ("Python", "NumPy"),
            ("Python", "Machine Learning"),
            ("Machine Learning", "Deep Learning"),
            ("Deep Learning", "PyTorch"),
            ("Deep Learning", "TensorFlow"),
            ("Deep Learning", "LLMs"),
            ("LLMs", "RAG"),
            ("FastAPI", "Docker"),
            ("Docker", "AWS"),
            ("Docker", "Kubernetes"),
            ("SQL", "Data Engineer"),
        ]
        for prereq, target in dep_pairs:
            if prereq in skill_name_to_obj and target in skill_name_to_obj:
                dep_obj = SkillDependency(
                    skill_id=skill_name_to_obj[target].id,
                    prerequisite_skill_id=skill_name_to_obj[prereq].id,
                )
                db.add(dep_obj)
        db.commit()

        # Database Summary
        print("\n--- PHASE 4 DATABASE SEEDING SUMMARY ---")
        print(f"  Total Jobs Stored      : {db.query(Job).count()}")
        print(f"  Total Skills Stored    : {db.query(Skill).count()}")
        print(f"  Total Skill Aliases    : {db.query(SkillAlias).count()}")
        print(f"  Total Job-Skill Links  : {db.query(JobSkill).count()}")
        print(f"  Total Career Roles     : {db.query(Role).count()}")
        print(f"  Total Skill Dependencies: {db.query(SkillDependency).count()}")
        print("==================================================")
        print("[SUCCESS] Phase 4 Database Population Complete!")
        print("==================================================")

    finally:
        db.close()


if __name__ == "__main__":
    populate_database()
