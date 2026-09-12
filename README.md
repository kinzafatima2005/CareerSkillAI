 CareerSkill AI 
 AI-Powered Job Market Skill Intelligence & Personalized Career Roadmap Platform

**CareerSkill AI** is a portfolio-level, full-stack Data Science & AI web application that analyzes thousands of real-world job postings to quantify employer skill demand, perform skill-gap analysis, calculate market alignment, and generate personalized, stage-by-stage learning roadmaps.

---

 Problem Statement
Job seekers and transitioning software engineers face significant uncertainty regarding which technical skills are genuinely demanded by employers versus transient industry buzzwords. Generic learning paths often recommend redundant or out-of-sequence skills. **CareerSkill AI** solves this by grounding skill recommendations directly in empirical job market data extracted from actual job postings.

---

 Key Features

1. **Career Role Intelligence Search**:
   - Inspect job market demand across 9 canonical roles (*AI Engineer, Machine Learning Engineer, Data Scientist, Data Engineer, Data Analyst, Software Engineer, NLP Engineer, Computer Vision Engineer, Business Intelligence Analyst*).
2. **NLP Skill Extraction & Normalization**:
   - Automated text cleaning, HTML stripping, and alias normalization (*"Amazon Web Services" $\rightarrow$ "AWS"*, *"PyTorch framework" $\rightarrow$ "PyTorch"*, *"sklearn" $\rightarrow$ "Scikit-Learn"*).
3. **CareerSkill Demand Score**:
   - Multi-metric demand ranking score ($0 - 100$) combining raw posting frequency, growth trajectory, skill co-occurrence density, and salary premium.
4. **Interactive Skill Gap Analysis**:
   - Compare existing user skills against market requirements. Receives an **Estimated Market Skill Alignment %** score and categorized skill gaps (*Already Covered, High Priority, Medium Priority, Optional*).
5. **Personalized Learning Roadmap**:
   - Stage-by-stage execution path that respects prerequisites and existing skills, complete with practical portfolio project recommendations (*Resume Skill Extractor, RAG Document Assistant, FastAPI + Docker ML Deployment*).
6. **Salary & Trend Analytics**:
   - Market salary metrics with explicit disclaimers enforcing `correlation ≠ causation`.

---

 System Architecture

```
                                  +-----------------------+
                                  |   Raw Job Postings    |
                                  |   (CSV / Kaggle API)  |
                                  +-----------+-----------+
                                              |
                                              v
                                  +-----------+-----------+
                                  | Phase 1: Data Pipeline|
                                  | Cleaning & Title Norm |
                                  +-----------+-----------+
                                              |
                                              v
                                  +-----------+-----------+
                                  | Phase 2: NLP Extractor|
                                  | Controlled Skill Dict |
                                  +-----------+-----------+
                                              |
                                              v
                                  +-----------+-----------+
                                  | Phase 3: Analytics    |
                                  | Demand, Trends, Salary|
                                  +-----------+-----------+
                                              |
                                              v
                                  +-----------+-----------+
                                  | Phase 4: Database     |
                                  | SQLAlchemy / SQLite   |
                                  +-----------+-----------+
                                              |
                                              v
                                  +-----------+-----------+
                                  | Phase 5: FastAPI REST |
                                  | Swagger / OpenAPI     |
                                  +-----------+-----------+
                                              |
                                              v
                                  +-----------+-----------+
                                  | Phase 6: React + TS UI|
                                  | Glassmorphism Dashboard|
                                  +-----------------------+
```

---

 Repository Structure

```
skills recommendation/
├── backend/
│   ├── app/
│   │   ├── analytics/         # Skill demand, trend, gap & co-occurrence logic
│   │   │   ├── skill_demand.py
│   │   │   ├── trend_analysis.py
│   │   │   ├── skill_cooccurrence.py
│   │   │   └── salary_analysis.py
│   │   ├── api/               # FastAPI routers (/api/roles, /api/skills, /api/roadmap)
│   │   │   ├── roles.py
│   │   │   ├── skills.py
│   │   │   └── roadmap.py
│   │   ├── database/          # SQLAlchemy connection & session manager
│   │   │   └── connection.py
│   │   ├── models/            # SQLAlchemy ORM models (Job, Skill, Role, Roadmap, User)
│   │   │   └── job.py
│   │   ├── nlp/               # NLP text cleaner, title normalizer & skill extractor
│   │   │   ├── text_cleaner.py
│   │   │   ├── title_normalizer.py
│   │   │   ├── skill_taxonomy.py
│   │   │   └── skill_normalizer.py
│   │   ├── schemas/           # Pydantic data schemas
│   │   ├── services/          # Roadmap generation & gap computation service
│   │   │   └── roadmap_service.py
│   │   └── main.py            # FastAPI main entrypoint
│   ├── tests/                 # Full automated test suite (Phases 1 - 5)
│   └── requirements.txt
├── frontend/                  # React + TypeScript + Tailwind CSS UI
│   ├── src/
│   │   ├── components/        # Navbar, Footer, SkillBarChart, TrendChart
│   │   ├── pages/             # HomePage, RolesPage, RoleAnalyticsPage, SkillGapPage, RoadmapPage, TrendsPage, AboutPage
│   │   ├── services/          # API client
│   │   ├── types/             # TypeScript interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── data/
│   ├── raw/                   # Raw job posting CSVs
│   └── processed/             # Cleaned datasets & analytics JSON outputs
├── scripts/
│   ├── generate_sample_data.py # Reproducible mock raw dataset generator
│   ├── preprocess.py          # Phase 1 preprocessing script
│   ├── extract_skills.py      # Phase 2 skill extraction pipeline
│   ├── run_analytics.py       # Phase 3 analytical summary exporter
│   └── populate_database.py   # Phase 4 database seeder
├── .env.example
├── .gitignore
└── README.md
```

---

 Local Setup & Execution Guide

### Prerequisites
- **Python**: 3.10+
- **Node.js**: v18+

### 1. Install Backend Dependencies
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r backend/requirements.txt
```

### 2. Execute Data & Analytics Pipelines
Run the automated end-to-end data pipeline scripts:
```bash
# 1. Generate sample raw dataset (500+ jobs)
python scripts/generate_sample_data.py

# 2. Run Phase 1 data cleaning & title normalization
python scripts/preprocess.py

# 3. Run Phase 2 NLP skill extraction
python scripts/extract_skills.py

# 4. Run Phase 3 analytics engine
python scripts/run_analytics.py

# 5. Populate Phase 4 database
python scripts/populate_database.py
```

### 3. Run Backend API Server
```bash
uvicorn backend.app.main:app --reload --port 8000
```
- Swagger API Docs: `http://localhost:8000/docs`

### 4. Install & Launch Frontend Application
```bash
cd frontend
npm install
npm run dev
```
- Web Application UI: `http://localhost:3000`

---

 Testing

Run the full automated pytest suite covering all 5 pipeline phases:
```bash
python -m pytest backend/tests/
```
Output:
```text
======================= 26 passed in 5.75s ========================
```

---

 API Documentation Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/roles` | List all career roles with job counts & top skills |
| `GET` | `/api/roles/{role_slug}` | Role analytics overview summary |
| `GET` | `/api/roles/{role_slug}/skills` | Skill demand scores & frequencies |
| `GET` | `/api/roles/{role_slug}/trends` | Time-series trends & emerging tech |
| `GET` | `/api/roles/{role_slug}/salary` | Salary insights & skill premiums |
| `GET` | `/api/skills` | List full skill taxonomy by category |
| `POST` | `/api/skill-gap` | Skill gap analysis & Market Alignment % |
| `POST` | `/api/roadmap` | Personalized stage-by-stage career roadmap |

---

 What I Learned (Data Science & Software Engineering Concepts)

1. **Natural Language Processing & Controlled Taxonomies**:
   - Built phrase-matching skill extractors with word boundaries (`\b`), handling technical tokens like `C++`, `C#`, `.NET`, and `R` without string corruption.
2. **Title Normalization**:
   - Mapped unstandardized titles (`GenAI Developer`, `AI/ML Specialist`, `Sr Data Scientist`) into canonical career roles using regex dictionaries.
3. **Composite Scoring Systems**:
   - Designed the *CareerSkill Demand Score*, balancing raw frequency against demand velocity and co-occurrence density.
4. **Ethical Data Analytics**:
   - Enforced strict statistical policies distinguishing correlation from causation in salary metrics.
5. **Decoupled Architecture**:
   - Built a modular full-stack application separating Data Science NLP pipelines, SQLAlchemy storage, FastAPI REST services, and a React TypeScript UI.

---

 Security & Best Practices
- Environment variables configured via `.env.example`.
- Parameterized database queries via SQLAlchemy ORM.
- Input validation enforced with Pydantic.
- CORS restricted and documented.

---

 Limitations & Future Improvements
- **Current Limitations**: Sample data generator uses pre-defined templates; location analytics are focused on top tech hubs.
- **Future Enhancements**: Add transformer embeddings (Sentence-BERT) for zero-shot skill extraction and semantic job matching.
