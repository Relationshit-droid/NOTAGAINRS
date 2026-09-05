/** Minimal Realtime Database mock. */
export const getDatabase = () => ({ type: 'database' });
export const ref = (...args: any[]) => ({ type: 'ref', args });
export const set = jest.fn(async () => undefined);
export const update = jest.fn(async () => undefined);
export const remove = jest.fn(async () => undefined);
export const onValue = jest.fn(() => () => {});
export const off = jest.fn();
export const onDisconnect = () => ({ set: jest.fn(async () => undefined), remove: jest.fn(async () => undefined) });
export const serverTimestamp = () => ({ '.sv': 'timestamp' });
