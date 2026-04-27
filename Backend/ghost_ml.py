from utils import clean_text

def ghost_score(job):

    description = clean_text(job.get("description", ""))

    score = 0

    # 🔥 Rule 1: suspicious keywords
    if "urgent hiring" in description:
        score += 30

    if "apply now" in description:
        score += 20

    # 🔥 Rule 2: very short description
    if len(description) < 100:
        score += 20

    # 🔥 Rule 3: fake signals (simulated)
    if job.get("repost_count", 1) > 3:
        score += 15

    if job.get("days_old", 2) > 20:
        score += 15

    # limit
    score = min(score, 100)

    # label
    if score > 60:
        label = "Ghost ❌"
    elif score > 30:
        label = "Risky ⚠️"
    else:
        label = "Real ✅"

    return {
        "ghost_score": score,
        "label": label
    }