/** Minimal Firebase Storage mock. */
export const getStorage = () => ({ type: 'storage' });
export const ref = (...args: any[]) => ({ type: 'ref', args });
export const uploadBytes = jest.fn(async () => ({ ref: { fullPath: 'mock/path' } }));
export const uploadString = jest.fn(async () => ({ ref: { fullPath: 'mock/path' } }));
export const getDownloadURL = jest.fn(async () => 'https://example.test/mock.png');
export const deleteObject = jest.fn(async () => undefined);
