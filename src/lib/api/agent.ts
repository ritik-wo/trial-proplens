import { apiClient, handleApiError } from './client';
import type {
  RunAgentRequest,
  RunAgentResponse,
  CreateConversationResponse,
  ApiError,
} from './types';

export const agentApi = {
  async runAgent(
    data: RunAgentRequest,
    config?: { signal?: AbortSignal }
  ): Promise<{ data: RunAgentResponse | null; error: ApiError | null }> {
    try {
      const response = await apiClient.post<RunAgentResponse>(
        '/api/assistant/query',
        data,
        { signal: config?.signal }
      );
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  },

  async createConversation(): Promise<{ data: CreateConversationResponse | null; error: ApiError | null }> {
    try {
      const response = await apiClient.post<CreateConversationResponse>('/api/assistant/conversations');
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  },
};
