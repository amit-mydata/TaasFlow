import { API_BASE_URL } from '../utils/config';

export interface TechnicalResultsResponse {
  status: boolean;
  message?: string;
  data: any;
}

// ✅ Fetch technical analysis result with Bearer token
export const fetchTechnicalResultsAPI = async (
  candidateId: string,
  token: string // <-- pass token here
): Promise<TechnicalResultsResponse> => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/analyzer/get-technical-data?candidate_uid=${candidateId}`,
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`, // <-- attach token
        },
      }
    );

    if (!res.ok) throw new Error(`Failed to fetch technical results: ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error fetching technical results:', err);
    throw err;
  }
};
