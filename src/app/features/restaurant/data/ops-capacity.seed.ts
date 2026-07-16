/** Shared seed for capacity + Busy (F08). */
export interface OpsCapacityDaySeed {
  offset: number;
  confirmed: number;
}

export const OPS_CAPACITY_SEED = {
  dailyLimit: 120,
  nearLimitThreshold: 0.85,
  days: [
    { offset: -3, confirmed: 110 },
    { offset: -2, confirmed: 120 },
    { offset: -1, confirmed: 95 },
    { offset: 0, confirmed: 98 },
    { offset: 1, confirmed: 42 },
    { offset: 2, confirmed: 18 },
    { offset: 3, confirmed: 0 },
    { offset: 4, confirmed: 0 },
    { offset: 5, confirmed: 5 },
    { offset: 6, confirmed: 0 },
    { offset: 7, confirmed: 0 },
  ] as const satisfies readonly OpsCapacityDaySeed[],
  /** Manual Busy dates keyed by day offset. */
  manualBusyOffsets: [1] as const,
};
