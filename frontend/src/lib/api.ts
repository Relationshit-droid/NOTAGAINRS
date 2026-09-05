const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
};

async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;
  
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };
  
  if (body) {
    config.body = JSON.stringify(body);
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `API error: ${response.status}`);
  }
  
  return response.json();
}

export const userApi = {
  create: (data: { email: string; display_name: string }) =>
    apiRequest<any>('/api/users', { method: 'POST', body: data }),
  get: (userId: string) => apiRequest<any>(`/api/users/${userId}`),
  updateSarcasm: (userId: string, level: number) =>
    apiRequest<any>(`/api/users/${userId}/sarcasm?level=${level}`, { method: 'PUT' }),
};

export const coupleApi = {
  link: (userId: string, partnerCode: string) =>
    apiRequest<any>('/api/couples/link', {
      method: 'POST',
      body: { user_id: userId, partner_code: partnerCode },
    }),
  get: (coupleId: string) => apiRequest<any>(`/api/couples/${coupleId}`),
};

export const gamesApi = {
  getCategories: () => apiRequest<{ categories: any[] }>('/api/games/categories'),
  getCategory: (categoryId: string) => apiRequest<any>(`/api/games/categories/${categoryId}`),
  createSession: (data: { user_id: string; game_id: string; category_id: string }) =>
    apiRequest<any>('/api/games/sessions', { method: 'POST', body: data }),
  updateSession: (sessionId: string, data: { score?: number; completed?: boolean }) =>
    apiRequest<any>(`/api/games/sessions/${sessionId}`, { method: 'PUT', body: data }),
};

export const loveArcadeApi = {
  getGames: () => apiRequest<{ games: any[] }>('/api/love-arcade/games'),
};

export const sosApi = {
  createSession: (data: { initiator_id: string; couple_id: string }) =>
    apiRequest<any>('/api/sos/sessions', { method: 'POST', body: data }),
  submit: (sessionId: string, data: any) =>
    apiRequest<any>(`/api/sos/sessions/${sessionId}/submit`, { method: 'POST', body: { session_id: sessionId, ...data } }),
  get: (sessionId: string) => apiRequest<any>(`/api/sos/sessions/${sessionId}`),
};

export const marcieApi = {
  chat: (data: {
    user_id: string;
    context: string;
    message: string;
    sarcasm_level?: number;
    game_context?: string;
  }) => apiRequest<{ response: string; animation: string; sarcasm_level: number }>('/api/marcie/chat', {
    method: 'POST',
    body: data,
  }),
};

export default { userApi, coupleApi, gamesApi, loveArcadeApi, sosApi, marcieApi };
