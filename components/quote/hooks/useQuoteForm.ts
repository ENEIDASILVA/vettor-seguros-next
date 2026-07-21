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
    }));
  }

  function updateField(
    field: keyof QuoteFormData,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
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
    setForm(initialForm);
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