/**
 * HTTP Client for RELATIONSHIT! - The Game API
 * 
 * This client automatically adds Firebase Auth tokens to all requests
 * and handles common error scenarios.
 */

import { ENV } from './env';

// Base URL for API requests
const BASE_URL = ENV.BACKEND_URL || 'http://localhost:8001';

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Request options interface
interface RequestOptions {
  headers?: Record<string, string>;
  token?: string;
}

/**
 * Get the full URL for an API endpoint
 */
function getUrl(endpoint: string): string {
  // Remove leading slash if present for consistent URL building
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // If BASE_URL ends with /api, don't add it again
  const baseUrl = BASE_URL.endsWith('/api') 
    ? BASE_URL 
    : `${BASE_URL}/api`;
  
  return `${baseUrl}/${cleanEndpoint}`;
}

/**
 * Build request headers with optional auth token
 */
function buildHeaders(options?: RequestOptions): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options?.headers,
  };

  // Add authorization header if token provided
  if (options?.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  return headers;
}

/**
 * Handle API response and errors
 */
async function handleResponse<T>(response: any): Promise<T> {
  if (!response) {
    throw new ApiError('No response from server', undefined, null);
  }

  // Determine if response looks like a Fetch Response
  let isJson = false;
  try {
    if (response.headers && typeof response.headers.get === 'function') {
      const contentType = response.headers.get('content-type');
      isJson = !!contentType && contentType.includes('application/json');
    } else if (response.headers && typeof response.headers === 'object') {
      const ct = response.headers['content-type'] || response.headers['Content-Type'];
      isJson = typeof ct === 'string' && ct.includes('application/json');
    } else {
      // If it's a plain object (mock), assume JSON
      isJson = true;
    }
  } catch (err) {
    isJson = true;
  }

  // Parse response body in a defensive manner
  let data: any;
  if (isJson && typeof response.json === 'function') {
    data = await response.json();
  } else if (isJson && response.body) {
    data = response.body;
  } else if (isJson) {
    data = response;
  } else if (typeof response.text === 'function') {
    data = await response.text();
  } else {
    data = response;
  }

  const ok = typeof response.ok === 'boolean' ? response.ok : true;
  const status = typeof response.status === 'number' ? response.status : ok ? 200 : 500;

  if (!ok) {
    const message = (isJson && data && (data.detail || data.message))
      ? (data.detail || data.message)
      : `HTTP ${status}`;
    throw new ApiError(message, status, data);
  }

  return data as T;
}

/**
 * Make a GET request to the API
 * 
 * @param endpoint - API endpoint (without base URL)
 * @param options - Request options including auth token
 * @returns Promise with typed response
 * 
 * @example
 * const user = await get<User>('users/123', { token: await user.getIdToken() });
 */
export async function get<T>(
  endpoint: string,
  options?: RequestOptions
): Promise<T> {
  const url = getUrl(endpoint);
  const headers = buildHeaders(options);

  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  return handleResponse<T>(response);
}

/**
 * Make a POST request to the API
 * 
 * @param endpoint - API endpoint (without base URL)
 * @param data - Request body data
 * @param options - Request options including auth token
 * @returns Promise with typed response
 * 
 * @example
 * const newUser = await post<User>('users', { email, display_name }, { token });
 */
export async function post<T>(
  endpoint: string,
  data: any,
  options?: RequestOptions
): Promise<T> {
  const url = getUrl(endpoint);
  const headers = buildHeaders(options);

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  return handleResponse<T>(response);
}

/**
 * Make a PUT request to the API
 * 
 * @param endpoint - API endpoint (without base URL)
 * @param data - Request body data
 * @param options - Request options including auth token
 * @returns Promise with typed response
 * 
 * @example
 * const updated = await put<User>('users/123/sarcasm', { level: 2 }, { token });
 */
export async function put<T>(
  endpoint: string,
  data: any,
  options?: RequestOptions
): Promise<T> {
  const url = getUrl(endpoint);
  const headers = buildHeaders(options);

  const response = await fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });

  return handleResponse<T>(response);
}

/**
 * Make a DELETE request to the API
 * 
 * @param endpoint - API endpoint (without base URL)
 * @param options - Request options including auth token
 * @returns Promise with typed response
 * 
 * @example
 * await delete('users/123', { token });
 */
export async function del<T>(
  endpoint: string,
  options?: RequestOptions
): Promise<T> {
  const url = getUrl(endpoint);
  const headers = buildHeaders(options);

  const response = await fetch(url, {
    method: 'DELETE',
    headers,
  });

  return handleResponse<T>(response);
}

/**
 * Check if the backend API is healthy
 * 
 * @returns Promise<boolean> - true if API is healthy
 */
export async function checkHealth(): Promise<boolean> {
  try {
    // Health check is at root, not /api
    const url = BASE_URL.endsWith('/api') 
      ? BASE_URL.replace('/api', '/api/health')
      : `${BASE_URL}/api/health`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!response || typeof response.ok !== 'boolean') {
      return false;
    }

    if (!response.ok) return false;
    
    const data = await response.json();
    return data.status === 'healthy';
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
}

// Export all functions as default object for convenience
export default {
  get,
  post,
  put,
  delete: del,
  checkHealth,
  ApiError,
};