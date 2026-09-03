import re
from typing import Dict, List, Optional

# Canonical Role Definitions
CANONICAL_ROLES = [
    "AI Engineer",
    "Machine Learning Engineer",
    "Data Scientist",
    "Data Engineer",
    "Data Analyst",
    "NLP Engineer",
    "Computer Vision Engineer",
    "Software Engineer",
    "Business Intelligence Analyst",
    "Cybersecurity Engineer",
    "Security Analyst",
    "MLOps Engineer",
    "Cloud Architect",
    "DevOps Engineer",
    "Frontend Engineer",
    "Mobile App Developer",
    "Data Architect",
    "Database Administrator",
    "AI Product Manager",
    "Technical Program Manager",
    "Full Stack Engineer",
    "Site Reliability Engineer",
    "Prompt Engineer",
    "Solutions Architect",
    "Quant Developer",
]

# Rule-based Title Synonym Dictionary (Regex pattern -> Canonical Role)
TITLE_SYNONYMS: Dict[str, str] = {
    # Full Stack, SRE, Prompt, Architect, Quant
    r"\b(full stack engineer|full-stack engineer|fullstack developer|full stack developer)\b": "Full Stack Engineer",
    r"\b(site reliability engineer|sre|reliability engineer|production engineer)\b": "Site Reliability Engineer",
    r"\b(prompt engineer|prompt designer|llm prompt engineer|generative ai prompt specialist)\b": "Prompt Engineer",
    r"\b(solutions architect|solution architect|enterprise architect|systems architect|tech architect)\b": "Solutions Architect",
    r"\b(quant developer|quantitative developer|quant engineer|financial engineer|algorithmic trader|quantitative analyst developer)\b": "Quant Developer",

    # MLOps & DevOps & Cloud Architect
    r"\b(mlops engineer|machine learning operations engineer|ml infrastructure engineer|ml platform engineer)\b": "MLOps Engineer",
    r"\b(cloud architect|cloud infrastructure architect|aws architect|azure architect|gcp architect)\b": "Cloud Architect",
    r"\b(devops engineer|cloud devops engineer|infrastructure engineer)\b": "DevOps Engineer",

    # Frontend & Mobile Developer
    r"\b(frontend engineer|front end engineer|frontend developer|react developer|vue developer|web developer)\b": "Frontend Engineer",
    r"\b(mobile developer|mobile engineer|ios developer|android developer|flutter developer|react native developer)\b": "Mobile App Developer",

    # Data Architect & Database Administrator
    r"\b(data architect|principal data architect|enterprise data architect|solution architect - data)\b": "Data Architect",
    r"\b(database administrator|dba|database manager|postgres administrator|sql dba)\b": "Database Administrator",

    # Product & Management
    r"\b(ai product manager|data product manager|technical product manager|pm - ai|pm - data)\b": "AI Product Manager",
    r"\b(technical program manager|tpm|engineering program manager|technical project manager)\b": "Technical Program Manager",

    # Cybersecurity & Security Analyst Variations
    r"\b(cybersecurity engineer|cyber security engineer|infosec engineer|security engineer|soc engineer)\b": "Cybersecurity Engineer",
    r"\b(security analyst|cybersecurity analyst|cyber security analyst|soc analyst|infosec analyst|information security analyst)\b": "Security Analyst",

    # NLP Engineer Variations (Placed early so NLP doesn't get captured by broad AI/ML)
    r"\b(nlp|natural language processing|text analytics)\s*(engineer|developer|specialist|scientist|researcher|architect)?\b": "NLP Engineer",

    # Computer Vision Engineer Variations
    r"\b(computer vision|cv|vision|image processing)\s*(engineer|developer|specialist|scientist|researcher|architect)?\b": "Computer Vision Engineer",

    # Machine Learning Engineer Variations (Placed before general AI to catch AI/ML)
    r"\b(machine learning|ml|ai/ml|deep learning|applied ml)\s*(engineer|developer|specialist|architect|scientist)?\b": "Machine Learning Engineer",

    # AI Engineer Variations
    r"\b(ai|artificial intelligence|generative ai|genai|llm)\s*(engineer|developer|specialist|architect|scientist|solutions engineer)?\b": "AI Engineer",

    # Data Scientist Variations
    r"\b(data scientist|applied scientist|data science engineer|data science lead|data science specialist)\b": "Data Scientist",

    # Data Engineer Variations
    r"\b(data engineer|big data engineer|data platform engineer|etl engineer|data infrastructure engineer|database engineer)\b": "Data Engineer",

    # Business Intelligence Analyst Variations
    r"\b(business intelligence analyst|bi analyst|bi developer|tableau developer|power bi analyst)\b": "Business Intelligence Analyst",

    # Data Analyst Variations
    r"\b(data analyst|business data analyst|quantitative analyst|product analyst|insights analyst)\b": "Data Analyst",

    # Software Engineer Variations
    r"\b(software engineer|backend engineer|swe|software developer|python developer)\b": "Software Engineer",
}


def normalize_job_title(raw_title: str) -> str:
    """
    Normalizes a raw job title string into one of the standardized canonical roles.
    Uses regex keyword matching with fallbacks for unknown titles.
    """
    if not raw_title or not isinstance(raw_title, str):
        return "Other"

    cleaned_title = raw_title.lower().strip()
    # Remove seniority prefixes for matching (e.g. Senior, Lead, Jr., Staff, Principal)
    cleaned_title = re.sub(r"\b(senior|sr|junior|jr|lead|principal|staff|head of|director|vp)\b\.?", "", cleaned_title).strip()

    # Pattern match against dictionary
    for pattern, canonical_role in TITLE_SYNONYMS.items():
        if re.search(pattern, cleaned_title, re.IGNORECASE):
            return canonical_role

    # Fallback substring checks
    if "nlp" in cleaned_title:
        return "NLP Engineer"
    if "computer vision" in cleaned_title or " vision " in cleaned_title:
        return "Computer Vision Engineer"
    if "genai" in cleaned_title or "llm" in cleaned_title or "ai " in cleaned_title or " ai" in cleaned_title:
        return "AI Engineer"
    if "machine learning" in cleaned_title or " ml" in cleaned_title or "ml " in cleaned_title:
        return "Machine Learning Engineer"
    if "data" in cleaned_title and "science" in cleaned_title:
        return "Data Scientist"
    if "data" in cleaned_title and "engineer" in cleaned_title:
        return "Data Engineer"
    if "data" in cleaned_title and "analyst" in cleaned_title:
        return "Data Analyst"
    if "software" in cleaned_title or "developer" in cleaned_title:
        return "Software Engineer"

    return "Other / Custom Role"
