/**
 * API Retry Logic Tests
 */

import { fetchWithRetry, RetryableAPI, OfflineQueue } from '../apiRetry';
import { ENV } from '../env';

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('fetchWithRetry', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('should return response on successful request', async () => {
    const mockResponse = new Response(JSON.stringify({ data: 'test' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    mockFetch.mockResolvedValueOnce(mockResponse);

    const response = await fetchWithRetry('https://api.example.com/test');
    
    expect(response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should retry on network error', async () => {
    mockFetch
      .mockRejectedValueOnce(new TypeError('Network error'))
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: 'test' }), { status: 200 }));

    const response = await fetchWithRetry('https://api.example.com/test', {
      retry: { maxRetries: 1, baseDelayMs: 10 }
    });

    expect(response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('should retry on retryable status codes', async () => {
    mockFetch
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: 'test' }), { status: 200 }));

    const response = await fetchWithRetry('https://api.example.com/test', {
      retry: { maxRetries: 1, baseDelayMs: 10 }
    });

    expect(response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('should throw after max retries exceeded', async () => {
    mockFetch.mockRejectedValue(new TypeError('Network error'));

    await expect(
      fetchWithRetry('https://api.example.com/test', {
        retry: { maxRetries: 2, baseDelayMs: 10 }
      })
    ).rejects.toThrow('Network error');

    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it('should not retry on 4xx errors (except retryable ones)', async () => {
    mockFetch.mockResolvedValueOnce(new Response(null, { status: 404 }));

    const response = await fetchWithRetry('https://api.example.com/test');

    expect(response.status).toBe(404);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});

describe('RetryableAPI', () => {
  let api: RetryableAPI;

  beforeEach(() => {
    api = new RetryableAPI('https://api.example.com', { maxRetries: 1, baseDelayMs: 10 });
    mockFetch.mockReset();
  });

  it('should make GET request', async () => {
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({ data: 'test' }), { status: 200 }));

    const response = await api.get('/test');

    expect(response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/test',
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('should make POST request with JSON body', async () => {
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({ id: 1 }), { status: 201 }));

    const response = await api.post('/test', { name: 'test' });

    expect(response.status).toBe(201);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/test',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'test' })
      })
    );
  });

  it('should make PUT request', async () => {
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({ updated: true }), { status: 200 }));

    const response = await api.put('/test/1', { name: 'updated' });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/test/1',
      expect.objectContaining({ method: 'PUT' })
    );
  });

  it('should make DELETE request', async () => {
    mockFetch.mockResolvedValueOnce(new Response(null, { status: 204 }));

    const response = await api.delete('/test/1');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/test/1',
      expect.objectContaining({ method: 'DELETE' })
    );
  });
});

describe('OfflineQueue', () => {
  let queue: OfflineQueue;

  beforeEach(() => {
    queue = new OfflineQueue();
    queue.clear();
    mockFetch.mockReset();
  });

  it('should enqueue requests', () => {
    const id = queue.enqueue('https://api.example.com/test', { method: 'POST' });
    
    expect(id).toBeDefined();
    expect(queue.getQueueSize()).toBe(1);
  });

  it('should dequeue requests', () => {
    const id = queue.enqueue('https://api.example.com/test', { method: 'POST' });
    queue.dequeue(id);
    
    expect(queue.getQueueSize()).toBe(0);
  });

  it('should clear queue', () => {
    queue.enqueue('https://api.example.com/test1', { method: 'POST' });
    queue.enqueue('https://api.example.com/test2', { method: 'POST' });
    queue.clear();
    
    expect(queue.getQueueSize()).toBe(0);
  });
});
