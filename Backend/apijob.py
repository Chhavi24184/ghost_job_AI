import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("RAPIDAPI_KEY")

def fetch_jobs(query, location="India"):

    url = "https://jsearch.p.rapidapi.com/search"

    querystring = {
        "query": query,
        "location": location,
        "page": "1",
        "num_pages": "1"
    }

    headers = {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
    }

    # API call
    response = requests.get(url, headers=headers, params=querystring)

    data = response.json()

    print("API Response:", data)  # Debug

    jobs = []

    # Extract jobs
    for job in data.get("data", []):
        jobs.append({
            "title": job.get("job_title", "No Title"),
            "company": job.get("employer_name", "No Company"),
            "description": job.get("job_description", ""),
            "apply_link": job.get("job_apply_link", ""),
            "repost_count": 1,
            "days_old": 2
        })

    return jobs