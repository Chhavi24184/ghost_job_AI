import { useState, useEffect } from 'react'
import viteLogo from './assets/vite.svg'

// --- Types ---
interface JobMatch {
  job_id: string;
  title: string;
  company: string;
  ats_score: number;
  ghost_score: number;
  ghost_label: string;
  common_skills: string[];
  apply_link: string;
}

// --- Components ---

function Navbar({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <nav className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
          <img src={viteLogo} className="w-8 h-8" alt="Logo" />
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Ghost Job AI
          </span>
        </div>
        <div className="flex gap-6">
          <button onClick={() => onNavigate('home')} className="text-sm font-medium hover:text-purple-600">Home</button>
          <button onClick={() => onNavigate('upload')} className="text-sm font-medium hover:text-purple-600">Analyze Resume</button>
        </div>
      </div>
    </nav>
  )
}

function HomePage({ onStart, onLearnMore }: { onStart: () => void, onLearnMore: () => void }) {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
        Stop Applying to <span className="text-purple-600">Ghost Jobs</span>
      </h1>
      <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
        AI-powered tool to detect fake job postings and match your resume with 100% verified real job opportunities.
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={onStart}
          className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-500 transition-all shadow-lg"
        >
          Get Started
        </button>
        <button 
          onClick={onLearnMore}
          className="border border-slate-300 px-8 py-3 rounded-xl font-bold hover:bg-slate-50"
        >
          Learn More
        </button>
      </div>
    </div>
  )
}

function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">About Ghost Job AI</h2>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-purple-600 mb-4">What is a Ghost Job?</h3>
          <p className="text-slate-600 leading-relaxed">
            "Ghost jobs" are job postings that companies have no intention of filling. They might be kept active to:
          </p>
          <ul className="mt-4 space-y-2 text-slate-600 list-disc list-inside">
            <li>Build a talent pool for the future</li>
            <li>Maintain a "growing" company image</li>
            <li>Test the market for specific roles</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-purple-600 mb-4">How Our AI Helps</h3>
          <p className="text-slate-600 leading-relaxed">
            We use machine learning to score job postings based on:
          </p>
          <ul className="mt-4 space-y-2 text-slate-600 list-disc list-inside">
            <li><strong>Posting Age:</strong> Older posts are riskier.</li>
            <li><strong>Repost Frequency:</strong> Constantly reposted jobs are suspicious.</li>
            <li><strong>ATS Matching:</strong> We match your resume against verified descriptions.</li>
          </ul>
        </div>
      </div>
      
      <div className="mt-12 bg-purple-600 text-white p-8 rounded-3xl text-center">
        <h3 className="text-2xl font-bold mb-4">Ready to find a real job?</h3>
        <p className="mb-6 opacity-90">Our tool scans live job boards to bring you the best verified matches.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-white text-purple-600 px-8 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all"
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}

function UploadPage({ onResults }: { onResults: (results: JobMatch[]) => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [jobField, setJobField] = useState('Software Engineer')

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('query', jobField)

    try {
      const response = await fetch('http://localhost:8000/upload-resume', {
        method: 'POST',
        body: formData,
      })
      
      const data = await response.json()

      if (!response.ok) {
        // Show the specific error message from the backend (e.g., "python-docx not installed")
        alert(data.detail || "Error processing resume")
        return
      }

      onResults(data)
    } catch (error) {
      console.error('Error uploading:', error)
      alert("Error connecting to backend. Make sure it's running on localhost:8000")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-100">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-white">Analyze Your Resume</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Target Job Field
          </label>
          <input
            type="text"
            value={jobField}
            onChange={(e) => setJobField(e.target.value)}
            placeholder="e.g. Data Scientist, Marketing, HR"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all dark:bg-slate-700 dark:text-white"
          />
          <p className="mt-1 text-xs text-slate-500">We will fetch live jobs based on this field.</p>
        </div>

        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl py-12 px-6 hover:border-purple-400 bg-slate-50/50 dark:bg-slate-900/50">
          <svg className="w-12 h-12 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <label className="cursor-pointer text-center">
            <span className="text-purple-600 font-semibold">Click to upload resume (PDF or DOCX)</span>
            <input 
              type="file" 
              className="hidden" 
              accept=".pdf,.docx" 
              onChange={(e) => setFile(e.target.files?.[0] || null)} 
            />
          </label>
          {file && <p className="mt-4 font-medium text-slate-700">{file.name}</p>}
        </div>
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className={`mt-8 w-full py-4 rounded-xl font-bold text-white transition-all ${
            !file || loading ? 'bg-slate-300' : 'bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-200'
          }`}
        >
          {loading ? 'Processing with AI...' : 'Check Match & Ghost Score'}
        </button>
      </div>
    </div>
  )
}

function ResultsPage({ results }: { results: JobMatch[] }) {
  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Top Matched Verified Jobs</h2>
      <div className="grid gap-6">
        {results.map((job) => (
          <div key={job.job_id} className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-100 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{job.title}</h3>
                <p className="text-slate-500 font-medium">{job.company}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-500">ATS Score:</span>
                  <span className="text-xl font-black text-purple-600">{job.ats_score}%</span>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-sm font-medium text-slate-500">Ghost Score:</span>
                   <span className={`text-sm font-bold px-2 py-0.5 rounded-full border ${
                     job.ghost_label === 'Ghost' ? 'bg-red-50 text-red-600 border-red-200' :
                     job.ghost_label === 'Risky' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                     'bg-green-50 text-green-600 border-green-200'
                   }`}>
                     {job.ghost_score}% ({job.ghost_label})
                   </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {job.common_skills.map((skill, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-400">Smart Apply enabled: Autofills your info</p>
              <a
                href={job.apply_link}
                target="_blank"
                rel="noreferrer"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-500"
              >
                Apply Smart
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// --- Main App ---

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [results, setResults] = useState<JobMatch[]>([])

  const handleResults = (data: JobMatch[]) => {
    setResults(data)
    setCurrentPage('results')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Navbar onNavigate={setCurrentPage} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {currentPage === 'home' && (
          <HomePage 
            onStart={() => setCurrentPage('upload')} 
            onLearnMore={() => setCurrentPage('about')}
          />
        )}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'upload' && <UploadPage onResults={handleResults} />}
        {currentPage === 'results' && <ResultsPage results={results} />}
      </main>
      <footer className="mt-20 py-10 border-t border-slate-200 text-center">
        <p className="text-slate-400 text-sm">© 2024 Ghost Job AI - Built with FastAPI & React</p>
      </footer>
    </div>
  )
}
