"use client";

import Input from "../../ui/Input";
import RadioGroup from "../../ui/RadioGroup";
import Select from "../../ui/Select";
import StepLayout from "../common/StepLayout";
import { useQuote } from "../context/QuoteContext";

const yesNo = [{ label: "Sim", value: "Sim" }, { label: "Não", value: "Não" }];

function money(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 }).format(Number(digits) / 100);
}

export default function StepProductNeeds() {
  const { form, updateField } = useQuote();

  if (form.insuranceType === "Seguro Empresarial") {
    return (
      <StepLayout title="Perfil do estabelecimento" subtitle="Essas informações ajudam a dimensionar os riscos do negócio.">
        <Input label="Quantidade de funcionários" value={form.businessEmployees} placeholder="Ex.: 12" required onChange={(value) => updateField("businessEmployees", value.replace(/\D/g, "").slice(0, 6))} />
        <Input label="Faturamento anual aproximado" value={form.businessAnnualRevenue} placeholder="Ex.: R$ 1.000.000,00" required onChange={(value) => updateField("businessAnnualRevenue", money(value))} />
        <Select label="Situação do imóvel" value={form.businessPropertyStatus} required onChange={(value) => updateField("businessPropertyStatus", value)} options={[{ label: "Próprio", value: "Próprio" }, { label: "Alugado", value: "Alugado" }, { label: "Financiado", value: "Financiado" }]} />
      </StepLayout>
    );
  }

  if (form.insuranceType === "Seguro Saúde") {
    return (
      <StepLayout title="Preferências do plano" subtitle="Conte como você gostaria de utilizar o seguro saúde.">
        <RadioGroup label="Possui plano atualmente?" value={form.healthHasPlan} onChange={(value) => updateField("healthHasPlan", value)} options={yesNo} />
        {form.healthHasPlan === "Sim" && <Input label="Operadora atual" value={form.healthCurrentOperator} placeholder="Nome da operadora" required onChange={(value) => updateField("healthCurrentOperator", value)} />}
        <Select label="Acomodação" value={form.healthAccommodation} required onChange={(value) => updateField("healthAccommodation", value)} options={[{ label: "Enfermaria", value: "Enfermaria" }, { label: "Apartamento", value: "Apartamento" }, { label: "Quero comparar ambas", value: "Comparar ambas" }]} />
        <RadioGroup label="Aceita coparticipação?" value={form.healthCopay} onChange={(value) => updateField("healthCopay", value)} options={[{ label: "Sim", value: "Sim" }, { label: "Não", value: "Não" }, { label: "Quero comparar", value: "Quero comparar" }]} />
      </StepLayout>
    );
  }

  if (form.insuranceType === "Seguro Viagem") {
    return (
      <StepLayout title="Perfil da viagem" subtitle="Conte o objetivo da viagem e situações que podem exigir cobertura especial.">
        <Select label="Motivo da viagem" value={form.travelPurpose} required onChange={(value) => updateField("travelPurpose", value)} options={[{ label: "Turismo", value: "Turismo" }, { label: "Trabalho", value: "Trabalho" }, { label: "Estudo", value: "Estudo" }, { label: "Intercâmbio", value: "Intercâmbio" }, { label: "Cruzeiro", value: "Cruzeiro" }]} />
        <RadioGroup label="Algum viajante possui condição de saúde preexistente?" value={form.travelHasPreexistingCondition} onChange={(value) => updateField("travelHasPreexistingCondition", value)} options={yesNo} />
        <RadioGroup label="Haverá prática de esportes ou atividades de aventura?" value={form.travelWillPracticeSports} onChange={(value) => updateField("travelWillPracticeSports", value)} options={yesNo} />
      </StepLayout>
    );
  }

  return (
    <StepLayout title="Estrutura e produção" subtitle="Informe os bens e atividades relevantes para a cotação rural.">
      <Input label="Valor aproximado de máquinas e implementos" value={form.ruralMachineryValue} placeholder="Ex.: R$ 300.000,00" required onChange={(value) => updateField("ruralMachineryValue", money(value))} />
      <RadioGroup label="Possui criação de animais?" value={form.ruralHasLivestock} onChange={(value) => updateField("ruralHasLivestock", value)} options={yesNo} />
      <RadioGroup label="Possui silos, armazéns ou depósitos?" value={form.ruralHasStorage} onChange={(value) => updateField("ruralHasStorage", value)} options={yesNo} />
    </StepLayout>
  );
}
