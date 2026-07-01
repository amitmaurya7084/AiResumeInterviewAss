import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import api from "../resume_config/api";
import { ServerUrl } from "../App"; // if needed, but 'api' already points to VITE_BASE_URL

const formatDateTime = (value) => value ? new Date(value).toLocaleString() : "";
const formatFileSize = (bytes) => {
  if (!bytes) return "0 Bytes";
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
};

const FileUploadArea = ({ resumeFile, onFileChange, error, disabled }) => {
  const [dragActive, setDragActive] = useState(false);

  const validateAndSetFile = (file) => {
    const validTypes = [".pdf", ".docx", ".txt"];
    const fileExtension = "." + file.name.split(".").pop().toLowerCase();
    const maxSize = 10 * 1024 * 1024;

    if (!validTypes.includes(fileExtension)) {
      onFileChange(null, "Please upload a PDF, DOCX, or TXT file");
    } else if (file.size > maxSize) {
      onFileChange(null, "File size must be less than 10MB");
    } else if (file.size === 0) {
      onFileChange(null, "File cannot be empty");
    } else {
      onFileChange(file, null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) validateAndSetFile(file);
  };

  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-slate-600">Resume file <span className="text-red-500">*</span></span>
      <div
        className={`flex min-h-[160px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition-all ${
          dragActive ? "border-indigo-400 bg-indigo-50" :
          error ? "border-red-300 bg-red-50" :
          "border-slate-300 bg-slate-50/60 hover:border-indigo-300 hover:bg-indigo-50/50"
        } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
        onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
      >
        <input id="resume-upload" type="file" accept=".pdf,.docx,.txt" onChange={(e) => validateAndSetFile(e.target.files[0])} className="hidden" disabled={disabled} />
        <label htmlFor="resume-upload" className={`flex cursor-pointer flex-col items-center gap-3 ${disabled ? "cursor-not-allowed" : ""}`}>
          <div className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-600">
            {resumeFile ? "Change file" : "Choose file"}
          </div>
          <div className="text-xs text-slate-500">
            {resumeFile ? (
              <div className="flex flex-col items-center gap-1">
                <span className="font-medium text-green-600">✓ {resumeFile.name}</span>
                <span className="text-slate-400">{formatFileSize(resumeFile.size)}</span>
              </div>
            ) : "Drag & drop or click to upload (PDF, DOCX, TXT up to 10MB)"}
          </div>
        </label>
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      </div>
    </label>
  );
};

const ScoreGauge = ({ score }) => {
  const getScoreConfig = (score) => {
    if (score >= 80) return { color: "emerald", label: "Excellent - Highly compatible" };
    if (score >= 60) return { color: "amber", label: "Good - Some improvements needed" };
    if (score >= 40) return { color: "orange", label: "Fair - Significant improvements needed" };
    return { color: "red", label: "Poor - Major revisions required" };
  };

  const { color, label } = getScoreConfig(score);

  return (
    <div className="rounded-xl border p-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-4">ATS Compatibility Score</p>
      <div className={`rounded-full border-4 mx-auto w-32 h-32 flex items-center justify-center text-${color}-600 bg-${color}-50 border-${color}-200`}>
        <span className="text-3xl font-bold">{score}</span><span className="text-lg">%</span>
      </div>
      <p className={`mt-4 text-sm font-medium text-${color}-600`}>{label}</p>
    </div>
  );
};

const ProgressBar = ({ progress, message }) => (
  <div className="w-full">
    <div className="bg-slate-200 rounded-full h-2 mb-2">
      <div className="bg-indigo-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
    </div>
    <p className="text-xs text-slate-500 text-center">{message}</p>
  </div>
);

export const AtsChecker = () => {
  const [state, setState] = useState({
    resumeFile: null,
    jobDescription: "",
    loading: false,
    report: null,
    history: [],
    error: "",
    fileError: "",
    analysisProgress: 0,
    analysisStep: ""
  });

  const { resumeFile, jobDescription, loading, report, history, error, fileError, analysisProgress, analysisStep } = state;

  const updateState = (updates) => setState(prev => ({ ...prev, ...updates }));

  const canSubmit = useMemo(() => 
    Boolean(resumeFile && jobDescription.trim() && !loading && !fileError), 
    [resumeFile, jobDescription, loading, fileError]
  );

  const fetchHistory = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/api/ats/history", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      updateState({ history: Array.isArray(res.data) ? res.data : [] });
    } catch (err) {
      console.error("Failed to fetch ATS history", err);
    }
  }, []);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const handleFileChange = useCallback((file, error = null) => {
    updateState({ resumeFile: file, fileError: error, error: error || "" });
  }, []);

  const simulateProgress = useCallback(() => {
    const steps = ["Uploading file...", "Parsing resume...", "Analyzing JD...", "Matching keywords...", "Generating suggestions...", "Creating report..."];
    let currentStep = 0;
    return setInterval(() => {
      if (currentStep < steps.length) {
        updateState({ analysisStep: steps[currentStep], analysisProgress: ((currentStep + 1) / steps.length) * 100 });
        currentStep++;
      }
    }, 800);
  }, []);

  const handleAnalyze = async () => {
    if (!resumeFile || !jobDescription.trim() || fileError) {
      updateState({ error: !resumeFile ? "Please choose a resume file." : !jobDescription.trim() ? "Job description cannot be empty." : fileError });
      return;
    }

    updateState({ loading: true, error: "", analysisProgress: 0, analysisStep: "Starting analysis..." });
    const progressInterval = simulateProgress();

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("jobDescription", jobDescription.trim());

      const token = localStorage.getItem("token");
      const res = await api.post("/api/ats/analyze", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
        onUploadProgress: (e) => e.total && updateState({ analysisProgress: (e.loaded / e.total) * 100 })
      });

      updateState({ report: res.data, analysisProgress: 100, analysisStep: "Analysis complete!" });
      await fetchHistory();
    } catch (err) {
      const message = err?.response?.data?.error || err?.response?.data?.message || err?.message || "Failed to analyze resume.";
      updateState({ error: message });
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => updateState({ loading: false, analysisProgress: 0, analysisStep: "" }), 1000);
    }
  };

  const clearInputs = () => updateState({
    resumeFile: null,
    jobDescription: "",
    report: null,
    error: "",
    fileError: ""
  });

  const loadSampleData = () => updateState({
    jobDescription: `We are looking for a skilled Frontend Developer with expertise in:
- React.js and modern JavaScript (ES6+)
- TypeScript for type-safe development
- Tailwind CSS and responsive design
- RESTful APIs and GraphQL integration
- State management with Redux or Context API
- Testing with Jest and React Testing Library
- Git version control and CI/CD pipelines
- Agile development methodologies

Requirements:
- 3+ years of professional experience
- Strong problem-solving skills
- Excellent communication abilities
- Bachelor's degree in Computer Science or related field`
  });

  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && canSubmit) handleAnalyze();
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [canSubmit]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 lg:px-8">
        
        {/* Header Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-10">
          <div className="flex flex-col gap-3 text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-indigo-500">AI-Powered ATS Analyzer</p>
            <h1 className="text-3xl font-bold text-slate-900 lg:text-4xl">Optimize Your Resume for Any Job</h1>
            <p className="mx-auto max-w-2xl text-sm text-slate-500 lg:text-base">
              Get instant ATS compatibility score, missing keywords, and actionable suggestions.
            </p>
          </div>

          {/* Input Section */}
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <FileUploadArea resumeFile={resumeFile} onFileChange={handleFileChange} error={fileError} disabled={loading} />
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Job description <span className="text-red-500">*</span></span>
                <button type="button" onClick={loadSampleData} disabled={loading} className="text-xs text-indigo-500 hover:text-indigo-600 disabled:opacity-50">
                  Load sample JD
                </button>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => updateState({ jobDescription: e.target.value, error: error ? "" : error })}
                placeholder="Paste the job description here. Include responsibilities, required skills, qualifications, and keywords."
                rows={10}
                className="min-h-[220px] resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-700 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                disabled={loading}
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>{jobDescription.length} characters</span>
                {jobDescription.length > 0 && <span>Press Ctrl+Enter to analyze</span>}
              </div>
            </div>
          </div>

          {error && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
          {loading && <div className="mt-6"><ProgressBar progress={analysisProgress} message={analysisStep} /></div>}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!canSubmit}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />Analyzing...</> : "Analyze Resume"}
            </button>
            <button type="button" onClick={clearInputs} disabled={loading} className="text-sm font-medium text-slate-600 transition hover:text-slate-700 disabled:opacity-50">
              Clear all
            </button>
          </div>
        </div>

        {/* Results Section */}
        {report && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-10">
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-900">Analysis Results</h2>
                {report.reportUrl && (
                  <a
                    className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                    href={report.reportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📄 Download PDF Report
                  </a>
                )}
              </div>

              <div className="grid gap-8 lg:grid-cols-3">
                <ScoreGauge score={report.score} />
                <div className="lg:col-span-2 space-y-6">
                  {/* Tools & Technologies Required */}
                  {report.toolsTechnologies && report.toolsTechnologies.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">
                        Tools & Technologies Required <span className="text-sm font-normal text-slate-500">({report.toolsTechnologies.length})</span>
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {report.toolsTechnologies.map((tool, index) => (
                          <span key={`${tool}-${index}`} className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Structure Suggestions */}
                  {report.structureSuggestions && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">Structure Improvements for ATS</h3>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <pre className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                          {report.structureSuggestions}
                        </pre>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Improvement Suggestions</h3>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <pre className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                        {report.suggestions || "No specific suggestions available."}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">
                      Missing Keywords <span className="text-sm font-normal text-slate-500">({report.missingKeywords?.length || 0})</span>
                    </h3>
                    {report.missingKeywords?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {report.missingKeywords.map((keyword, index) => (
                          <span key={`${keyword}-${index}`} className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                        <p className="text-sm font-medium text-emerald-700">🎉 Excellent! No missing keywords detected.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-10">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-slate-900">Analysis History</h2>
            <div className="flex gap-2">
              <button type="button" onClick={fetchHistory} disabled={loading} className="text-sm font-medium text-indigo-500 transition hover:text-indigo-600 disabled:opacity-50">
                Refresh
              </button>
              {history.length > 0 && (
                <button type="button" onClick={() => updateState({ history: [] })} className="text-sm font-medium text-slate-500 transition hover:text-slate-600">
                  Clear
                </button>
              )}
            </div>
          </div>
          
          {history.length ? (
            <div className="mt-6 space-y-3">
              {history.map((entry) => (
                <div key={entry._id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:bg-slate-100">
                  <div className="flex items-center gap-4">
                    <div className={`rounded-full px-3 py-1 text-sm font-medium ${
                      entry.score >= 80 ? "bg-emerald-100 text-emerald-700" :
                      entry.score >= 60 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                    }`}>
                      {entry.score}%
                    </div>
                    <p className="text-xs text-slate-500">{formatDateTime(entry.createdAt)}</p>
                  </div>
                  {entry.reportUrl && (
                    <a href={entry.reportUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-slate-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-700">
                      📄 PDF
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 text-center py-8">
              <p className="text-sm text-slate-500">No analysis history yet. Analyze your first resume to see results here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
