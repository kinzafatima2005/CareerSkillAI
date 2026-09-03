import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api.roles import router as roles_router
from backend.app.api.skills import router as skills_router
from backend.app.api.roadmap import router as roadmap_router
from backend.app.database.connection import init_db

app = FastAPI(
    title="CareerSkill AI - Job Market Intelligence & Career Roadmap API",
    description="REST API providing job market skill demand scores, skill gap analysis, personalized career roadmaps, and salary insights.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Enable CORS for local and production frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(roles_router)
app.include_router(skills_router)
app.include_router(roadmap_router)


@app.on_event("startup")
def on_startup():
    """Initializes database tables on application launch."""
    init_db()


@app.api_route("/", methods=["GET", "HEAD"], tags=["Health"])
def root():
    """Root endpoint welcoming users and providing documentation links."""
    return {
        "service": "CareerSkill AI REST API",
        "status": "online",
        "documentation": "/docs",
        "frontend_ui": "http://localhost:3000",
        "endpoints": [
            "/api/roles",
            "/api/skills",
            "/api/skill-gap",
            "/api/roadmap",
            "/api/health"
        ]
    }


@app.api_route("/api/health", methods=["GET", "HEAD"], tags=["Health"])
def health_check():
    """Health check status endpoint."""
    return {"status": "online", "version": "1.0.0", "service": "CareerSkill AI API"}
