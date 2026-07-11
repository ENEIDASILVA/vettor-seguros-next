export const residentialFlow = [
  "insurance",
  "personal",
  "property",
  "residence",
  "coverage",
  "review",
] as const;

export type ResidentialFlowStep =
  (typeof residentialFlow)[number];