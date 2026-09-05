/**
 * Data client for RELATIONSHIT!
 *
 * Keeps the REST-shaped surface (`get('users/123')`) that ~80 screens and
 * hooks are written against, but services every request from Firestore via
 * `firestoreRouter`. The original FastAPI backend this spoke to is prohibited
 * by the Firebase-only mandate.
 *
 * The `token` option is retained for call-site compatibility and ignored:
 * Firestore authenticates through the Firebase SDK and enforces access in
 * firestore.rules.
 */

import { request } from './firestoreRouter';

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
  try {
    return await request<T>('GET', endpoint, undefined);
  } catch (error) {
    throw new ApiError(
      error instanceof Error ? error.message : 'Request failed',
      undefined,
      error
    );
  }
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
  try {
    return await request<T>('POST', endpoint, data);
  } catch (error) {
    throw new ApiError(
      error instanceof Error ? error.message : 'Request failed',
      undefined,
      error
    );
  }
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
  try {
    return await request<T>('PUT', endpoint, data);
  } catch (error) {
    throw new ApiError(
      error instanceof Error ? error.message : 'Request failed',
      undefined,
      error
    );
  }
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
  try {
    return await request<T>('DELETE', endpoint, undefined);
  } catch (error) {
    throw new ApiError(
      error instanceof Error ? error.message : 'Request failed',
      undefined,
      error
    );
  }
}

/**
 * Check if the backend API is healthy
 * 
 * @returns Promise<boolean> - true if API is healthy
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const res = await request<{ status: string }>('GET', 'health');
    return res?.status === 'ok';
  } catch {
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