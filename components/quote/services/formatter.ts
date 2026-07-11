import { QuoteFormData } from "../types";

function value(text: string) {
  return text && text.trim() !== ""
    ? text
    : "Não informado";
}

function formatCoverages(form: QuoteFormData) {
  if (form.coverages.length === 0) {
    return "Não informado";
  }

  return form.coverages
    .map((item) => "• " + item)
    .join("\n");
}

function formatAddress(form: QuoteFormData) {
  const firstLine = [
    form.address,
    form.addressNumber,
    form.addressComplement,
  ]
    .filter((item) => item.trim() !== "")
    .join(", ");

  const secondLine = [
    form.district,
    form.city,
    form.state,
  ]
    .filter((item) => item.trim() !== "")
    .join(" - ");

  const address = [
    firstLine,
    secondLine,
  ]
    .filter((item) => item.trim() !== "")
    .join("\n");

  return value(address);
}

function formatBeneficiaries(form: QuoteFormData) {
  if (form.beneficiaries.length === 0) {
    return "Não informado";
  }

  return form.beneficiaries
    .map((beneficiary) => {
      return (
        "• " +
        beneficiary.name +
        " | " +
        beneficiary.relationship +
        " | " +
        beneficiary.percentage +
        "%"
      );
    })
    .join("\n");
}

function formatAutoMessage(form: QuoteFormData) {
  return [
    "🚗 NOVA SOLICITAÇÃO DE COTAÇÃO - VETTOR SEGUROS",
    "",
    "Seguro: " + value(form.insuranceType),
    "",
    "CLIENTE",
    "Nome: " + value(form.name),
    "Telefone: " + value(form.phone),
    "E-mail: " + value(form.email),
    "CPF: " + value(form.cpf),
    "",
    "VEÍCULO",
    "Marca: " + value(form.vehicleBrand),
    "Modelo: " + value(form.vehicleModel),
    "Ano: " + value(form.vehicleYear),
    "CEP de pernoite: " + value(form.vehicleCep),
    "Endereço:",
    formatAddress(form),
    "Garagem: " + value(form.vehicleGarage),
    "Uso por aplicativo: " + value(form.vehicleApp),
    "Rastreador: " + value(form.vehicleTracker),
    "",
    "CONDUTOR",
    "Nome: " + value(form.driverName),
    "Nascimento: " + value(form.driverBirthDate),
    "Estado civil: " + value(form.driverMaritalStatus),
    "Profissão: " + value(form.driverProfession),
    "Principal condutor: " + value(form.driverIsMain),
    "Outro condutor frequente: " +
      value(form.driverHasSecondary),
    "Condutor de 18 a 25 anos: " +
      value(form.driverYoung),
    "",
    "HISTÓRICO",
    "Seguro atual: " + value(form.currentInsurance),
    "Seguradora: " + value(form.currentInsurer),
    "Classe de bônus: " + value(form.bonusClass),
    "Sinistro: " + value(form.hadClaims),
    "Quantidade: " + value(form.claimsCount),
    "Recusa anterior: " +
      value(form.insuranceRefused),
    "",
    "COBERTURAS",
    formatCoverages(form),
    "",
    "OBSERVAÇÕES",
    value(form.observations),
  ].join("\n");
}

function formatResidentialMessage(
  form: QuoteFormData
) {
  return [
    "🏠 NOVA SOLICITAÇÃO DE COTAÇÃO - VETTOR SEGUROS",
    "",
    "Seguro: " + value(form.insuranceType),
    "",
    "CLIENTE",
    "Nome: " + value(form.name),
    "Telefone: " + value(form.phone),
    "E-mail: " + value(form.email),
    "CPF: " + value(form.cpf),
    "",
    "IMÓVEL",
    "CEP: " + value(form.vehicleCep),
    "Endereço:",
    formatAddress(form),
    "Tipo: " + value(form.vehicleBrand),
    "Situação: " + value(form.vehicleModel),
    "Área construída: " +
      value(form.vehicleYear) +
      " m²",
    "Valor aproximado: " +
      value(form.observations),
    "",
    "PERFIL DO IMÓVEL",
    "Utilização: " + value(form.driverIsMain),
    "Possui alarme: " +
      value(form.driverHasSecondary),
    "Monitoramento eletrônico: " +
      value(form.driverYoung),
    "Condomínio fechado: " +
      value(form.vehicleGarage),
    "",
    "COBERTURAS",
    formatCoverages(form),
  ].join("\n");
}

function formatLifeMessage(form: QuoteFormData) {
  return [
    "❤️ NOVA SOLICITAÇÃO DE COTAÇÃO - VETTOR SEGUROS",
    "",
    "Seguro: " + value(form.insuranceType),
    "",
    "SEGURADO",
    "Nome: " + value(form.name),
    "Telefone: " + value(form.phone),
    "E-mail: " + value(form.email),
    "CPF: " + value(form.cpf),
    "",
    "PERFIL DO SEGURADO",
    "Data de nascimento: " +
      value(form.lifeBirthDate),
    "Estado civil: " +
      value(form.lifeMaritalStatus),
    "Profissão: " +
      value(form.lifeProfession),
    "Renda mensal: " +
      value(form.lifeMonthlyIncome),
    "",
    "SAÚDE E ATIVIDADES",
    "Fumante: " + value(form.lifeSmoker),
    "Atividade profissional de risco: " +
      value(form.lifeRiskActivity),
    "Pratica esportes radicais: " +
      value(form.lifeExtremeSports),
    "Viagens frequentes a trabalho: " +
      value(form.lifeFrequentTravel),
    "",
    "CAPITAL E COBERTURAS",
    "Capital segurado: " +
      value(form.lifeInsuredCapital),
    "",
    formatCoverages(form),
    "",
    "BENEFICIÁRIOS",
    formatBeneficiaries(form),
    "",
    "OBSERVAÇÕES",
    value(form.observations),
  ].join("\n");
}

export function formatWhatsAppMessage(
  form: QuoteFormData
) {
  if (form.insuranceType === "Seguro Residencial") {
    return formatResidentialMessage(form);
  }

  if (form.insuranceType === "Seguro de Vida") {
    return formatLifeMessage(form);
  }

  return formatAutoMessage(form);
}