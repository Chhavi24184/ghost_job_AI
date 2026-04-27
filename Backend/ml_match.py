from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from utils import clean_text  

def match_jobs(resume_text, jobs):

    #  Clean resume
    resume_text = clean_text(resume_text)

    #  Clean job descriptions
    descriptions = []
    for job in jobs:
        desc = job.get("description", "")
        descriptions.append(clean_text(desc))

    # Handle empty case
    if not descriptions:
        return []

    # TF-IDF
    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf = vectorizer.fit_transform([resume_text] + descriptions)

    # Similarity
    scores = cosine_similarity(tfidf[0:1], tfidf[1:]).flatten()

    results = []

    for i, score in enumerate(scores):

        job = jobs[i]

        # 🔥 Find common keywords (explanation)
        resume_words = set(resume_text.split())
        job_words = set(descriptions[i].split())
        common = list(resume_words & job_words)

        results.append({
            "title": job.get("title", "No Title"),
            "company": job.get("company", "No Company"),
            "match_score": round(score * 100, 2),
            "apply_link": job.get("apply_link", ""),
            "why_match": common[:5]   # top keywords
        })

    return sorted(results, key=lambda x: x["match_score"], reverse=True)