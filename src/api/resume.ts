import { API_BASE_URL } from '../utils/config';

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
  resume: File
): Promise<ResumeAnalysisResponse> => {
  const formData = new FormData();
  formData.append("candidate_name", candidateInfo.name);
  formData.append("email", candidateInfo.email);
  formData.append("phone", candidateInfo.phone || "");
  formData.append("job_description", jobDescription);
  formData.append("resume", resume);

  const response = await fetch(`${API_BASE_URL}/api/analyzer/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error((await response.json()).message || "Failed to analyze resume");
  }

  const json = await response.json();

  if (!json.status) {
    throw new Error(json.message || "Analysis failed");
  }

  const analysis = json?.data?.analysis;
  const candidateId = json?.data?.candidate_id;

  const result: AnalysisResult = {
    score: analysis.match_score ?? 0,
    matchedSkills: analysis.matched_skills ?? [],
    missingSkills: analysis.missing_skills ?? [],
    experienceMatch: analysis.experience_match ?? "",
    highlights: analysis.key_highlights ?? [],
    questions: analysis.questions ?? [],
  };

  return { analysis: result, candidateId };
};
