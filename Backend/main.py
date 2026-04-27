from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os
import json
from typing import List, Optional

# Local imports
from resumeparser import extract_text_from_resume
from ml_logic import calculate_ats_score, calculate_ghost_score
from apijob import fetch_jobs

app = FastAPI(title="Ghost Job AI")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load mock jobs data
JOBS_FILE = "data/jobs.json"
if os.path.exists(JOBS_FILE):
    with open(JOBS_FILE, "r") as f:
        MOCK_JOBS = json.load(f)
else:
    MOCK_JOBS = []

class Job(BaseModel):
    id: str
    title: str
    company: str
    description: str
    posting_date: str
    repost_count: int
    apply_link: str

class GhostScoreResponse(BaseModel):
    score: int
    label: str

@app.get("/")
async def read_root():
    return {"message": "Welcome to Ghost Job AI!"}

@app.get("/jobs", response_model=List[Job])
async def get_jobs():
    """Return all available job listings."""
    return MOCK_JOBS

@app.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...), 
    query: Optional[str] = Form(None)
):
    """Extract text from PDF and return ATS Score against live jobs."""
    # Debug info
    print(f"DEBUG: Received file {file.filename} with content_type {file.content_type}")
    print(f"DEBUG: Received query {query}")

    fname = (file.filename or "").lower()
    # Be more permissive with the check
    is_supported = any(ext in fname for ext in [".pdf", ".docx"]) or \
                   any(mtype in (file.content_type or "").lower() for mtype in ["pdf", "word", "officedocument"])
    
    if not is_supported:
        raise HTTPException(status_code=400, detail=f"File {file.filename} is not a PDF or DOCX. content_type: {file.content_type}")

    # Use a safer temp filename
    safe_filename = "".join([c for c in fname if c.isalnum() or c in "._-"])
    if not safe_filename:
        safe_filename = "temp_resume.pdf"
    
    file_path = f"temp_{safe_filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        resume_text = extract_text_from_resume(file_path)
        os.remove(file_path) # Clean up
        
        # Fetch live jobs based on query
        live_jobs = fetch_jobs(query)
        
        results = []
        # Use live jobs if available, else fallback to mock
        jobs_to_process = live_jobs if live_jobs else MOCK_JOBS
        
        for job in jobs_to_process:
            ats_score, common_skills = calculate_ats_score(resume_text, job.get("description", ""))
            ghost_score, ghost_label = calculate_ghost_score(job)
            
            results.append({
                "job_id": job.get("id", "live"),
                "title": job.get("title", "No Title"),
                "company": job.get("company", "No Company"),
                "ats_score": ats_score,
                "ghost_score": ghost_score,
                "ghost_label": ghost_label,
                "common_skills": common_skills,
                "apply_link": job.get("apply_link", "")
            })
            
        # Sort by ATS score (descending)
        results = sorted(results, key=lambda x: x["ats_score"], reverse=True)
        return results[:10]
    except ImportError as ie:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=400, detail=str(ie))
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Error processing resume: {str(e)}")

@app.post("/ghost-score", response_model=GhostScoreResponse)
async def get_ghost_score(job_data: dict):
    """API for Chrome extension to check ghost score on any job page."""
    # Simulate a full job object for the scorer
    job = {
        "title": job_data.get("title", "Unknown"),
        "description": job_data.get("description", ""),
        "posting_date": job_data.get("posting_date", "2024-03-15"), # Mock default
        "repost_count": job_data.get("repost_count", 0)
    }
    score, label = calculate_ghost_score(job)
    return {"score": score, "label": label}

@app.post("/subscribe-alerts")
async def subscribe_alerts(email: str, role: str):
    """Mock endpoint for daily job alerts."""
    return {"message": f"Successfully subscribed {email} to daily alerts for {role} jobs."}
