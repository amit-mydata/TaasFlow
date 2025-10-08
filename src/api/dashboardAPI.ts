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
      hr_name: string;            // ✅ new
      job_position: string;
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

// ✅ Fetch dashboard data with Bearer token
export const getDashboardData = async (page = 1, per_page = 10): Promise<DashboardResponse> => {
  const token = localStorage.getItem('token'); // get stored JWT
  if (!token) {
    throw new Error('Authentication token missing. Please login again.');
  }

  const response = await fetch(`${API_BASE_URL}/api/analyzer/dashboard?page=${page}&per_page=${per_page}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`, // ✅ send token
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data: DashboardResponse = await response.json();
  return data;
};
