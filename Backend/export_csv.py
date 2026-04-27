import csv

def export_to_csv(jobs, filename="jobs.csv"):

    with open(filename, mode="w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)

        # Header
        writer.writerow(["Title", "Company", "Match %", "Ghost Score", "Label", "Apply Link"])

        # Rows
        for job in jobs:
            writer.writerow([
                job["title"],
                job["company"],
                job["match_score"],
                job["ghost_score"],
                job["label"],
                job["apply_link"]
            ])

    print(f"\n✅ CSV file saved as {filename}")