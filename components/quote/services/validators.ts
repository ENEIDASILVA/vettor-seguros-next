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
  if (step === 1) {
    return form.insuranceType !== "";
  }

  if (step === 2) {
    return (
      form.name.trim() !== "" &&
      form.phone.trim() !== "" &&
      isValidEmail(form.email) &&
      isValidCPF(form.cpf)
    );
  }

  if (form.insuranceType === "Seguro Auto") {
    if (step === 3) {
      return (
        form.vehicleType.trim() !== "" &&
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

  if (form.insuranceType === "Seguro Residencial") {
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

    if (step === 4) {
      return (
        form.propertyUse.trim() !== "" &&
        form.propertyAlarm.trim() !== "" &&
        form.propertyMonitoring.trim() !== "" &&
        form.propertyGatedCommunity.trim() !== ""
      );
    }

    if (step === 5) {
      return form.coverages.length > 0;
    }
  }

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