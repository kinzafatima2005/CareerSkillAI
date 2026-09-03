"""
Controlled Skill Taxonomy & Alias Mapping for CareerSkill AI
"""

from typing import Dict, List

SKILL_TAXONOMY: Dict[str, Dict] = {
    # Languages
    "Python": {
        "category": "Languages",
        "aliases": ["python", "python3", "python programming"]
    },
    "SQL": {
        "category": "Languages",
        "aliases": ["sql", "structured query language", "tsql", "t-sql", "plsql", "pl/sql", "ansi sql"]
    },
    "R": {
        "category": "Languages",
        "aliases": ["r language", "r programming", "r-lang"]
    },
    "C++": {
        "category": "Languages",
        "aliases": ["c++", "cpp"]
    },
    "C#": {
        "category": "Languages",
        "aliases": ["c#", "c-sharp", "csharp"]
    },
    "Java": {
        "category": "Languages",
        "aliases": ["java"]
    },
    "Scala": {
        "category": "Languages",
        "aliases": ["scala"]
    },
    "JavaScript": {
        "category": "Languages",
        "aliases": ["javascript", "js", "ecmascript"]
    },
    "TypeScript": {
        "category": "Languages",
        "aliases": ["typescript", "ts"]
    },
    "Go": {
        "category": "Languages",
        "aliases": ["golang", "go language"]
    },
    "Rust": {
        "category": "Languages",
        "aliases": ["rust", "rustlang"]
    },

    # Frameworks & Libraries
    "Pandas": {
        "category": "Data Libraries",
        "aliases": ["pandas"]
    },
    "NumPy": {
        "category": "Data Libraries",
        "aliases": ["numpy"]
    },
    "Scikit-Learn": {
        "category": "Machine Learning",
        "aliases": ["scikit-learn", "scikitlearn", "sklearn"]
    },
    "TensorFlow": {
        "category": "Deep Learning",
        "aliases": ["tensorflow", "tf"]
    },
    "PyTorch": {
        "category": "Deep Learning",
        "aliases": ["pytorch", "pytorch framework", "experience with pytorch"]
    },
    "Keras": {
        "category": "Deep Learning",
        "aliases": ["keras"]
    },
    "OpenCV": {
        "category": "Computer Vision",
        "aliases": ["opencv", "open cv"]
    },
    "spaCy": {
        "category": "NLP",
        "aliases": ["spacy"]
    },
    "NLTK": {
        "category": "NLP",
        "aliases": ["nltk", "natural language toolkit"]
    },
    "FastAPI": {
        "category": "Web & APIs",
        "aliases": ["fastapi", "fast api"]
    },
    "Flask": {
        "category": "Web & APIs",
        "aliases": ["flask"]
    },
    "Django": {
        "category": "Web & APIs",
        "aliases": ["django"]
    },

    # Cloud & Infrastructure
    "AWS": {
        "category": "Cloud Platform",
        "aliases": ["aws", "amazon web services", "amazon aws", "aws cloud"]
    },
    "Azure": {
        "category": "Cloud Platform",
        "aliases": ["azure", "microsoft azure", "azure cloud"]
    },
    "GCP": {
        "category": "Cloud Platform",
        "aliases": ["gcp", "google cloud", "google cloud platform"]
    },
    "Docker": {
        "category": "DevOps & Cloud",
        "aliases": ["docker", "docker containers", "containerization"]
    },
    "Kubernetes": {
        "category": "DevOps & Cloud",
        "aliases": ["kubernetes", "k8s"]
    },
    "Git": {
        "category": "Tools & Version Control",
        "aliases": ["git", "github", "gitlab"]
    },
    "Linux": {
        "category": "Operating Systems",
        "aliases": ["linux", "unix", "ubuntu"]
    },

    # Data Engineering & Big Data
    "Spark": {
        "category": "Big Data",
        "aliases": ["spark", "apache spark", "pyspark"]
    },
    "Hadoop": {
        "category": "Big Data",
        "aliases": ["hadoop", "apache hadoop"]
    },
    "Airflow": {
        "category": "Data Engineering",
        "aliases": ["airflow", "apache airflow"]
    },
    "Kafka": {
        "category": "Big Data",
        "aliases": ["kafka", "apache kafka"]
    },
    "Snowflake": {
        "category": "Data Warehousing",
        "aliases": ["snowflake"]
    },

    # BI & Analytics
    "Power BI": {
        "category": "BI & Analytics",
        "aliases": ["power bi", "powerbi", "ms power bi"]
    },
    "Tableau": {
        "category": "BI & Analytics",
        "aliases": ["tableau"]
    },
    "Excel": {
        "category": "BI & Analytics",
        "aliases": ["excel", "ms excel", "microsoft excel"]
    },

    # Domains & Methodology
    "Statistics": {
        "category": "Data Science Concepts",
        "aliases": ["statistics", "statistical analysis", "statistical modeling"]
    },
    "Machine Learning": {
        "category": "AI/ML Concepts",
        "aliases": ["machine learning", "ml algorithms", "ml models"]
    },
    "Deep Learning": {
        "category": "AI/ML Concepts",
        "aliases": ["deep learning", "neural networks", "dl"]
    },
    "NLP": {
        "category": "AI/ML Concepts",
        "aliases": ["nlp", "natural language processing", "text analytics"]
    },
    "Computer Vision": {
        "category": "AI/ML Concepts",
        "aliases": ["computer vision", "cv", "image processing"]
    },
    "LLMs": {
        "category": "Generative AI",
        "aliases": ["llm", "llms", "large language model", "large language models"]
    },
    "RAG": {
        "category": "Generative AI",
        "aliases": ["rag", "retrieval augmented generation", "retrieval-augmented generation"]
    },
    "Generative AI": {
        "category": "Generative AI",
        "aliases": ["generative ai", "genai", "gen ai", "generative artificial intelligence"]
    },
    "MLOps": {
        "category": "DevOps & Cloud",
        "aliases": ["mlops", "machine learning operations", "ml ops"]
    },
    "Vector Databases": {
        "category": "Generative AI",
        "aliases": ["vector database", "vector databases", "vector db", "vector dbs", "pinecone", "chromadb", "qdrant", "weaviate"]
    },
    "Prompt Engineering": {
        "category": "Generative AI",
        "aliases": ["prompt engineering", "prompt design"]
    },
    "LangChain": {
        "category": "Generative AI",
        "aliases": ["langchain", "lang chain"]
    },

    # Cybersecurity
    "Network Security": {
        "category": "Cybersecurity",
        "aliases": ["network security", "firewall security", "network defense"]
    },
    "Penetration Testing": {
        "category": "Cybersecurity",
        "aliases": ["penetration testing", "pen testing", "ethical hacking"]
    },
    "SIEM": {
        "category": "Cybersecurity",
        "aliases": ["siem", "splunk", "security information and event management", "soc"]
    },
    "Cryptography": {
        "category": "Cybersecurity",
        "aliases": ["cryptography", "encryption", "pki", "ssl/tls"]
    },
    "Wireshark": {
        "category": "Cybersecurity",
        "aliases": ["wireshark", "packet analysis"]
    },
    "Firewalls": {
        "category": "Cybersecurity",
        "aliases": ["firewall", "firewalls", "palo alto", "cisco ASA"]
    },

    # Frontend & Mobile
    "React": {
        "category": "Frontend & Web",
        "aliases": ["react", "reactjs", "react.js", "react native"]
    },
    "Vue.js": {
        "category": "Frontend & Web",
        "aliases": ["vue", "vuejs", "vue.js"]
    },
    "Flutter": {
        "category": "Mobile Development",
        "aliases": ["flutter", "dart"]
    },
    "Swift": {
        "category": "Mobile Development",
        "aliases": ["swift", "ios development"]
    },
    "Kotlin": {
        "category": "Mobile Development",
        "aliases": ["kotlin", "android development"]
    },

    # DevOps & Infrastructure
    "Terraform": {
        "category": "DevOps & Infrastructure",
        "aliases": ["terraform", "iac", "infrastructure as code"]
    },
    "Ansible": {
        "category": "DevOps & Infrastructure",
        "aliases": ["ansible"]
    },
    "CI/CD": {
        "category": "DevOps & Infrastructure",
        "aliases": ["ci/cd", "ci-cd", "continuous integration", "jenkins", "github actions"]
    },

    # Architecture & Product
    "Data Modeling": {
        "category": "Data Architecture",
        "aliases": ["data modeling", "data architecture", "schema design"]
    },
    "Agile / Scrum": {
        "category": "Product & Management",
        "aliases": ["agile", "scrum", "kanban", "jira"]
    },
    "Product Roadmap": {
        "category": "Product & Management",
        "aliases": ["product roadmap", "product strategy", "product management"]
    },

    # Quant & Observability
    "Node.js": {
        "category": "Web & Backend",
        "aliases": ["node", "nodejs", "node.js", "express.js"]
    },
    "GraphQL": {
        "category": "Web & Backend",
        "aliases": ["graphql", "apollo graphql"]
    },
    "Prometheus": {
        "category": "DevOps & Observability",
        "aliases": ["prometheus", "metrics monitoring"]
    },
    "Grafana": {
        "category": "DevOps & Observability",
        "aliases": ["grafana", "monitoring dashboards"]
    },
    "Financial Modeling": {
        "category": "Quantitative Finance",
        "aliases": ["financial modeling", "quantitative modeling", "algorithmic trading", "stochastic calculus"]
    },

    # Databases
    "PostgreSQL": {
        "category": "Databases",
        "aliases": ["postgresql", "postgres"]
    },
    "MongoDB": {
        "category": "Databases",
        "aliases": ["mongodb", "mongo"]
    },
    "Redis": {
        "category": "Databases",
        "aliases": ["redis"]
    },
}

# Reverse alias dictionary mapping alias -> canonical skill name
ALIAS_TO_CANONICAL: Dict[str, str] = {}
for canonical_skill, meta in SKILL_TAXONOMY.items():
    ALIAS_TO_CANONICAL[canonical_skill.lower()] = canonical_skill
    for alias in meta["aliases"]:
        ALIAS_TO_CANONICAL[alias.lower()] = canonical_skill
