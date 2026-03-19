import { api } from "./api";

export interface HealthCheckInDto {
  sleep: number;
  digestion: number;
  energy: number;
  notes?: string;
}

export interface HealthHistory {
  id: string;
  sleep: number;
  digestion: number;
  energy: number;
  notes?: string;
  createdAt: string;
}

export const wellnessService = {
  checkIn: async (data: HealthCheckInDto, token: string) => {
    const response = await api.post("/api/wellness/checkin", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  
  getHistory: async (token: string): Promise<HealthHistory[]> => {
    const response = await api.get("/api/wellness/history", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
};
