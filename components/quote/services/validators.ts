import { QuoteFormData } from "../types";

import {
  isValidCPF,
  isValidEmail,
  isValidDate,
  isAdult,
} from "../utils/validators";

function onlyNumbers(value: string) {
  return value.replace(/\D/g, "");
}

function isValidCep(value: string) {
  return onlyNumbers(value).length === 8;
}

function beneficiariesTotal(form: QuoteFormData) {
  return form.beneficiaries.reduce(
    (total, beneficiary) =>
      total + Number(beneficiary.percentage || 0),
    0
  );
}

export function canProceed(
  step: number,
  form: QuoteFormData
) {
  // Etapa 1 — Tipo de seguro
  if (step === 1) {
    return form.insuranceType !== "";
  }

  // Etapa 2 — Dados pessoais
  if (step === 2) {
    return (
      form.name.trim() !== "" &&
      form.phone.trim() !== "" &&
      isValidEmail(form.email) &&
      isValidCPF(form.cpf)
    );
  }

  // Seguro Auto
  if (form.insuranceType === "Seguro Auto") {
    if (step === 3) {
      return (
        form.vehicleBrand.trim() !== "" &&
        form.vehicleModel.trim() !== "" &&
        form.vehicleYear.trim() !== "" &&
        isValidCep(form.vehicleCep)
      );
    }

    if (step === 4) {
      return (
        form.driverName.trim() !== "" &&
        isValidDate(form.driverBirthDate) &&
        isAdult(form.driverBirthDate)
      );
    }

    if (step === 6) {
      return form.coverages.length > 0;
    }
  }

  // Seguro Residencial
  if (form.insuranceType === "Seguro Residencial") {
    // Etapa 3 — Dados do imóvel
    if (step === 3) {
      return (
        isValidCep(form.propertyCep) &&
        form.address.trim() !== "" &&
        form.addressNumber.trim() !== "" &&
        form.district.trim() !== "" &&
        form.city.trim() !== "" &&
        form.state.trim().length === 2 &&
        form.propertyType.trim() !== "" &&
        form.propertyStatus.trim() !== "" &&
        form.propertyArea.trim() !== "" &&
        form.propertyValue.trim() !== ""
      );
    }

    // Etapa 4 — Perfil do imóvel
    if (step === 4) {
      return (
        form.propertyUse.trim() !== "" &&
        form.propertyAlarm.trim() !== "" &&
        form.propertyMonitoring.trim() !== "" &&
        form.propertyGatedCommunity.trim() !== ""
      );
    }

    // Etapa 5 — Coberturas
    if (step === 5) {
      return form.coverages.length > 0;
    }
  }

  // Seguro de Vida
  if (form.insuranceType === "Seguro de Vida") {
    if (step === 3) {
      return (
        form.lifeBirthDate.trim() !== "" &&
        form.lifeMaritalStatus.trim() !== "" &&
        form.lifeProfession.trim() !== "" &&
        form.lifeMonthlyIncome.trim() !== ""
      );
    }

    if (step === 4) {
      return (
        form.lifeSmoker !== "" &&
        form.lifeRiskActivity !== "" &&
        form.lifeExtremeSports !== "" &&
        form.lifeFrequentTravel !== ""
      );
    }

    if (step === 5) {
      return (
        form.lifeInsuredCapital.trim() !== "" &&
        form.coverages.length > 0
      );
    }

    if (step === 6) {
      return (
        form.beneficiaries.length > 0 &&
        beneficiariesTotal(form) === 100
      );
    }
  }

  return true;
}