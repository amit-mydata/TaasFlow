// src/api/dashboardAPI.ts
import { API_BASE_URL } from '../utils/config';

export interface DashboardResponse {
  status: boolean;
  message: string;
  data: {
    recent_assessments: {
      candidate_name: string;
      email: string;
      phone: string;
      communication_score: number | null;
      resume_score: number;
      overall_score: number | null;
      technical_score: number | null;
      status: string | null;
      date: string;
    }[];
    page: number;
    per_page: number;
    total_pages: number;
    total_count: number;
  };
}


export const getDashboardData = async (page = 1, per_page = 10): Promise<DashboardResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/analyzer/dashboard?page=${page}&per_page=${per_page}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data: DashboardResponse = await response.json();
  return data;
};
