export const getFunctions = () => ({
  name: 'mockFunctions',
});

export const httpsCallable = (_functions: any, _name: string) => {
  return async (payload: any) => ({ data: { ...payload } });
};
