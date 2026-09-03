import os
import sys
import json
import pandas as pd
from collections import Counter

# Add parent directory to path to allow imports from backend
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.nlp.skill_extractor import extract_skills_from_text

CLEANED_DATA_PATH = "data/processed/cleaned_jobs.csv"
SKILLS_OUTPUT_PATH = "data/processed/jobs_with_skills.csv"


def run_phase2_pipeline(input_path: str = CLEANED_DATA_PATH, output_path: str = SKILLS_OUTPUT_PATH) -> pd.DataFrame:
    print("==================================================")
    print("       CAREERSKILL AI - PHASE 2 SKILL EXTRACTION   ")
    print("==================================================")

    if not os.path.exists(input_path):
        print(f"[-] Cleaned dataset not found at {input_path}.")
        print("[+] Running Phase 1 preprocessing first...")
        from scripts.preprocess import run_phase1_pipeline
        run_phase1_pipeline(output_path=input_path)

    print(f"[1/4] Loading cleaned job postings from: {input_path}")
    df = pd.read_csv(input_path)
    print(f"      Total records to process: {len(df)}")

    print("[2/4] Extracting and normalizing skills from job descriptions...")
    extracted_skills_list = []
    all_extracted_skills = []

    for idx, row in df.iterrows():
        desc = str(row["cleaned_description"])
        skills = extract_skills_from_text(desc)
        extracted_skills_list.append(json.dumps(skills))
        all_extracted_skills.extend(skills)

    df["extracted_skills"] = extracted_skills_list

    # Save Enriched Dataset
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"[3/4] Enriched dataset saved to: {output_path}")

    # Summary Statistics
    print("\n[4/4] --- PHASE 2 PIPELINE SUMMARY ---")
    print(f"  Total Job Postings Processed  : {len(df)}")
    print(f"  Total Skill Mentions Extracted: {len(all_extracted_skills)}")
    print(f"  Average Skills per Job        : {len(all_extracted_skills) / len(df):.1f}")
    
    print("\n  Top 15 Extracted Skills Across All Jobs:")
    skill_counts = Counter(all_extracted_skills)
    for skill, count in skill_counts.most_common(15):
        pct = (count / len(df)) * 100
        print(f"    - {skill:25s}: {count:4d} jobs ({pct:5.1f}%)")

    print("==================================================")
    print("[SUCCESS] Phase 2 Skill Extraction Complete!")
    print("==================================================")
    return df


if __name__ == "__main__":
    run_phase2_pipeline()
