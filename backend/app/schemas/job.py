from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class RawJobPosting(BaseModel):
    """Schema representing a raw job posting before cleaning and normalization."""
    job_id: str = Field(..., description="Unique posting ID or hash")
    title: str = Field(..., description="Original raw job title")
    company: Optional[str] = Field(None, description="Company name")
    location: Optional[str] = Field(None, description="Job location or Remote")
    description: str = Field(..., description="Full text job description")
    salary_min: Optional[float] = Field(None, description="Minimum advertised annual salary")
    salary_max: Optional[float] = Field(None, description="Maximum advertised annual salary")
    employment_type: Optional[str] = Field("Full-time", description="Employment type (e.g., Full-time, Contract)")
    experience_level: Optional[str] = Field(None, description="Experience level (e.g., Entry, Mid, Senior)")
    posted_date: Optional[str] = Field(None, description="Date posted string or ISO format")
    source: Optional[str] = Field("kaggle_linkedin", description="Data source origin tag")


class CleanedJobPosting(BaseModel):
    """Schema representing a cleaned and normalized job posting (Phase 1 Output)."""
    job_id: str
    raw_title: str
    normalized_title: str
    company: str
    location: str
    cleaned_description: str
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    employment_type: str
    experience_level: str
    posted_date: Optional[str] = None
    source: str
    extracted_skills: List[str] = Field(default_factory=list)
