import { QuoteFormData } from "../types";

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
      form.email.trim() !== ""
    );
  }

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
      return form.driverName.trim() !== "";
    }

    if (step === 6) {
      return form.coverages.length > 0;
    }
  }

  if (form.insuranceType === "Seguro Residencial") {
    if (step === 3) {
      return (
        isValidCep(form.vehicleCep) &&
        form.vehicleBrand.trim() !== "" &&
        form.vehicleModel.trim() !== ""
      );
    }

    if (step === 4) {
      return (
        form.driverIsMain !== "" &&
        form.driverHasSecondary !== "" &&
        form.driverYoung !== "" &&
        form.vehicleGarage !== ""
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