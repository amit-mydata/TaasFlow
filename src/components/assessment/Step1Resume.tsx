import React, { useState, useRef, ChangeEvent, FormEvent, useEffect } from "react";
import { Upload, CheckCircle, Loader } from "lucide-react";
import { analyzeResume, AnalysisResult, CandidateInfo } from "../../api/resume";
import toast from 'react-hot-toast';
interface Step1ResumeData {
  resume: File | null;
  jobDescription: string;
  candidateInfo: CandidateInfo;
  hrName: string;
  jobPosition: string;
}

interface Step1ResumeProps {
  data: Step1ResumeData;
  onComplete: (
    result: {
      resume: File | null;
      jobDescription: string;
      candidateInfo: CandidateInfo;
      hrName: string;
      jobPosition: string;
      resumeScore: number;
      resumeAnalysis: AnalysisResult;
      candidateId?: string;
      questions?: string[];
    },
    nextStep?: number
  ) => void;
}

const Step1Resume: React.FC<Step1ResumeProps> = ({ data, onComplete }) => {
  const [resumeFile, setResumeFile] = useState<File | null>(
  data.resume instanceof File ? data.resume : null
);
const [jobDescription, setJobDescription] = useState<string>(
  data.jobDescription || ""
);
const [candidateInfo, setCandidateInfo] = useState<CandidateInfo>(
  data.candidateInfo || { name: "", email: "", phone: "" }
);
const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
  null
);
const [candidateId, setCandidateId] = useState<string | null>(null);
const [hrName, setHrName] = useState<string>("");
const [jobPosition, setJobPosition] = useState<string>("");
const fileInputRef = useRef<HTMLInputElement | null>(null);

// -----------------------------
// Load candidateId from localStorage on mount
// -----------------------------
useEffect(() => {
  const storedId = localStorage.getItem("candidateId");
  if (storedId) {
    setCandidateId(storedId);
  }
}, []);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const allowedTypes = [
    "application/pdf",
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // .docx
  ];

  if (!allowedTypes.includes(file.type)) {
    alert("Please upload a PDF or Word document (.doc/.docx)");
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    alert("File size must be under 10MB");
    return;
  }

  setResumeFile(file);
};


  const handleAnalysis = async () => {
  if (!resumeFile) return;
  setIsAnalyzing(true);

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please log in to analyze resumes");
    setIsAnalyzing(false);
    return;
  }

  try {
    const { analysis, candidateId } = await analyzeResume(
      candidateInfo,
      jobDescription,
      resumeFile,
      hrName,
      jobPosition,
      token
    );

    setAnalysisResult(analysis);
    setCandidateId(candidateId);
    localStorage.setItem("candidateId", candidateId);
  } catch (err: any) {
    console.error(err);
    toast.error(err?.message || "Error analyzing resume");
  } finally {
    setIsAnalyzing(false);
  }
};

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (
      resumeFile &&
      jobDescription.trim() &&
      candidateInfo.name &&
      candidateInfo.email &&
      hrName.trim() &&
      jobPosition.trim()
    ) {
      if (!analysisResult) {
        await handleAnalysis();
      } else {
        setIsAnalyzing(true);
        onComplete(
          {
            resume: resumeFile,
            jobDescription,
            candidateInfo,
            hrName,
            jobPosition,
            resumeScore: analysisResult.score,
            resumeAnalysis: analysisResult,
            candidateId: candidateId || undefined,
            questions: analysisResult.questions || [],
          },
          2
        );
      }
    } else {
      alert("Please fill all required fields.");
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Resume & Job Description Matching</h2>
      <p className="text-gray-600 mb-8">
        Upload candidate resume and provide job description for AI-powered matching analysis
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Candidate Info */}
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Candidate Name *</label>
            <input
              type="text"
              value={candidateInfo.name}
              onChange={(e) => setCandidateInfo((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
            <input
              type="email"
              value={candidateInfo.email}
              onChange={(e) => setCandidateInfo((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="text"
              value={candidateInfo.phone}
              onChange={(e) => {
                let val = e.target.value.replace(/\D/g, "");
                if (val.length > 10) val = val.slice(0, 10);
                setCandidateInfo((prev) => ({ ...prev, phone: val }));
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* HR Name & Job Position */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">HR Name *</label>
            <input
              type="text"
              value={hrName}
              onChange={(e) => setHrName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Position *</label>
            <input
              type="text"
              value={jobPosition}
              onChange={(e) => setJobPosition(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Resume Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Resume Upload *</label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 cursor-pointer"
          >
            <input
              ref={fileInputRef}
              type="file"
               accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
            {resumeFile ? (
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <CheckCircle className="w-6 h-6" />
                <span>{resumeFile.name}</span>
              </div>
            ) : (
              <div className="text-gray-500">
                <Upload className="w-8 h-8 mx-auto mb-2" />
                <p className="text-lg font-medium">Click to upload resume</p>
                <p className="text-sm">PDF files only, max 10MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Job Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Job Description *</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Paste the complete job description..."
            required
          />
        </div>

        {analysisResult && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Analysis Results
              </h3>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${analysisResult.score >= 80
                    ? "bg-green-500"
                    : analysisResult.score >= 60
                      ? "bg-yellow-500"
                      : "bg-red-500"
                    }`}
                >
                  {analysisResult.score}
                </div>
                <span className="text-sm text-gray-600">Resume-JD Match</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Matched Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.matchedSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Missing Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.missingSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">Key Highlights</h4>
              <ul className="space-y-2">
                {analysisResult.highlights.map((highlight, index) => (
                  <li
                    key={index}
                    className="flex items-center space-x-2 text-gray-700"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {isAnalyzing && (
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <Loader className="w-6 h-6 text-blue-600 animate-spin" />
              <div>
                <h3 className="font-semibold text-blue-900">
                  {analysisResult
                    ? "Waiting For Questions"
                    : "Analyzing Resume..."}
                </h3>
                <p className="text-blue-700">
                  {analysisResult
                    ? "AI is generating questions for the candidate"
                    : "AI is comparing resume against job requirements"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={
              !resumeFile ||
              !jobDescription.trim() ||
              !candidateInfo.name ||
              !candidateInfo.email ||
              isAnalyzing
            }
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isAnalyzing
              ? analysisResult
                ? "Waiting For Questions"
                : "Analyzing..."
              : analysisResult
                ? "Continue to Technical Screening"
                : "Analyze Resume"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step1Resume;
