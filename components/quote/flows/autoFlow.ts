export const autoFlow = [
  "insurance",
  "personal",
  "vehicle",
  "driver",
  "history",
  "coverage",
  "review",
] as const;

export type AutoFlowStep = (typeof autoFlow)[number];