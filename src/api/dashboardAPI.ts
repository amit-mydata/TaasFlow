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
      overall_score: number;
      technical_score: number;
      status: string;
      date: string;
    }[];
  };
}

// Function to call API using fetch
export const getDashboardData = async (): Promise<DashboardResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/analyzer/dashboard`, {
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
