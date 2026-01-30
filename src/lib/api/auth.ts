import { apiClient, handleApiError } from './client';
import { tokenService } from './tokenService';
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  VerifyTokenRequest,
  ApiError,
} from './types';

export const authApi = {
  async login(
    data: LoginRequest, 
    rememberMe: boolean = false
  ): Promise<{ data: LoginResponse | null; error: ApiError | null }> {
    try {
      const response = await apiClient.post<LoginResponse>('/api/token/pair', data);
      
      // Persist remember flag and tokens via tokenService
      localStorage.setItem('remember_me', String(rememberMe));
      const storage = tokenService.getStorage();
      storage.setItem('username', response.data.username);
      tokenService.setTokens({ access: response.data.access, refresh: response.data.refresh });
      
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  },

  async refreshToken(data: RefreshTokenRequest): Promise<{ data: RefreshTokenResponse | null; error: ApiError | null }> {
    try {
      const response = await apiClient.post<RefreshTokenResponse>('/api/token/refresh', data);
      
      tokenService.setTokens({ access: response.data.access, refresh: response.data.refresh });
      
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  },

  async verifyToken(data: VerifyTokenRequest): Promise<{ data: {} | null; error: ApiError | null }> {
    try {
      const response = await apiClient.post('/api/token/verify', data);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  },

  logout() {
    tokenService.clearAll();
  },

  getAccessToken(): string | null {
    return tokenService.getTokens().access;
  },

  getRefreshToken(): string | null {
    return tokenService.getTokens().refresh;
  },

  getUsername(): string | null {
    return localStorage.getItem('username') || sessionStorage.getItem('username');
  },

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  },

  isRememberMe(): boolean {
    return tokenService.getRememberMe();
  },
};
