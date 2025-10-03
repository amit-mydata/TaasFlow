/* -------------------------------
   Communication API Service
-------------------------------- */
import { API_BASE_URL } from '../utils/config';

export interface CommunicationAnalysisPayload {
  candidateId: string;
  questions: string[];
  audioFile: File;
}

export interface QuizQuestionsResponse {
  data: any[];
}

export interface AnalysisResultAPI {
  status: boolean;
  data: {
    communication_score: number;
    fluency: number;
    clarity: number;
    professionalism: number;
    key_metrics: {
      response_time: number;
      filler_words: number;
      speech_rate: number;
      confidence_level: string;
    };
    feedback: string[];
  };
}

// ✅ Submit audio and get communication analysis
export const analyzeCommunicationAPI = async ({
  candidateId,
  questions,
  audioFile,
}: CommunicationAnalysisPayload): Promise<AnalysisResultAPI> => {
  const formData = new FormData();
  formData.append('candidate_id', candidateId);
  formData.append('question_texts', JSON.stringify(questions));
  formData.append('recordings', audioFile);

  const response = await fetch(
    `${API_BASE_URL}/api/analyzer/submit-all-answers`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) throw new Error('Failed to analyze communication');
  return response.json();
};

// ✅ Fetch quiz questions for Step 3
export const fetchQuizQuestionsAPI = async (candidateId: string): Promise<QuizQuestionsResponse> => {
  const res = await fetch(
    `${API_BASE_URL}/api/analyzer/get-quiz-questions?candidate_uid=${candidateId}`,
    { headers: { accept: 'application/json' } }
  );

  if (!res.ok) throw new Error('Failed to fetch quiz questions');
  return res.json();
};

// ✅ Fetch technical analysis result
export const fetchTechnicalResultsAPI = async (candidateId: string) => {
  const res = await fetch(
    `${API_BASE_URL}/api/analyzer/get-technical-data?candidate_uid=${candidateId}`,
    { headers: { accept: 'application/json' } }
  );

  if (!res.ok) throw new Error('Failed to fetch technical results');
  return res.json();
};
