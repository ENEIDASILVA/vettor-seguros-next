export type InsuranceType =
  | "Seguro Auto"
  | "Seguro Moto"
  | "Seguro Residencial"
  | "Seguro de Vida"
  | "Seguro Empresarial"
  | "Seguro Saúde"
  | "Seguro Rural";

export interface Beneficiary {
  id: string;
  name: string;
  relationship: string;
  percentage: string;
}

export interface QuoteFormData {
  insuranceType: InsuranceType | "";

  // Dados pessoais
  name: string;
  phone: string;
  email: string;
  cpf: string;

  // Endereço
  address: string;
  addressNumber: string;
  addressComplement: string;
  district: string;
  city: string;
  state: string;

  // Veículo
  vehicleBrandCode: string;
  vehicleBrand: string;

  vehicleModelCode: string;
  vehicleModel: string;

  vehicleYearCode: string;
  vehicleYear: string;

  vehicleFuel: string;
  vehicleFipeCode: string;
  vehicleZeroKm: string;

  vehicleCep: string;
  vehicleGarage: string;
  vehicleApp: string;
  vehicleTracker: string;

  // Condutor
  driverName: string;
  driverBirthDate: string;
  driverMaritalStatus: string;
  driverProfession: string;
  driverIsMain: string;
  driverHasSecondary: string;
  driverYoung: string;

  // Histórico
  currentInsurance: string;
  currentInsurer: string;
  bonusClass: string;
  hadClaims: string;
  claimsCount: string;
  insuranceRefused: string;

  // Seguro Residencial
  propertyCep: string;
  propertyType: string;
  propertyStatus: string;
  propertyArea: string;
  propertyValue: string;
  propertyUse: string;
  propertyAlarm: string;
  propertyMonitoring: string;
  propertyGatedCommunity: string;

  // Seguro de Vida
  lifeBirthDate: string;
  lifeMaritalStatus: string;
  lifeProfession: string;
  lifeMonthlyIncome: string;
  lifeSmoker: string;
  lifeRiskActivity: string;
  lifeExtremeSports: string;
  lifeFrequentTravel: string;
  lifeInsuredCapital: string;
  beneficiaries: Beneficiary[];

  // Coberturas
  coverages: string[];

  observations: string;
}