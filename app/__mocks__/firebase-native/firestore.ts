export default function mockFirestore() {
  return {
    collection: (_path: string) => ({
      doc: (_id?: string) => ({
        set: async (_data: any) => ({ success: true }),
        get: async () => ({ exists: false, data: () => ({}) }),
        update: async (_data: any) => ({ success: true }),
      }),
    }),
  };
}
