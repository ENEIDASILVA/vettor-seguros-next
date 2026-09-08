import { QuoteFormData } from "../types";

import {
  isValidCPF,
  isValidEmail,
  isValidDate,
  isAdult,
  getDateValidationError,
  parseBrazilianDate,
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
        [10, 11].includes(onlyNumbers(form.phone).length) &&
        form.email.trim() !== "" && isValidEmail(form.email) &&
        isValidCPF(form.cpf) &&
        isValidCep(form.propertyCep) &&
        form.residentialContactConsent === "Sim"
      );
    }

    return (
      form.name.trim() !== "" &&
      [10, 11].includes(onlyNumbers(form.phone).length) &&
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
        (!form.vehiclePlate.trim() || placaValida) &&
        isValidCep(form.vehicleCep) && form.address.trim() && form.addressNumber.trim() && form.district.trim() && form.city.trim() && form.state.trim().length === 2
      );
    }

    if (step === 4) {
      return (
        form.driverName.trim() !== "" &&
        isValidDate(form.driverBirthDate) &&
        isAdult(form.driverBirthDate) && getDateValidationError(form.driverBirthDate) === ""
      );
    }

    if (step === 5) return form.currentInsurance !== "Sim" || Boolean(form.currentInsurer.trim() && form.bonusClass.trim() && (form.hadClaims !== "Sim" || Number(form.claimsCount) > 0));

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
        isValidDate(form.lifeBirthDate) && getDateValidationError(form.lifeBirthDate) === "" &&
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
    if (step === 3) return isValidCnpj(form.businessCnpj) && form.businessLegalName.trim() !== "" && form.businessActivity.trim() !== "" && isValidCep(form.businessCep);
    if (step === 4) return form.businessEmployees.trim() !== "" && form.businessAnnualRevenue.trim() !== "" && form.businessPropertyStatus.trim() !== "";
    if (step === 5) return form.coverages.length > 0;
  }

  if (form.insuranceType === "Seguro Saúde") {
    if (step === 3) return form.healthPlanFor.trim() !== "" && Number(form.healthLives) > 0 && form.healthAges.trim() !== "" && form.healthScope.trim() !== "";
    if (step === 4) return form.healthHasPlan.trim() !== "" && (form.healthHasPlan !== "Sim" || form.healthCurrentOperator.trim() !== "") && form.healthAccommodation.trim() !== "" && form.healthCopay.trim() !== "";
    if (step === 5) return form.coverages.length > 0;
  }

  if (form.insuranceType === "Seguro de Equipamentos") {

    if (step === 3) return Boolean(["Financiado", "Não Financiado"].includes(form.equipmentFinancing) && form.equipmentInsuranceType && form.equipmentSegment.trim() && form.equipmentProponent.trim() && ((form.equipmentPerson === "Física" && isValidCPF(form.equipmentDocument)) || (form.equipmentPerson === "Jurídica" && isValidCnpj(form.equipmentDocument))));
    if (step === 4) return Boolean(form.equipmentDescription.trim() && form.equipmentBrand.trim() && form.equipmentModel.trim() && Number(form.equipmentQuantity) > 0 && ["Sim","Não"].includes(form.equipmentHasInvoice) && (form.equipmentHasInvoice !== "Sim" || (form.equipmentInvoiceNumber.trim() && form.equipmentInvoiceIssuer.trim())) && Number(form.equipmentYear) >= 1900 && Number(form.equipmentYear) <= new Date().getFullYear() + 1 && Number(onlyNumbers(form.equipmentValue)) > 0 && isValidCep(form.equipmentCep) && form.equipmentUse.trim());
    if (step === 5) return Number(onlyNumbers(form.equipmentBasicLimit)) > 0;
    if (step === 6) return ["Sim", "Não"].includes(form.equipmentPlated) && (form.equipmentPlated !== "Sim" || /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(form.equipmentPlate)) && ["Sim","Não"].includes(form.equipmentMounted) && ["Sim","Não"].includes(form.equipmentLegalSituation) && ["Sim","Não"].includes(form.equipmentThirdParty) && ["Todo Território Nacional","Local Determinado"].includes(form.equipmentTerritory) && (form.equipmentTerritory !== "Local Determinado" || form.equipmentLocation.trim() !== "");
  }

  if (form.insuranceType === "Seguro Viagem") {
    if (step === 3) return form.travelDestination.trim() !== "" && validTravelDates(form.travelDepartureDate, form.travelReturnDate) && Number(form.travelTravelers) > 0 && form.travelAges.trim() !== "";
    if (step === 4) return form.travelPurpose.trim() !== "" && form.travelHasPreexistingCondition.trim() !== "" && form.travelWillPracticeSports.trim() !== "";
    if (step === 5) return form.coverages.length > 0;
  }

  return true;
}

export function isValidCnpj(value: string) {
 const digits = onlyNumbers(value);
 if (!/^\d{14}$/.test(digits) || /^(\d)\1+$/.test(digits)) return false;
 const check = (length: number) => { let sum = 0; let weight = length - 7; for (let i=0; i<length; i++) { sum += Number(digits[i]) * weight--; if (weight < 2) weight=9; } const remainder=sum % 11; return Number(digits[length]) === (remainder < 2 ? 0 : 11-remainder); };
 return check(12) && check(13);
}

function validTravelDates(departure: string, returning: string) {
 const start = parseBrazilianDate(departure);
 const end = parseBrazilianDate(returning);
 return Boolean(start && end && end >= start);
}

export function getStepErrors(step: number, form: QuoteFormData): string[] {
 if (canProceed(step, form)) return [];
 if (step === 2) {
  const errors: string[] = [];
  if (!form.name.trim()) errors.push("Informe o nome completo.");
  if (![10,11].includes(onlyNumbers(form.phone).length)) errors.push("Informe o telefone com DDD (10 ou 11 dígitos).");
  if (!isValidEmail(form.email) || (form.insuranceType === "Seguro Residencial" && !form.email.trim())) errors.push("Confira o e-mail informado.");
  if (!isValidCPF(form.cpf)) errors.push("Informe um CPF válido com 11 dígitos.");
  if (form.insuranceType === "Seguro Residencial") {
   if (!isValidCep(form.propertyCep)) errors.push("Informe o CEP do imóvel com 8 dígitos.");
   if (form.residentialContactConsent !== "Sim") errors.push("Marque a autorização de contato.");
  }
  return errors;
 }
 if (form.insuranceType === "Seguro Auto" && step === 3) {
  const errors: string[] = [];
  if (!form.vehicleBrand.trim()) errors.push("Selecione a marca na lista de opções.");
  if (!form.vehicleModel.trim()) errors.push("Selecione o modelo na lista de opções.");
  if (!form.vehicleYear.trim()) errors.push("Selecione o ano / versão na lista de opções.");
  if (form.vehiclePlate.trim() && !/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(form.vehiclePlate)) errors.push("Confira a placa ou deixe o campo vazio se o veículo ainda não possui placa.");
  if (!isValidCep(form.vehicleCep)) errors.push("Informe o CEP de pernoite com 8 dígitos.");
  if (!form.address.trim()) errors.push("Informe a rua ou logradouro do endereço de pernoite.");
  if (!form.addressNumber.trim()) errors.push("Informe o número do endereço de pernoite (ou S/N).");
  if (!form.district.trim()) errors.push("Informe o bairro do endereço de pernoite.");
  if (!form.city.trim()) errors.push("Informe a cidade do endereço de pernoite.");
  if (form.state.trim().length !== 2) errors.push("Informe a sigla do estado com 2 letras, por exemplo MG.");
  return errors;
 }
 if (form.insuranceType === "Seguro Auto" && step === 4) return ["Informe o nome do condutor e uma data de nascimento válida (idade entre 18 e 100 anos)."];
 if (form.insuranceType === "Seguro Auto" && step === 5) return ["Preencha seguradora e bônus. Se houve sinistro, informe a quantidade."];
 if (form.insuranceType === "Seguro de Vida" && step === 6) return ["Cadastre os beneficiários com participação total de 100%."];
 if (form.insuranceType === "Seguro Viagem" && step === 3) return ["Preencha destino, viajantes e idades. As datas devem existir e o retorno deve ser igual ou posterior ao embarque."];
 if (form.insuranceType === "Seguro de Equipamentos") {
  if (step === 3) return ["Confira tipo de seguro, pessoa, segmento, financiamento, nome ou razão social e CPF/CNPJ válido para a pessoa selecionada."];
  if (step === 4) return ["Preencha os dados do equipamento, quantidade e valor maiores que zero, ano de fabricação e CEP válido. Se possui nota fiscal, informe número e emissor."];
  if (step === 5) return ["Informe um valor maior que zero para a cobertura básica."];
  if (step === 6) return ["Responda todas as perguntas. Se emplacado, informe uma placa válida; para local determinado, informe o endereço."];
 }
 if ((step === 5 && form.insuranceType !== "Seguro Auto") || (step === 6 && form.insuranceType === "Seguro Auto")) return ["Selecione ao menos uma cobertura e preencha os valores obrigatórios, quando solicitados."];
 return ["Confira os campos obrigatórios e as respostas desta etapa antes de continuar."];
}
