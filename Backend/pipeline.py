from apijob import fetch_jobs
from ml_match import match_jobs
from ghost_ml import ghost_score

def run_pipeline(query, location, resume_text):

    jobs = fetch_jobs(query, location)

    matched_jobs = match_jobs(resume_text, jobs)

    final_results = []

    for job in matched_jobs:

        ghost = ghost_score(job)

        job["ghost_score"] = ghost["ghost_score"]   # ✅ FIXED
        job["label"] = ghost["label"]

        final_results.append(job)

    return final_results