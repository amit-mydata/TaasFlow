/* -------------------------------
   Communication & Technical API Service
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

/* -------------------------------
   ✅ Submit audio & get communication analysis
-------------------------------- */
export const analyzeCommunicationAPI = async ({
  candidateId,
  questions,
  audioFile,
}: CommunicationAnalysisPayload): Promise<AnalysisResultAPI> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Missing authentication token');

  const formData = new FormData();
  formData.append('candidate_id', candidateId);
  formData.append('question_texts', JSON.stringify(questions));
  formData.append('recordings', audioFile);

  const response = await fetch(`${API_BASE_URL}/api/analyzer/submit-all-answers`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`, // ✅ Include Bearer token
    },
    body: formData,
  });

  if (!response.ok) throw new Error('Failed to analyze communication');
  return response.json();
};

/* -------------------------------
   ✅ Fetch quiz questions (with token)
-------------------------------- */
export const fetchQuizQuestionsAPI = async (
  candidateId: string
): Promise<QuizQuestionsResponse> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Missing authentication token');

  const res = await fetch(
    `${API_BASE_URL}/api/analyzer/get-quiz-questions?candidate_uid=${candidateId}`,
    {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`, // ✅ Token added
      },
    }
  );

  if (!res.ok) throw new Error('Failed to fetch quiz questions');
  return res.json();
};

/* -------------------------------
   ✅ Fetch technical analysis result (with token)
-------------------------------- */
export const fetchTechnicalResultsAPI = async (candidateId: string) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Missing authentication token');

  const res = await fetch(
    `${API_BASE_URL}/api/analyzer/get-technical-data?candidate_uid=${candidateId}`,
    {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`, // ✅ Token added
      },
    }
  );

  if (!res.ok) throw new Error('Failed to fetch technical results');
  return res.json();
};
