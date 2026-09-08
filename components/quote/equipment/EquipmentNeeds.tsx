"use client";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import StepLayout from "../common/StepLayout";
import { useQuote } from "../context/QuoteContext";
import { equipmentFields } from "./fields";

const keys = ["equipmentDescription", "equipmentBrand", "equipmentModel", "equipmentChassis", "equipmentSerial", "equipmentYear", "equipmentValue", "equipmentCep", "equipmentUse"] as const;
export default function EquipmentNeeds() {
 const { form, updateField, updateFields } = useQuote();
 return <StepLayout title="Dados do equipamento" subtitle="Informe os dados do bem. A quantidade permite solicitar equipamentos iguais; detalhe diferenças na descrição.">
 <Input label="Quantidade de equipamentos iguais" required value={form.equipmentQuantity} onChange={v => updateField("equipmentQuantity", v.replace(/\D/g, "").slice(0,4))} />
 {keys.map(key => <Input key={key} label={equipmentFields.find(([k]) => k === key)![1]} value={form[key]} required={!["equipmentChassis","equipmentSerial"].includes(key)} mask={key === "equipmentCep" ? "cep" : undefined} onChange={v => {
  if (key === "equipmentValue") { const digits=v.replace(/\D/g, ""); v=digits ? new Intl.NumberFormat("pt-BR", {style:"currency",currency:"BRL"}).format(Number(digits)/100) : ""; }
  if (key === "equipmentYear") v=v.replace(/\D/g, "").slice(0,4);
  updateField(key,v);
 }} />)}
 <Input label="Data de saída da revenda" type="date" value={form.equipmentResaleDate} onChange={v => updateField("equipmentResaleDate",v)} />
 <Select label="Possui nota fiscal?" required value={form.equipmentHasInvoice} options={["Sim","Não"].map(value => ({label:value,value}))} onChange={v => updateFields({equipmentHasInvoice:v, ...(v === "Não" ? {equipmentInvoiceNumber:"",equipmentInvoiceIssuer:""} : {})})} />
 {form.equipmentHasInvoice === "Sim" && <>
  <Input label="Número da nota fiscal" required value={form.equipmentInvoiceNumber} onChange={v => updateField("equipmentInvoiceNumber",v)} />
  <Input label="Empresa emissora" required value={form.equipmentInvoiceIssuer} onChange={v => updateField("equipmentInvoiceIssuer",v)} />
 </>}
 </StepLayout>;
}
