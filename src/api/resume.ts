import { API_BASE_URL } from "../utils/config";

export interface CandidateInfo {
  name: string;
  email: string;
  phone?: string;
}

export interface AnalysisResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  experienceMatch: string;
  highlights: string[];
  questions?: string[];
}

export interface ResumeAnalysisResponse {
  analysis: AnalysisResult;
  candidateId: string;
}

export const analyzeResume = async (
  candidateInfo: CandidateInfo,
  jobDescription: string,
  resume: File,
  hrName: string,
  jobPosition: string,
  token: string
): Promise<ResumeAnalysisResponse> => {
  if (!token) throw new Error("User not authenticated");

  const formData = new FormData();
  formData.append("candidate_name", candidateInfo.name);
  formData.append("email", candidateInfo.email);
  formData.append("phone", candidateInfo.phone || "");
  formData.append("hr_name", hrName);
  formData.append("job_position", jobPosition);
  formData.append("job_description", jobDescription);
  formData.append("resume", resume);

  const response = await fetch(`${API_BASE_URL}/api/analyzer/upload`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`, // pass the token from login
    },
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData?.message || "Failed to analyze resume");
  }

  const json = await response.json();

  if (!json.status) {
    throw new Error(json.message || "Analysis failed");
  }

  const analysisData = json?.data?.analysis;
  const candidateId = json?.data?.candidate_id;

  const analysis: AnalysisResult = {
    score: analysisData.match_score ?? 0,
    matchedSkills: analysisData.matched_skills ?? [],
    missingSkills: analysisData.missing_skills ?? [],
    experienceMatch: analysisData.experience_match ?? "",
    highlights: analysisData.key_highlights ?? [],
    questions: analysisData.questions ?? [],
  };

  return { analysis, candidateId };
};
