"use client";

import StepLayout from "../common/StepLayout";
import SummaryCard from "../common/SummaryCard";
import SummaryField from "../common/SummaryField";
import { useQuote } from "../context/QuoteContext";

interface Props { onEdit: (step: number) => void; }

export default function StepProductReview({ onEdit }: Props) {
  const { form } = useQuote();
  const fields = form.insuranceType === "Seguro Empresarial"
    ? [["CNPJ", form.businessCnpj], ["Razão social", form.businessLegalName], ["Nome fantasia", form.businessTradeName], ["Atividade", form.businessActivity], ["CEP", form.businessCep], ["Funcionários", form.businessEmployees], ["Faturamento anual", form.businessAnnualRevenue], ["Situação do imóvel", form.businessPropertyStatus]]
    : form.insuranceType === "Seguro Saúde"
      ? [["Plano para", form.healthPlanFor], ["Quantidade de vidas", form.healthLives], ["Idades", form.healthAges], ["Abrangência", form.healthScope], ["Plano atual", form.healthHasPlan], ["Operadora atual", form.healthCurrentOperator], ["Acomodação", form.healthAccommodation], ["Coparticipação", form.healthCopay]]
      : form.insuranceType === "Seguro Viagem"
        ? [["Destino", form.travelDestination], ["Embarque", form.travelDepartureDate], ["Retorno", form.travelReturnDate], ["Viajantes", form.travelTravelers], ["Idades", form.travelAges], ["Motivo", form.travelPurpose], ["Condição preexistente", form.travelHasPreexistingCondition], ["Esportes ou aventura", form.travelWillPracticeSports]]
        : [["Propriedade", form.ruralPropertyName], ["CEP", form.ruralCep], ["Atividade", form.ruralActivity], ["Área", form.ruralArea ? form.ruralArea + " hectares" : ""], ["Faturamento anual", form.ruralAnnualRevenue], ["Máquinas e implementos", form.ruralMachineryValue], ["Criação de animais", form.ruralHasLivestock], ["Silos ou depósitos", form.ruralHasStorage]];

  return (
    <StepLayout title="Revise sua solicitação" subtitle={`Confira os dados do ${form.insuranceType} antes de enviar.`}>
      <div className="space-y-6">
        <SummaryCard title="Dados do cliente" onEdit={() => onEdit(2)}><SummaryField label="Nome" value={form.name} /><SummaryField label="Telefone" value={form.phone} /><SummaryField label="E-mail" value={form.email} /><SummaryField label="CPF" value={form.cpf} /></SummaryCard>
        <SummaryCard title="Dados do seguro" onEdit={() => onEdit(3)}>{fields.map(([label, value]) => <SummaryField key={label} label={label} value={value} />)}</SummaryCard>
        <SummaryCard title="Coberturas desejadas" onEdit={() => onEdit(5)} complete={form.coverages.length > 0}>{form.coverages.length > 0 ? <ul className="grid gap-2 sm:grid-cols-2">{form.coverages.map((coverage) => <li key={coverage} className="rounded-lg bg-blue-50 px-3 py-2 text-blue-900">✓ {coverage}</li>)}</ul> : <p className="text-amber-700">Nenhuma cobertura selecionada.</p>}</SummaryCard>
      </div>
    </StepLayout>
  );
}
