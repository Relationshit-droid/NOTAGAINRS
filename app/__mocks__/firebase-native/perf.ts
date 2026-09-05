export default function mockPerf() {
  return {
    newTrace: (name: string) => {
      let metrics: Record<string, number> = {};
      return {
        start: async () => {},
        putMetric: (key: string, value: number) => {
          metrics[key] = value;
        },
        stop: async () => {},
        getMetrics: () => metrics,
      };
    },
  };
}
