export const lifeFlow = [
  "insurance",
  "personal",
  "lifeProfile",
  "lifeRisk",
  "lifeCoverage",
  "beneficiaries",
  "review",
] as const;

export type LifeFlowStep =
  (typeof lifeFlow)[number];