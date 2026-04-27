// Simple content script to simulate ghost job detection on a page
console.log("Ghost Job AI: Extension loaded!");

function detectGhostJob() {
    const jobTitle = document.querySelector(".job-details-jobs-unified-top-card__job-title")?.innerText || "Software Engineer";
    const jobDescription = document.querySelector(".jobs-description")?.innerText || "Sample job description...";
    
    const payload = {
        title: jobTitle,
        description: jobDescription,
        posting_date: "2024-03-01", // Mock date for demo
        repost_count: 5 // Mock repost count for demo
    };

    fetch("http://localhost:8000/ghost-score", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
        showOverlay(data.score, data.label);
    })
    .catch(err => console.error("Ghost Job AI Error:", err));
}

function showOverlay(score, label) {
    const div = document.createElement("div");
    div.style.position = "fixed";
    div.style.top = "20px";
    div.style.right = "20px";
    div.style.backgroundColor = label === "Ghost" ? "#fee2e2" : label === "Risky" ? "#fef3c7" : "#dcfce7";
    div.style.color = label === "Ghost" ? "#991b1b" : label === "Risky" ? "#92400e" : "#166534";
    div.style.padding = "15px";
    div.style.borderRadius = "12px";
    div.style.boxShadow = "0 10px 15px -3px rgba(0,0,0,0.1)";
    div.style.zIndex = "9999";
    div.style.border = "2px solid currentColor";
    div.style.fontFamily = "sans-serif";
    
    div.innerHTML = `
        <div style="font-weight: bold; font-size: 16px;">Ghost Job AI Analysis</div>
        <div style="font-size: 14px; margin-top: 5px;">Ghost Score: <strong>${score}%</strong></div>
        <div style="font-size: 14px; margin-top: 2px;">Label: <strong>${label}</strong></div>
        <button id="close-ghost-ai" style="margin-top: 10px; cursor: pointer; border: none; background: #374151; color: white; padding: 4px 8px; border-radius: 4px;">Close</button>
    `;
    
    document.body.appendChild(div);
    document.getElementById("close-ghost-ai").onclick = () => div.remove();
}

// Run analysis after a short delay to let page load
setTimeout(detectGhostJob, 2000);
