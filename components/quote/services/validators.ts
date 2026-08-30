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
    if (form.insuranceType === "Seguro Residencial") {
      return (
        form.name.trim() !== "" &&
        form.phone.trim() !== "" &&
        isValidEmail(form.email) &&
        isValidCPF(form.cpf) &&
        isValidCep(form.propertyCep) &&
        form.residentialContactConsent === "Sim"
      );
    }

    return (
      form.name.trim() !== "" &&
      form.phone.trim() !== "" &&
      isValidEmail(form.email) &&
      isValidCPF(form.cpf)
    );
  }

  if (form.insuranceType === "Seguro Auto") {
    if (step === 3) {
      const placaValida =
        /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(
          form.vehiclePlate ?? "",
        );

      return Boolean(
        form.vehicleBrand &&
        form.vehicleModel &&
        form.vehicleYear &&
        placaValida &&
        form.vehicleCep
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

  if (form.insuranceType === "Seguro Empresarial") {
    if (step === 3) return onlyNumbers(form.businessCnpj).length === 14 && form.businessLegalName.trim() !== "" && form.businessActivity.trim() !== "" && isValidCep(form.businessCep);
    if (step === 4) return form.businessEmployees.trim() !== "" && form.businessAnnualRevenue.trim() !== "" && form.businessPropertyStatus.trim() !== "";
    if (step === 5) return form.coverages.length > 0;
  }

  if (form.insuranceType === "Seguro Saúde") {
    if (step === 3) return form.healthPlanFor.trim() !== "" && Number(form.healthLives) > 0 && form.healthAges.trim() !== "" && form.healthScope.trim() !== "";
    if (step === 4) return form.healthHasPlan.trim() !== "" && (form.healthHasPlan !== "Sim" || form.healthCurrentOperator.trim() !== "") && form.healthAccommodation.trim() !== "" && form.healthCopay.trim() !== "";
    if (step === 5) return form.coverages.length > 0;
  }

  if (form.insuranceType === "Seguro Rural") {
    if (step === 3) return form.ruralPropertyName.trim() !== "" && isValidCep(form.ruralCep) && form.ruralActivity.trim() !== "" && form.ruralArea.trim() !== "" && form.ruralAnnualRevenue.trim() !== "";
    if (step === 4) return form.ruralMachineryValue.trim() !== "" && form.ruralHasLivestock.trim() !== "" && form.ruralHasStorage.trim() !== "";
    if (step === 5) return form.coverages.length > 0;
  }

  if (form.insuranceType === "Seguro Viagem") {
    if (step === 3) return form.travelDestination.trim() !== "" && form.travelDepartureDate.length === 10 && form.travelReturnDate.length === 10 && Number(form.travelTravelers) > 0 && form.travelAges.trim() !== "";
    if (step === 4) return form.travelPurpose.trim() !== "" && form.travelHasPreexistingCondition.trim() !== "" && form.travelWillPracticeSports.trim() !== "";
    if (step === 5) return form.coverages.length > 0;
  }

  return true;
}
