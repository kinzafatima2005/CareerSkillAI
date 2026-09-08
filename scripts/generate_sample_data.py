import os
import random
import uuid
import pandas as pd
from datetime import datetime, timedelta

# Ensure directory exists
os.makedirs("data/raw", exist_ok=True)

# Sample title variations to simulate real-world noise
TITLE_VARIATIONS = [
    ("AI Engineer", ["AI Engineer", "GenAI Engineer", "LLM Engineer", "Senior AI Developer", "AI/ML Solutions Engineer"]),
    ("Machine Learning Engineer", ["ML Engineer", "Machine Learning Developer", "AI/ML Engineer", "Sr. ML Engineer", "Deep Learning Engineer"]),
    ("Data Scientist", ["Data Scientist", "Sr Data Scientist", "Applied Scientist - Data Science", "Data Science Lead"]),
    ("Data Engineer", ["Data Engineer", "Big Data Engineer", "Data Platform Engineer", "Senior Data Engineer"]),
    ("Data Analyst", ["Data Analyst", "Senior Data Analyst", "Business Data Analyst", "Quantitative Data Analyst"]),
    ("Software Engineer", ["Software Engineer", "Backend Engineer (Python)", "Full Stack Software Engineer", "Python Developer"]),
    ("NLP Engineer", ["NLP Engineer", "Natural Language Processing Specialist", "NLP Research Engineer"]),
    ("Computer Vision Engineer", ["Computer Vision Engineer", "CV/ML Engineer", "Image Processing Specialist"]),
    ("Business Intelligence Analyst", ["Business Intelligence Analyst", "BI Analyst - Tableau", "Power BI Specialist"]),
    ("Cybersecurity Engineer", ["Cybersecurity Engineer", "Cyber Security Engineer", "InfoSec Engineer", "Security Engineer"]),
    ("Security Analyst", ["Security Analyst", "Cybersecurity Analyst", "SOC Analyst", "InfoSec Analyst"]),
    ("MLOps Engineer", ["MLOps Engineer", "ML Infrastructure Engineer", "ML Platform Engineer"]),
    ("Cloud Architect", ["Cloud Architect", "AWS Architect", "Azure Cloud Architect", "GCP Solutions Architect"]),
    ("DevOps Engineer", ["DevOps Engineer", "Site Reliability Engineer", "SRE", "Cloud Infrastructure Engineer"]),
    ("Frontend Engineer", ["Frontend Engineer", "React Developer", "Vue.js Engineer", "Web Developer"]),
    ("Mobile App Developer", ["Mobile App Developer", "iOS Developer", "Android Engineer", "Flutter Developer"]),
    ("Data Architect", ["Data Architect", "Enterprise Data Architect", "Principal Data Architect"]),
    ("Database Administrator", ["Database Administrator", "DBA", "Postgres DBA", "SQL Database Administrator"]),
    ("AI Product Manager", ["AI Product Manager", "Data Product Manager", "Technical Product Manager"]),
    ("Technical Program Manager", ["Technical Program Manager", "TPM", "Engineering Program Manager"]),
    ("Full Stack Engineer", ["Full Stack Engineer", "Full Stack Developer", "Fullstack Software Engineer"]),
    ("Site Reliability Engineer", ["Site Reliability Engineer", "SRE", "Production Reliability Engineer"]),
    ("Prompt Engineer", ["Prompt Engineer", "LLM Prompt Specialist", "Generative AI Prompt Designer"]),
    ("Solutions Architect", ["Solutions Architect", "Enterprise Solution Architect", "Systems Architect"]),
    ("Quant Developer", ["Quant Developer", "Quantitative Developer", "Financial Engineer", "Algorithmic Trader"]),
]

SKILL_SETS = {
    "AI Engineer": ["Python", "PyTorch", "LLMs", "RAG", "FastAPI", "Docker", "AWS", "LangChain", "Vector Databases", "Prompt Engineering"],
    "Machine Learning Engineer": ["Python", "PyTorch", "TensorFlow", "Scikit-Learn", "SQL", "Docker", "Kubernetes", "AWS", "MLOps", "MLflow"],
    "Data Scientist": ["Python", "SQL", "Pandas", "NumPy", "Scikit-Learn", "Statistics", "Machine Learning", "Tableau", "R", "A/B Testing"],
    "Data Engineer": ["Python", "SQL", "Spark", "Hadoop", "Airflow", "AWS", "Snowflake", "Kafka", "PostgreSQL", "Docker"],
    "Data Analyst": ["SQL", "Python", "Excel", "Tableau", "Power BI", "Statistics", "Pandas", "Data Visualization"],
    "Software Engineer": ["Python", "Git", "Docker", "FastAPI", "PostgreSQL", "REST APIs", "CI/CD", "Linux", "AWS"],
    "NLP Engineer": ["Python", "PyTorch", "Transformers", "spaCy", "NLP", "BERT", "LLMs", "HuggingFace", "FastAPI"],
    "Computer Vision Engineer": ["Python", "PyTorch", "OpenCV", "TensorFlow", "Computer Vision", "YOLO", "CNNs", "C++", "CUDA"],
    "Business Intelligence Analyst": ["SQL", "Power BI", "Tableau", "Data Warehousing", "Excel", "ETL", "Statistics", "DAX"],
    "Cybersecurity Engineer": ["Network Security", "Penetration Testing", "SIEM", "Cryptography", "Wireshark", "Firewalls", "Linux", "Python", "Docker"],
    "Security Analyst": ["SIEM", "Network Security", "Wireshark", "Firewalls", "Linux", "SQL", "Python", "Cryptography"],
    "MLOps Engineer": ["MLOps", "Python", "Docker", "Kubernetes", "AWS", "CI/CD", "Terraform", "Git", "Linux"],
    "Cloud Architect": ["AWS", "Azure", "GCP", "Terraform", "Kubernetes", "Docker", "Network Security", "Linux"],
    "DevOps Engineer": ["Docker", "Kubernetes", "Terraform", "Ansible", "CI/CD", "AWS", "Linux", "Python", "Git"],
    "Frontend Engineer": ["React", "JavaScript", "TypeScript", "Vue.js", "Git", "REST APIs"],
    "Mobile App Developer": ["Flutter", "Swift", "Kotlin", "React", "Git", "REST APIs"],
    "Data Architect": ["Data Modeling", "SQL", "Snowflake", "PostgreSQL", "Data Warehousing", "AWS", "Python"],
    "Database Administrator": ["PostgreSQL", "SQL", "MongoDB", "Redis", "Linux", "Data Modeling", "Firewalls"],
    "AI Product Manager": ["Product Roadmap", "Agile / Scrum", "Python", "LLMs", "Statistics", "Data Visualization"],
    "Technical Program Manager": ["Agile / Scrum", "Product Roadmap", "Git", "CI/CD", "AWS", "SQL"],
    "Full Stack Engineer": ["React", "Node.js", "TypeScript", "PostgreSQL", "Docker", "GraphQL", "Python", "Git"],
    "Site Reliability Engineer": ["Prometheus", "Grafana", "Kubernetes", "Docker", "Python", "Linux", "Terraform", "CI/CD"],
    "Prompt Engineer": ["Prompt Engineering", "LLMs", "Python", "RAG", "LangChain", "Vector Databases"],
    "Solutions Architect": ["AWS", "Azure", "GCP", "Data Modeling", "Docker", "Terraform", "Network Security"],
    "Quant Developer": ["Python", "C++", "Financial Modeling", "Statistics", "SQL", "Pandas", "NumPy"],
}

COMPANIES = ["TechCorp", "DataMind AI", "CloudScale", "VisionTech", "Nexus AI", "InnovateLabs", "QuantAnalytics", "ByteGroup", "Apex Software", "NeuralSystems"]
LOCATIONS = ["San Francisco, CA", "New York, NY", "Austin, TX", "Seattle, WA", "Remote", "Boston, MA", "Chicago, IL", "London, UK", "Pakistan"]
EMP_TYPES = ["Full-time", "Full-time", "Full-time", "Contract", "Part-time"]
EXP_LEVELS = ["Entry Level", "Mid-Senior Level", "Senior", "Executive"]

def generate_job_description(role: str, skills: list) -> str:
    chosen_skills = random.sample(skills, min(len(skills), random.randint(4, 7)))
    skill_str = ", ".join(chosen_skills)
    return (
        f"<p>We are seeking a talented <b>{role}</b> to join our dynamic team.</p>"
        f"<p><b>Requirements:</b></p><ul>"
        f"<li>Strong proficiency in {skill_str}.</li>"
        f"<li>Experience designing and building scalable systems.</li>"
        f"<li>Demonstrated expertise in software development best practices.</li></ul>"
        f"<p>Experience with modern cloud platforms (AWS/GCP/Azure) is a major plus.</p>"
    )

def generate_sample_dataset(count: int = 600, output_path: str = "data/raw/raw_job_postings.csv"):
    random.seed(42)
    records = []
    base_date = datetime.now() - timedelta(days=365)
    sources_distribution = ["kaggle_postings", "kaggle_postings", "adzuna_api", "onet_baseline"]

    for i in range(count):
        role_category, title_options = random.choice(TITLE_VARIATIONS)
        raw_title = random.choice(title_options)
        company = random.choice(COMPANIES)
        location = random.choice(LOCATIONS)
        
        skills = SKILL_SETS.get(role_category, ["Python", "SQL"])
        description = generate_job_description(role_category, skills)
        
        # Introduce intentional data quality issues for testing (missing values, unparsed salary, noise)
        salary_min = random.choice([60000, 80000, 100000, 120000, 150000, None])
        salary_max = (salary_min + random.randint(20000, 50000)) if salary_min else None
        
        posted_date = (base_date + timedelta(days=random.randint(0, 360))).strftime("%Y-%m-%d")

        # 5% chance of corrupt/empty description or title to test cleaner
        if random.random() < 0.03:
            description = ""  # Empty description test case
        if random.random() < 0.02:
            raw_title = None  # Null title test case

        source_tag = random.choice(sources_distribution)

        records.append({
            "job_id": str(uuid.uuid4())[:8],
            "title": raw_title,
            "company": company,
            "location": location,
            "description": description,
            "salary_min": salary_min,
            "salary_max": salary_max,
            "employment_type": random.choice(EMP_TYPES),
            "experience_level": random.choice(EXP_LEVELS),
            "posted_date": posted_date,
            "source": source_tag
        })

    # Add intentional duplicates
    for dup in range(25):
        orig = records[dup * 10].copy()
        orig["job_id"] = str(uuid.uuid4())[:8]  # Same content, different ID
        records.append(orig)

    df = pd.DataFrame(records)
    df.to_csv(output_path, index=False)
    print(f"Generated {len(df)} sample raw job postings with multi-source provenance tags at: {output_path}")
    return df

if __name__ == "__main__":
    generate_sample_dataset()
