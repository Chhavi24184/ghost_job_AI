# Ghost Job AI 🚀

Ghost Job AI is an intelligent tool designed to help job seekers identify "ghost jobs" (fake or inactive job postings) and match their resumes with real, verified opportunities using AI-powered ATS scoring.

## 🌟 Features

- **Ghost Job Detection**: Uses machine learning heuristics (repost count, posting age, etc.) to flag suspicious job listings.
- **AI Resume Matching**: Calculates an ATS score for your resume against specific job descriptions using TF-IDF vectorization.
- **Live Job Search**: Fetches real-time job data via the JSearch API (RapidAPI).
- **Chrome Extension**: Analyze jobs directly on LinkedIn or other job boards with a simple overlay.
- **Beautiful UI**: A modern, responsive dashboard built with React and Tailwind CSS.

## 🛠️ Tech Stack

### **Backend**
- **Framework**: FastAPI (Python)
- **ML/NLP**: Scikit-learn (TF-IDF Vectorization)
- **Resume Parsing**: PyMuPDF & python-docx
- **API Integration**: Requests (RapidAPI)

### **Frontend**
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript

### **Extension**
- **Type**: Manifest V3 Chrome Extension
- **Functionality**: Content scripts for real-time page analysis.

## 🚀 Getting Started

### **Prerequisites**
- Python 3.10+
- Node.js 18+
- RapidAPI Key (JSearch API)

### **Backend Setup**
1. Navigate to the `Backend` folder:
   ```bash
   cd Backend
   ```
2. Create a `.env` file and add your API key:
   ```env
   RAPIDAPI_KEY=your_actual_key_here
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

### **Frontend Setup**
1. Navigate to the `Frontend` folder:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### **Extension Setup**
1. Open Chrome and go to `chrome://extensions/`.
2. Enable "Developer mode".
3. Click "Load unpacked" and select the `extension` folder from this project.

## 📄 License

This project is licensed under the MIT License.

---
Built with ❤️ for job seekers everywhere.
