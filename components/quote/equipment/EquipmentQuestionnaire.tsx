"use client";
import Input from "../../ui/Input";
import RadioGroup from "../../ui/RadioGroup";
import StepLayout from "../common/StepLayout";
import { useQuote } from "../context/QuoteContext";
export default function EquipmentQuestionnaire() {
 const {form,updateField,updateFields}=useQuote();
 const yesNo=["Sim","Não"].map(value=>({label:value,value}));
 return <StepLayout title="Questionário do equipamento" subtitle="Conte como e onde o equipamento será utilizado.">
 <RadioGroup label="Emplacado?" value={form.equipmentPlated} options={yesNo} onChange={v=>updateFields({equipmentPlated:v,...(v === "Não" ? {equipmentPlate:""} : {})})} />
 {form.equipmentPlated === "Sim" && <Input label="Placa" required value={form.equipmentPlate} placeholder="ABC1D23" onChange={v=>updateField("equipmentPlate",v.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,7))} />}
 <RadioGroup label="Instalado em veículo terrestre?" value={form.equipmentMounted} options={yesNo} onChange={v=>updateField("equipmentMounted",v)} />
 <RadioGroup label="O equipamento é um bem litigioso, falido ou concordatário, pertence a massa falida ou é oriundo de leilão?" value={form.equipmentLegalSituation} options={yesNo} onChange={v=>updateField("equipmentLegalSituation",v)} />
 <RadioGroup label="Deseja a cobertura do seguro para?" value={form.equipmentTerritory} options={["Todo Território Nacional","Local Determinado"].map(value=>({label:value,value}))} onChange={v=>updateFields({equipmentTerritory:v,...(v === "Todo Território Nacional" ? {equipmentLocation:""} : {})})} />
 {form.equipmentTerritory === "Local Determinado" && <Input label="Endereço do local determinado" required value={form.equipmentLocation} onChange={v=>updateField("equipmentLocation",v)} />}
 <RadioGroup label="O equipamento poderá ser operado por terceiros durante a vigência do seguro?" value={form.equipmentThirdParty} options={yesNo} onChange={v=>updateField("equipmentThirdParty",v)} />
 </StepLayout>;
}
