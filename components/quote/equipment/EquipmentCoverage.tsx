"use client";
import Input from "../../ui/Input";
import StepLayout from "../common/StepLayout";
import { useQuote } from "../context/QuoteContext";
export const equipmentCoverages = [
 ["equipmentBasicLimit","Cobertura básica"],
 ["equipmentTheftLimit","Roubo e/ou furto qualificado"],
 ["equipmentElectricalLimit","Danos elétricos"],
 ["equipmentLiabilityLimit","RC - Equipamentos"],
 ["equipmentRentalLimit","Perda ou pagamento de aluguel"],
] as const;
export default function EquipmentCoverage() {
 const {form, updateFields} = useQuote();
 return <StepLayout title="Coberturas dos equipamentos" subtitle="Informe o limite máximo de garantia desejado para cada cobertura. Franquias e prêmio serão informados na cotação.">
 {equipmentCoverages.map(([key,label]) => <Input key={key} label={label + " — limite (R$)"} required={key === "equipmentBasicLimit"} value={form[key]} placeholder="R$ 0,00" helperText={key === "equipmentBasicLimit" ? "Informe o valor para a cobertura básica." : "Opcional. Deixe em branco se não desejar esta cobertura."} onChange={v => {
 const digits=v.replace(/\D/g,"");
 const value=digits ? new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(Number(digits)/100) : "";
 const next={...form,[key]:value};
 updateFields({[key]:value,coverages:equipmentCoverages.filter(([field])=>Number(next[field].replace(/\D/g,""))>0).map(([,name])=>name)});
 }} />)}
 </StepLayout>;
}
