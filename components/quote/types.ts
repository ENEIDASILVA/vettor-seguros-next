export type InsuranceType =
  | "Seguro Auto"
  | "Seguro Residencial"
  | "Seguro de Vida"
  | "Seguro Empresarial"
  | "Seguro Saúde"
  | "Seguro de Equipamentos"
  | "Seguro Viagem";

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
  vehicleType: string;

  vehicleBrandCode: string;
  vehicleBrand: string;

  vehicleModelCode: string;
  vehicleModel: string;

  vehicleYearCode: string;
  vehicleYear: string;
  vehiclePlate: string;

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
  residentialContactConsent: string;
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

  // Seguro Empresarial
  businessCnpj: string;
  businessLegalName: string;
  businessTradeName: string;
  businessActivity: string;
  businessCep: string;
  businessEmployees: string;
  businessAnnualRevenue: string;
  businessPropertyStatus: string;

  // Seguro Saúde
  healthLives: string;
  healthPlanFor: string;
  healthAges: string;
  healthHasPlan: string;
  healthCurrentOperator: string;
  healthAccommodation: string;
  healthScope: string;
  healthCopay: string;

  equipmentFinancing: string;
  equipmentQuantity: string;
  equipmentBrand: string;
  equipmentModel: string;
  equipmentChassis: string;
  equipmentResaleDate: string;
  equipmentHasInvoice: string;
  equipmentInvoiceNumber: string;
  equipmentInvoiceIssuer: string;
  equipmentBasicLimit: string;
  equipmentTheftLimit: string;
  equipmentElectricalLimit: string;
  equipmentLiabilityLimit: string;
  equipmentRentalLimit: string;
  equipmentPlated: string;
  equipmentPlate: string;
  equipmentMounted: string;
  equipmentLegalSituation: string;
  equipmentTerritory: string;
  equipmentLocation: string;
  equipmentThirdParty: string;
  equipmentInsuranceType: string;
  equipmentSegment: string;
  equipmentPerson: string;
  equipmentDocument: string;
  equipmentProponent: string;
  equipmentDescription: string;
  equipmentBrandModel: string;
  equipmentYear: string;
  equipmentSerial: string;
  equipmentValue: string;
  equipmentCep: string;
  equipmentUse: string;

  // Seguro rural (histórico)
  ruralPropertyName: string;
  ruralCep: string;
  ruralActivity: string;
  ruralArea: string;
  ruralAnnualRevenue: string;
  ruralMachineryValue: string;
  ruralHasLivestock: string;
  ruralHasStorage: string;

  // Seguro Viagem
  travelDestination: string;
  travelDepartureDate: string;
  travelReturnDate: string;
  travelTravelers: string;
  travelAges: string;
  travelPurpose: string;
  travelHasPreexistingCondition: string;
  travelWillPracticeSports: string;

  // Coberturas
  coverages: string[];

  observations: string;
}
