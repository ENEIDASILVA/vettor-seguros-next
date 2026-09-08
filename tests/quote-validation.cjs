
const fs = require("node:fs");
const ts = require("typescript");
const assert = require("node:assert/strict");
require.extensions[".ts"] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, file);
const { canProceed, getStepErrors } = require("../components/quote/services/validators.ts");
const { getFlow } = require("../components/quote/services/getFlow.ts");
const types = ["Seguro Auto","Seguro Residencial","Seguro de Vida","Seguro Empresarial","Seguro Saúde","Seguro de Equipamentos","Seguro Viagem"];
let checks = 0;
const check = (actual, expected) => { assert.equal(actual, expected); checks++; };
const defaults = {
name:"Cliente teste", phone:"(31) 99999-9999", email:"cliente@example.com", cpf:"529.982.247-25",
propertyCep:"30140-071", residentialContactConsent:"Sim", state:"MG", vehiclePlate:"ABC1D23", vehicleCep:"30140-071",
driverBirthDate:"01/01/1990", lifeBirthDate:"01/01/1990", coverages:["Cobertura básica"],
beneficiaries:[{name:"Beneficiário",percentage:"100"}], businessCnpj:"11.222.333/0001-81", businessCep:"30140-071",
healthLives:"2", healthHasPlan:"Não", equipmentFinancing:"Financiado", equipmentPerson:"Física", equipmentDocument:"52998224725",
equipmentQuantity:"1",equipmentHasInvoice:"Não",equipmentYear:"2025",equipmentValue:"R$ 100,00", equipmentCep:"30140-071",
equipmentBasicLimit:"R$ 100,00",equipmentPlated:"Não",equipmentMounted:"Não",equipmentLegalSituation:"Não",equipmentThirdParty:"Não",
equipmentTerritory:"Todo Território Nacional", travelDepartureDate:"01/10/2026",travelReturnDate:"10/10/2026",travelTravelers:"2",currentInsurance:"Não"
};
const make = (type, overrides={}) => new Proxy({...defaults, insuranceType:type,...overrides},{get:(obj,key)=>key in obj ? obj[key] : "Preenchido"});
for (const type of types) {
 const form=make(type);
 for(let step=1;step<=getFlow(type).length;step++) { check(canProceed(step,form),true); check(getStepErrors(step,form).length,0); }
 check(canProceed(2,make(type,{cpf:"111.111.111-11"})),false);
 check(getStepErrors(2,make(type,{email:"invalido"})).some(message=>message.includes("e-mail")),true);
 check(canProceed(2,make(type,{phone:"31"})),false);
}
check(canProceed(2,make("Seguro Auto",{email:""})),true);
check(canProceed(2,make("Seguro Residencial",{email:""})),false);
check(canProceed(3,make("Seguro Auto",{vehicleCep:"123"})),false);
check(canProceed(3,make("Seguro Auto",{addressNumber:""})),false);
check(canProceed(3,make("Seguro Empresarial",{businessCnpj:"11111111111111"})),false);
check(canProceed(3,make("Seguro Viagem",{travelReturnDate:"31/02/2026"})),false);
check(canProceed(3,make("Seguro Viagem",{travelReturnDate:"01/09/2026"})),false);
check(canProceed(3,make("Seguro de Vida",{lifeBirthDate:"31/02/1990"})),false);
check(canProceed(4,make("Seguro Saúde",{healthHasPlan:"Sim",healthCurrentOperator:""})),false);
check(canProceed(3,make("Seguro de Equipamentos",{equipmentPerson:"Jurídica"})),false);
check(canProceed(4,make("Seguro de Equipamentos",{equipmentHasInvoice:"Sim",equipmentInvoiceNumber:""})),false);
check(canProceed(6,make("Seguro de Equipamentos",{equipmentPlated:"Sim",equipmentPlate:""})),false);
check(canProceed(3,make("Seguro Auto",{vehiclePlate:""})),true);
check(canProceed(3,make("Seguro Auto",{vehiclePlate:"ABC"})),false);
console.log(checks + " verificações passaram em todas as modalidades.");
