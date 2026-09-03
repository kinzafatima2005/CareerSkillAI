import os
import sys
import pandas as pd
import hashlib

# Add parent directory to path to allow imports from backend
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.nlp.text_cleaner import clean_text, clean_company_name
from backend.app.nlp.title_normalizer import normalize_job_title

RAW_DATA_PATH = "data/raw/raw_job_postings.csv"
PROCESSED_DATA_PATH = "data/processed/cleaned_jobs.csv"


def hash_description(text: str) -> str:
    """Returns MD5 hash of text for deduplication."""
    return hashlib.md5(text.encode("utf-8")).hexdigest() if text else ""


def run_phase1_pipeline(input_path: str = RAW_DATA_PATH, output_path: str = PROCESSED_DATA_PATH) -> pd.DataFrame:
    print("==================================================")
    print("       CAREERSKILL AI - PHASE 1 DATA PIPELINE      ")
    print("==================================================")
    
    if not os.path.exists(input_path):
        print(f"[-] Input raw dataset not found at {input_path}.")
        print("[+] Generating sample raw dataset...")
        from scripts.generate_sample_data import generate_sample_dataset
        generate_sample_dataset(output_path=input_path)

    print(f"[1/6] Loading raw dataset from: {input_path}")
    df = pd.read_csv(input_path)
    initial_count = len(df)
    print(f"      Initial record count: {initial_count}")

    # 1. Missing Value Handling
    print("[2/6] Handling missing values...")
    df = df.dropna(subset=["title", "description"])
    df = df[df["title"].astype(str).str.strip() != ""]
    df = df[df["description"].astype(str).str.strip() != ""]
    after_dropna_count = len(df)
    print(f"      Dropped {initial_count - after_dropna_count} rows with missing title/description. Remaining: {after_dropna_count}")

    # 2. Text Cleaning & Normalization
    print("[3/6] Cleaning text and normalizing job titles...")
    df["raw_title"] = df["title"].astype(str)
    df["company"] = df["company"].apply(clean_company_name)
    df["location"] = df["location"].fillna("Remote").apply(clean_text)
    df["cleaned_description"] = df["description"].apply(clean_text)
    
    # Title Normalization
    df["normalized_title"] = df["raw_title"].apply(normalize_job_title)
    
    # 3. Deduplication
    print("[4/6] Performing duplicate removal...")
    df["desc_hash"] = df["cleaned_description"].apply(hash_description)
    df["dedup_key"] = df["company"] + "_" + df["normalized_title"] + "_" + df["desc_hash"]
    
    before_dedup = len(df)
    df = df.drop_duplicates(subset=["dedup_key"]).copy()
    df = df.drop(columns=["desc_hash", "dedup_key"])
    after_dedup = len(df)
    print(f"      Removed {before_dedup - after_dedup} duplicate postings. Remaining: {after_dedup}")

    # 4. Fill missing numeric and categorical defaults
    df["salary_min"] = pd.to_numeric(df["salary_min"], errors="coerce")
    df["salary_max"] = pd.to_numeric(df["salary_max"], errors="coerce")
    df["employment_type"] = df["employment_type"].fillna("Full-time")
    df["experience_level"] = df["experience_level"].fillna("Unspecified")
    df["source"] = df["source"].fillna("kaggle_linkedin")

    # Select and order final output columns
    final_cols = [
        "job_id", "raw_title", "normalized_title", "company", "location",
        "cleaned_description", "salary_min", "salary_max", "employment_type",
        "experience_level", "posted_date", "source"
    ]
    df_output = df[final_cols]

    # 5. Save Processed Dataset
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df_output.to_csv(output_path, index=False)
    print(f"[5/6] Processed dataset saved to: {output_path}")

    # 6. Summary Statistics Report
    print("\n[6/6] --- PHASE 1 PIPELINE SUMMARY ---")
    print(f"  Total Cleaned Job Postings : {len(df_output)}")
    print(f"  Unique Hiring Companies     : {df_output['company'].nunique()}")
    print(f"  Title Normalization Distribution:")
    title_counts = df_output['normalized_title'].value_counts()
    for title, count in title_counts.items():
        pct = (count / len(df_output)) * 100
        print(f"    - {title:30s}: {count:4d} ({pct:5.1f}%)")

    print("==================================================")
    print("[SUCCESS] Phase 1 Data Preprocessing Complete!")
    print("==================================================")
    return df_output

if __name__ == "__main__":
    run_phase1_pipeline()
