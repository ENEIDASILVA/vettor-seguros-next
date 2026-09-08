"use client";
import { isValidCnpj } from "../services/validators";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import StepLayout from "../common/StepLayout";
import { useQuote } from "../context/QuoteContext";

export default function EquipmentDetails() {
 const { form, updateField, updateFields } = useQuote();
 const isCompany = form.equipmentPerson === "Jurídica";
 const selects = [
  ["equipmentInsuranceType", "Tipo de seguro", ["Seguro Novo", "Renovação"]],
  ["equipmentPerson", "Pessoa", ["Física", "Jurídica"]],
 ] as const;
 return <StepLayout title="Dados do seguro e do proponente" subtitle="Informe o tipo de seguro, o financiamento e os dados do proponente.">
  {selects.map(([key, label, options]) => <Select key={key} label={label} required value={form[key]} onChange={v => key === "equipmentPerson" ? updateFields({equipmentPerson:v, equipmentDocument:v === "Física" ? form.cpf.replace(/\D/g,"") : "", equipmentProponent:v === "Física" ? form.name : ""}) : updateField(key,v)} options={options.map(value => ({label:value,value}))} />)}
  <Select label="Segmento" required value={form.equipmentSegment} options={["Equipamento Agrícola","Equipamento Construção Civil / Industrial / Comercial","Equipamento Florestal","Equipamento Médico / Estético / Veterinário","Equipamento Musical","Equipamento Portátil"].map(value => ({label: value, value}))} onChange={v => updateField("equipmentSegment", v)} />
  <Select label="Tipo de financiamento" required value={form.equipmentFinancing} options={["Financiado", "Não Financiado"].map(value => ({label:value,value}))} onChange={v => updateField("equipmentFinancing", v)} />
  <Input label={isCompany ? "Razão Social do Proponente" : "Nome do Proponente"} required value={form.equipmentProponent} onChange={v => updateField("equipmentProponent",v)} />
  <Input label={isCompany ? "CNPJ" : "CPF"} mask={isCompany ? undefined : "cpf"} error={isCompany && form.equipmentDocument.length > 0 && !isValidCnpj(form.equipmentDocument) ? "CNPJ inválido. Informe os 14 dígitos e confira os números." : ""} required value={form.equipmentDocument} maxLength={14} placeholder={isCompany ? "Somente os 14 números do CNPJ" : "000.000.000-00"} onChange={v => updateField("equipmentDocument",v.replace(/\D/g,"").slice(0, isCompany ? 14 : 11))} />
 </StepLayout>;
}
