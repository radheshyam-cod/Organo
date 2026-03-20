import { api } from "./api";

export interface AIRecommendationResponse {
  recommendation: any;
  id: string;
}

export const aiService = {
  async advisor(
    token: string,
    payload: { goal: string; timeOfDay: string; preferences: string[] }
  ): Promise<AIRecommendationResponse> {
    const res = await api.post<AIRecommendationResponse>("/api/ai/advisor", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};
