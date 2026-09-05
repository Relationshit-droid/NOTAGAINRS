/**
 * Performance Utilities Tests
 */

import {
  debounce,
  throttle,
  preloadImage,
  preloadImages,
} from '../../lib/performance';

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should delay function execution', () => {
    const fn = jest.fn();
    const debouncedFn = debounce(fn, 1000);
    
    debouncedFn();
    expect(fn).not.toHaveBeenCalled();
    
    jest.advanceTimersByTime(1000);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should reset timer on multiple calls', () => {
    const fn = jest.fn();
    const debouncedFn = debounce(fn, 1000);
    
    debouncedFn();
    jest.advanceTimersByTime(500);
    debouncedFn();
    jest.advanceTimersByTime(500);
    
    expect(fn).not.toHaveBeenCalled();
    
    jest.advanceTimersByTime(500);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should pass arguments to debounced function', () => {
    const fn = jest.fn();
    const debouncedFn = debounce(fn, 1000);
    
    debouncedFn('arg1', 'arg2');
    jest.advanceTimersByTime(1000);
    
    expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
  });
});

describe('throttle', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should execute function immediately', () => {
    const fn = jest.fn();
    const throttledFn = throttle(fn, 1000);
    
    throttledFn();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should ignore calls during throttle period', () => {
    const fn = jest.fn();
    const throttledFn = throttle(fn, 1000);
    
    throttledFn();
    throttledFn();
    throttledFn();
    
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should allow execution after throttle period', () => {
    const fn = jest.fn();
    const throttledFn = throttle(fn, 1000);
    
    throttledFn();
    jest.advanceTimersByTime(1000);
    throttledFn();
    
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe('preloadImage', () => {
  let mockImage: any;

  beforeEach(() => {
    mockImage = {
      onload: null,
      onerror: null,
      src: '',
    };
    global.Image = jest.fn(() => mockImage) as any;
  });

  it('should resolve when image loads', async () => {
    const preloadPromise = preloadImage('https://example.com/image.png');
    
    mockImage.onload();
    
    await expect(preloadPromise).resolves.toBeUndefined();
  });

  it('should reject when image fails to load', async () => {
    const preloadPromise = preloadImage('https://example.com/image.png');
    
    mockImage.onerror();
    
    await expect(preloadPromise).rejects.toThrow(/Failed to preload image/);
  });
});

describe('preloadImages', () => {
  let created: any[];

  beforeEach(() => {
    created = [];
    global.Image = jest.fn(() => {
      const img = { onload: null as any, onerror: null as any, src: '' };
      created.push(img);
      return img;
    }) as any;
  });

  it('should preload multiple images', async () => {
    const urls = [
      'https://example.com/1.png',
      'https://example.com/2.png',
      'https://example.com/3.png',
    ];
    
    const preloadPromise = preloadImages(urls);

    // Each URL gets its own Image instance; fire onload on every one.
    created.forEach(img => img.onload());

    await expect(preloadPromise).resolves.toBeUndefined();
    expect(global.Image).toHaveBeenCalledTimes(3);
  });
});
