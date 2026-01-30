export const tokenService = {
  getRememberMe(): boolean {
    return localStorage.getItem('remember_me') === 'true';
  },

  getStorage(): Storage {
    return this.getRememberMe() ? localStorage : sessionStorage;
  },

  getTokens(): { access: string | null; refresh: string | null } {
    const s = this.getStorage();
    const access = s.getItem('access_token') || localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    const refresh = s.getItem('refresh_token') || localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
    return { access, refresh };
  },

  setTokens(tokens: { access: string; refresh: string }) {
    const s = this.getStorage();
    s.setItem('access_token', tokens.access);
    s.setItem('refresh_token', tokens.refresh);
  },

  clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
  },

  clearAll() {
    this.clearTokens();
    localStorage.removeItem('username');
    localStorage.removeItem('remember_me');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('remember_me');
  },
};
