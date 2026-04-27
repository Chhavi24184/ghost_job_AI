import re
import datetime
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def clean_text(text):
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r'[^a-z0-9 ]', '', text)
    return " ".join(text.split())

def calculate_ats_score(resume_text, job_description):
    """
    Calculate ATS Match Score using TF-IDF and Cosine Similarity.
    """
    cleaned_resume = clean_text(resume_text)
    cleaned_job = clean_text(job_description)

    vectorizer = TfidfVectorizer(stop_words="english")
    try:
        tfidf = vectorizer.fit_transform([cleaned_resume, cleaned_job])
        score = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
        
        # Extract matching keywords
        resume_words = set(cleaned_resume.split())
        job_words = set(cleaned_job.split())
        common_skills = list(resume_words & job_words)
        
        return round(score * 100, 2), common_skills[:10]
    except:
        return 0, []

def calculate_ghost_score(job):
    """
    Calculate Ghost Score based on posting age and repost frequency.
    Ghost Score (0-100): Higher means more likely to be a ghost job.
    """
    score = 0
    
    # Rule 1: Posting Age
    try:
        post_date = datetime.datetime.strptime(job.get("posting_date", ""), "%Y-%m-%d")
        days_old = (datetime.datetime.now() - post_date).days
        if days_old > 30:
            score += 40
        elif days_old > 14:
            score += 20
    except:
        score += 10 # Default penalty if date is missing
        
    # Rule 2: Repost Frequency
    repost_count = job.get("repost_count", 0)
    if repost_count > 5:
        score += 40
    elif repost_count > 2:
        score += 20
        
    # Rule 3: Description Quality (Short descriptions are suspicious)
    desc = job.get("description", "")
    if len(desc) < 100:
        score += 20
        
    score = min(score, 100)
    
    # Labeling
    if score > 60:
        label = "Ghost"
    elif score > 30:
        label = "Risky"
    else:
        label = "Real"
        
    return score, label
