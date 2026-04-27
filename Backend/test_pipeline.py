from pipeline import run_pipeline
from export_csv import export_to_csv

# 🔥 Resume (you can change later)
resume = "security guard patrol cctv safety emergency"

# 🔥 User input
query = input("Enter job role: ")
location = "India"

# 🔥 Run pipeline ONLY ONCE
results = run_pipeline(query, location, resume)

print("\n===== JOB TABLE =====\n")

# Header
print(f"{'Title':30} {'Company':25} {'Match%':10} {'Ghost':10} {'Label'}")
print("-"*90)

# Rows
for job in results[:5]:
    print(f"{job['title'][:30]:30} {job['company'][:25]:25} {job['match_score']:10} {job['ghost_score']:10} {job['label']}")

# 🔥 FILTER ONLY REAL JOBS
real_jobs = [job for job in results if "Real" in job["label"]]

# 🔥 EXPORT CSV
export_to_csv(real_jobs, "real_jobs.csv")

print("\n✅ Only REAL jobs saved in real_jobs.csv")