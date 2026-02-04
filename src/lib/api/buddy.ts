import { apiClient, handleApiError } from './client';
import type { ApiError } from './types';

export interface BuddyCreateChatRequest {
  userId: string;
  project_id: string;
  channel: string;
  mode: string;
  messages: Array<{
    role: string;
    text: string;
    timestamp: string;
  }>;
}

export interface BuddyCreateChatResponse {
  chat_id: string | null;
  raw: any;
}

export interface RunUserQueryRequest {
  chat_id: string;
  user_id: string;
  query: string;
  query_id: string;
  sessionId: string;
}

export interface MarketTransactionQueryRequest {
  chat_id: string;
  user_id: string;
  query_id: string;
  sessionId: string;
  query: string;
  market_name: string;
  transaction_type: string;
}

export const buddyApi = {
  async createChat(
    payload: BuddyCreateChatRequest
  ): Promise<{ data: BuddyCreateChatResponse | null; error: ApiError | null }> {
    try {
      const { userId, ...body } = payload;
      const response = await apiClient.post<any>(
        `/api/buddy/${encodeURIComponent(userId)}/chats`,
        body,
      );

      const raw = response.data;
      const chatId =
        typeof raw === 'string'
          ? raw
          : (raw && typeof raw === 'object' && typeof raw._id === 'string'
            ? raw._id
            : null);

      return {
        data: {
          chat_id: chatId,
          raw,
        },
        error: null,
      };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  },

  async createMarketChat(
    payload: BuddyCreateChatRequest
  ): Promise<{ data: BuddyCreateChatResponse | null; error: ApiError | null }> {
    try {
      const { userId, ...body } = payload;
      const response = await apiClient.post<any>(
        `/api/buddy/${encodeURIComponent(userId)}/mt_chats`,
        body,
      );

      const raw = response.data;
      const chatId =
        typeof raw === 'string'
          ? raw
          : (raw && typeof raw === 'object' && typeof raw._id === 'string'
            ? raw._id
            : null);

      return {
        data: {
          chat_id: chatId,
          raw,
        },
        error: null,
      };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  },

  async runUserQuery(
    payload: RunUserQueryRequest
  ): Promise<{ data: any | null; error: ApiError | null }> {
    try {
      const formData = new URLSearchParams();
      formData.set('chat_id', payload.chat_id);
      formData.set('user_id', payload.user_id);
      formData.set('query', payload.query);
      formData.set('query_id', payload.query_id);
      formData.set('sessionId', payload.sessionId);

      const response = await apiClient.post<string>(
        '/api/run_user_query/query',
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  },

  async getMarketChats(
    userId: string
  ): Promise<{ data: any[] | null; error: ApiError | null }> {
    try {
      const response = await apiClient.get<any[]>(
        `/api/buddy/${encodeURIComponent(userId)}/mt_chats`,
        { params: { t: Date.now() } },
      );
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  },

  async runMarketTransaction(
    payload: MarketTransactionQueryRequest
  ): Promise<{ data: any | null; error: ApiError | null }> {
    try {
      const response = await apiClient.post<string>(
        '/api/market_transaction/query',
        payload,
      );

      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  },

  async getChats(
    userId: string
  ): Promise<{ data: any[] | null; error: ApiError | null }> {
    try {
      const response = await apiClient.get<any[]>(
        `/api/buddy/${encodeURIComponent(userId)}/chats`,
        { params: { t: Date.now() } },
      );
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  },

  async getChat(
    chatId: string
  ): Promise<{ data: any | null; error: ApiError | null }> {
    try {
      const response = await apiClient.get<any>(
        `/api/buddy/chats/${encodeURIComponent(chatId)}`,
      );
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  },

  async getMarketChat(
    chatId: string
  ): Promise<{ data: any | null; error: ApiError | null }> {
    try {
      const response = await apiClient.get<any>(
        `/api/buddy/mt_chats/${encodeURIComponent(chatId)}`,
      );
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  },
};
