from apijob import fetch_jobs

# 🔥 user input
query = input("Enter job role: ")

jobs = fetch_jobs(query)

for job in jobs[:5]:
    print(job["title"], "-", job["company"])
query = input("Enter job role: ")

# if empty → default
if not query:
    query = "software engineer OR data scientist OR intern"