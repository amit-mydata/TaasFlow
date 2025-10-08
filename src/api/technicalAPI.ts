/* -------------------------------
   Technical Assessment API Service
-------------------------------- */
import { API_BASE_URL } from '../utils/config';

export interface SubmitAnswerPayload {
  type: 'mcqs_questions' | 'coding_questions' | 'text_questions';
  quiz_id: string;
  candidate_uid: string;
  user_answer: string;
}

export interface SubmitAnswerResponse {
  status: boolean;
  message?: string;
  data?: any;
}

// ✅ Submit a single technical answer with Bearer token
export const submitSingleAnswerAPI = async ({
  type,
  quiz_id,
  candidate_uid,
  user_answer,
  token, // <-- add token
}: SubmitAnswerPayload & { token: string }): Promise<SubmitAnswerResponse> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/analyzer/submit-single-answer`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ type, quiz_id, candidate_uid, user_answer }),
    });

    if (!res.ok) throw new Error(`Failed to submit answer: ${res.status}`);
    return res.json();
  } catch (err) {
    console.error('Submit error:', err);
    throw err;
  }
};

// ✅ Fetch technical questions with Bearer token
export const fetchTechnicalQuestionsAPI = async (candidateId: string, token: string) => {
  const res = await fetch(
    `${API_BASE_URL}/api/analyzer/get-quiz-questions?candidate_uid=${candidateId}`,
    { 
      headers: { 
        accept: 'application/json',
        'Authorization': `Bearer ${token}`
      } 
    }
  );

  if (!res.ok) throw new Error('Failed to fetch technical questions');
  return res.json();
};

// ✅ Fetch technical analysis result with Bearer token
export const fetchTechnicalResultsAPI = async (candidateId: string, token: string) => {
  const res = await fetch(
    `${API_BASE_URL}/api/analyzer/get-technical-data?candidate_uid=${candidateId}`,
    { 
      headers: { 
        accept: 'application/json',
        'Authorization': `Bearer ${token}`
      } 
    }
  );

  if (!res.ok) throw new Error('Failed to fetch technical results');
  return res.json();
};
