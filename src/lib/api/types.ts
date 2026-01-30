export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  username: string;
  refresh: string;
  access: string;
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface RefreshTokenResponse {
  refresh: string;
  access: string;
}

export interface VerifyTokenRequest {
  token: string;
}

export interface RunAgentRequest {
  query: string;
  conversation_id: string;
}

export interface RunAgentResponse {
  response: string;
  // images?: string[];
}

export interface CreateConversationResponse {
  id: string;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}
