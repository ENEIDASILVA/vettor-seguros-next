const stepLabels: Record<string, string> = {
  insurance: "Escolha do seguro",
  personal: "Dados pessoais",

  vehicle: "Dados do veículo",
  driver: "Condutor principal",
  history: "Histórico",

  property: "Dados do imóvel",
  residence: "Perfil do imóvel",

  lifeProfile: "Perfil do segurado",
  lifeRisk: "Saúde e atividades",
  lifeCoverage: "Coberturas e capital",
  beneficiaries: "Beneficiários",

  coverage: "Coberturas",
  review: "Revisão",
};

export function getStepLabel(
  flow: readonly string[],
  step: number
) {
  const key = flow[step - 1];

  if (!key) {
    return "Cotação";
  }

  return stepLabels[key] || "Cotação";
}