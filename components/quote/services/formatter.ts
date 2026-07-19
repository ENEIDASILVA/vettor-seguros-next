import { QuoteFormData } from "../types";

function value(text: string) {
  return text && text.trim() !== ""
    ? text.trim()
    : "Não informado";
}

function formatCoverages(form: QuoteFormData) {
  if (form.coverages.length === 0) {
    return "Não informado";
  }

  return form.coverages
    .map((coverage) => "• " + coverage)
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

  return [firstLine, secondLine]
    .filter((item) => item.trim() !== "")
    .join("\n");
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
  const lines: string[] = [
    "🚗 NOVA SOLICITAÇÃO DE COTAÇÃO - VETTOR SEGUROS",
    "",
    "SEGURO AUTO",
    "",
    "👤 DADOS DO CLIENTE",
    "Nome: " + value(form.name),
    "Telefone: " + value(form.phone),
  ];

  if (form.email.trim() !== "") {
    lines.push("E-mail: " + form.email.trim());
  }

  lines.push(
    "CPF: " + value(form.cpf),
    "",
    "🚘 VEÍCULO",
    "Marca: " + value(form.vehicleBrand),
    "Modelo: " + value(form.vehicleModel),
    "Ano / Versão: " + value(form.vehicleYear)
  );

  if (form.vehicleFuel.trim() !== "") {
    lines.push(
      "Combustível: " + form.vehicleFuel.trim()
    );
  }

  if (form.vehicleFipeCode.trim() !== "") {
    lines.push(
      "Código FIPE: " + form.vehicleFipeCode.trim()
    );
  }

  lines.push(
    "Garagem: " + value(form.vehicleGarage),
    "Uso por aplicativo: " + value(form.vehicleApp),
    "Rastreador: " + value(form.vehicleTracker),
    "",
    "📍 ENDEREÇO DE PERNOITE",
    "CEP: " + value(form.vehicleCep),
    formatAddress(form) || "Endereço não informado",
    "",
    "👤 CONDUTOR PRINCIPAL",
    "Nome: " + value(form.driverName),
    "Data de nascimento: " +
      value(form.driverBirthDate),
    "Estado civil: " +
      value(form.driverMaritalStatus),
    "Profissão: " +
      value(form.driverProfession),
    "É o principal condutor: " +
      value(form.driverIsMain),
    "Outro condutor frequente: " +
      value(form.driverHasSecondary),
    "Condutor entre 18 e 25 anos: " +
      value(form.driverYoung),
    "",
    "📋 HISTÓRICO DO SEGURO",
    "Possui seguro atualmente: " +
      value(form.currentInsurance)
  );

  if (form.currentInsurance === "Sim") {
    lines.push(
      "Seguradora atual: " +
        value(form.currentInsurer),
      "Classe de bônus: " +
        value(form.bonusClass),
      "Sinistro na vigência atual: " +
        value(form.hadClaims)
    );

    if (form.hadClaims === "Sim") {
      lines.push(
        "Quantidade de sinistros: " +
          value(form.claimsCount)
      );
    }
  }

  if (form.currentInsurance === "Não") {
    lines.push("Cliente sem seguro vigente.");
  }

  lines.push(
    "",
    "🛡️ COBERTURAS DESEJADAS",
    formatCoverages(form)
  );

  if (form.observations.trim() !== "") {
    lines.push(
      "",
      "📝 OBSERVAÇÕES",
      form.observations.trim()
    );
  }

  return lines.join("\n");
}

function formatResidentialMessage(
  form: QuoteFormData
) {
  const lines: string[] = [
    "🏠 NOVA SOLICITAÇÃO DE COTAÇÃO - VETTOR SEGUROS",
    "",
    "SEGURO RESIDENCIAL",
    "",
    "👤 DADOS DO CLIENTE",
    "Nome: " + value(form.name),
    "Telefone: " + value(form.phone),
  ];

  if (form.email.trim() !== "") {
    lines.push("E-mail: " + form.email.trim());
  }

  lines.push(
    "CPF: " + value(form.cpf),
    "",
    "🏠 DADOS DO IMÓVEL",
    "CEP: " + value(form.propertyCep),
    formatAddress(form) || "Endereço não informado",
    "Tipo do imóvel: " + value(form.propertyType),
    "Situação do imóvel: " +
      value(form.propertyStatus),
    "Área construída: " +
      value(form.propertyArea) +
      (form.propertyArea.trim() !== ""
        ? " m²"
        : ""),
    "Valor aproximado: " +
      value(form.propertyValue),
    "",
    "🔐 PERFIL DO IMÓVEL",
    "Utilização: " + value(form.propertyUse),
    "Possui alarme: " +
      value(form.propertyAlarm),
    "Monitoramento eletrônico: " +
      value(form.propertyMonitoring),
    "Condomínio fechado: " +
      value(form.propertyGatedCommunity),
    "",
    "🛡️ COBERTURAS DESEJADAS",
    formatCoverages(form)
  );

  if (form.observations.trim() !== "") {
    lines.push(
      "",
      "📝 OBSERVAÇÕES",
      form.observations.trim()
    );
  }

  return lines.join("\n");
}

function formatLifeMessage(form: QuoteFormData) {
  const lines: string[] = [
    "❤️ NOVA SOLICITAÇÃO DE COTAÇÃO - VETTOR SEGUROS",
    "",
    "SEGURO DE VIDA",
    "",
    "👤 DADOS DO SEGURADO",
    "Nome: " + value(form.name),
    "Telefone: " + value(form.phone),
  ];

  if (form.email.trim() !== "") {
    lines.push("E-mail: " + form.email.trim());
  }

  lines.push(
    "CPF: " + value(form.cpf),
    "",
    "🧾 PERFIL DO SEGURADO",
    "Data de nascimento: " +
      value(form.lifeBirthDate),
    "Estado civil: " +
      value(form.lifeMaritalStatus),
    "Profissão: " +
      value(form.lifeProfession),
    "Renda mensal aproximada: " +
      value(form.lifeMonthlyIncome),
    "",
    "⚕️ SAÚDE E ATIVIDADES",
    "Fumante: " + value(form.lifeSmoker),
    "Atividade profissional de risco: " +
      value(form.lifeRiskActivity),
    "Pratica esportes radicais: " +
      value(form.lifeExtremeSports),
    "Viagens frequentes a trabalho: " +
      value(form.lifeFrequentTravel),
    "",
    "🛡️ CAPITAL E COBERTURAS",
    "Capital segurado: " +
      value(form.lifeInsuredCapital),
    "",
    formatCoverages(form),
    "",
    "👥 BENEFICIÁRIOS",
    formatBeneficiaries(form)
  );

  if (form.observations.trim() !== "") {
    lines.push(
      "",
      "📝 OBSERVAÇÕES",
      form.observations.trim()
    );
  }

  return lines.join("\n");
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