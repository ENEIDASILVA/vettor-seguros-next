import { useState } from "react";

import {
  Beneficiary,
  InsuranceType,
  QuoteFormData,
} from "../types";

const initialForm: QuoteFormData = {
  insuranceType: "",

  name: "",
  phone: "",
  email: "",
  cpf: "",

  address: "",
  addressNumber: "",
  addressComplement: "",
  district: "",
  city: "",
  state: "",

  vehicleType:"",
  vehicleBrandCode: "",
  vehicleBrand: "",
  vehicleModelCode: "",
  vehicleModel: "",
  vehicleYearCode: "",
  vehicleYear: "",
  vehiclePlate: "",
  vehicleFuel: "",
  vehicleFipeCode: "",
  vehicleZeroKm: "",
  vehicleCep: "",
  vehicleGarage: "",
  vehicleApp: "",
  vehicleTracker: "",

  driverName: "",
  driverBirthDate: "",
  driverMaritalStatus: "",
  driverProfession: "",
  driverIsMain: "",
  driverHasSecondary: "",
  driverYoung: "",

  currentInsurance: "",
  currentInsurer: "",
  bonusClass: "",
  hadClaims: "",
  claimsCount: "",
  insuranceRefused: "",

  propertyCep: "",
  propertyType: "",
  propertyStatus: "",
  propertyArea: "",
  propertyValue: "",
  residentialContactConsent: "",
  propertyUse: "",
  propertyAlarm: "",
  propertyMonitoring: "",
  propertyGatedCommunity: "",

  lifeBirthDate: "",
  lifeMaritalStatus: "",
  lifeProfession: "",
  lifeMonthlyIncome: "",
  lifeSmoker: "",
  lifeRiskActivity: "",
  lifeExtremeSports: "",
  lifeFrequentTravel: "",
  lifeInsuredCapital: "",
  beneficiaries: [],

  businessCnpj: "",
  businessLegalName: "",
  businessTradeName: "",
  businessActivity: "",
  businessCep: "",
  businessEmployees: "",
  businessAnnualRevenue: "",
  businessPropertyStatus: "",

  healthLives: "",
  healthPlanFor: "",
  healthAges: "",
  healthHasPlan: "",
  healthCurrentOperator: "",
  healthAccommodation: "",
  healthScope: "",
  healthCopay: "",

  equipmentFinancing: "",
  equipmentQuantity: "1",
  equipmentBrand: "",
  equipmentModel: "",
  equipmentChassis: "",
  equipmentResaleDate: "",
  equipmentHasInvoice: "",
  equipmentInvoiceNumber: "",
  equipmentInvoiceIssuer: "",
  equipmentBasicLimit: "",
  equipmentTheftLimit: "",
  equipmentElectricalLimit: "",
  equipmentLiabilityLimit: "",
  equipmentRentalLimit: "",
  equipmentPlated: "",
  equipmentPlate: "",
  equipmentMounted: "",
  equipmentLegalSituation: "",
  equipmentTerritory: "",
  equipmentLocation: "",
  equipmentThirdParty: "",
  equipmentInsuranceType: "Seguro Novo",
  equipmentSegment: "",
  equipmentPerson: "Física",
  equipmentDocument: "",
  equipmentProponent: "",
  equipmentDescription: "",
  equipmentBrandModel: "",
  equipmentYear: "",
  equipmentSerial: "",
  equipmentValue: "",
  equipmentCep: "",
  equipmentUse: "",
  ruralPropertyName: "",
  ruralCep: "",
  ruralActivity: "",
  ruralArea: "",
  ruralAnnualRevenue: "",
  ruralMachineryValue: "",
  ruralHasLivestock: "",
  ruralHasStorage: "",

  travelDestination: "",
  travelDepartureDate: "",
  travelReturnDate: "",
  travelTravelers: "",
  travelAges: "",
  travelPurpose: "",
  travelHasPreexistingCondition: "",
  travelWillPracticeSports: "",

  coverages: [],

  observations: "",
};

export function useQuoteForm() {
  const [form, setForm] =
    useState<QuoteFormData>(initialForm);

  function updateInsurance(value: InsuranceType) {
    setForm((previous) => ({
      ...previous,
      insuranceType: value,
      ...(value === "Seguro de Equipamentos" && previous.equipmentPerson === "Física" ? {
        equipmentProponent: previous.equipmentProponent || previous.name,
        equipmentDocument: previous.equipmentDocument || previous.cpf.replace(/\D/g, ""),
      } : {}),
    }));
  }

  function updateField(
    field: keyof QuoteFormData,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
      ...(previous.insuranceType === "Seguro de Equipamentos" && previous.equipmentPerson === "Física" ? {
        ...(field === "name" && previous.equipmentProponent === previous.name
          ? { equipmentProponent: value } : {}),
        ...(field === "cpf" && previous.equipmentDocument.replace(/\D/g, "") === previous.cpf.replace(/\D/g, "")
          ? { equipmentDocument: value.replace(/\D/g, "") } : {}),
      } : {}),
    }));
  }

  function updateFields(
    fields: Partial<QuoteFormData>
  ) {
    setForm((previous) => ({
      ...previous,
      ...fields,
    }));
  }

  function toggleCoverage(coverage: string) {
    setForm((previous) => {
      const selected =
        previous.coverages.includes(coverage);

      return {
        ...previous,
        coverages: selected
          ? previous.coverages.filter(
              (item) => item !== coverage
            )
          : [
              ...previous.coverages,
              coverage,
            ],
      };
    });
  }

  function addBeneficiary(
    beneficiary: Beneficiary
  ) {
    setForm((previous) => ({
      ...previous,
      beneficiaries: [
        ...previous.beneficiaries,
        beneficiary,
      ],
    }));
  }

  function updateBeneficiary(
    id: string,
    beneficiary: Beneficiary
  ) {
    setForm((previous) => ({
      ...previous,
      beneficiaries:
        previous.beneficiaries.map(
          (item) =>
            item.id === id
              ? beneficiary
              : item
        ),
    }));
  }

  function removeBeneficiary(id: string) {
    setForm((previous) => ({
      ...previous,
      beneficiaries:
        previous.beneficiaries.filter(
          (item) => item.id !== id
        ),
    }));
  }

  function resetForm() {
    setForm({
      ...initialForm,
      beneficiaries: [],
      coverages: [],
    });
  }

  return {
    form,
    updateInsurance,
    updateField,
    updateFields,
    toggleCoverage,
    addBeneficiary,
    updateBeneficiary,
    removeBeneficiary,
    resetForm,
  };
}
