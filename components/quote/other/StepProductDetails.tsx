"use client";
import EquipmentDetails from "../equipment/EquipmentDetails";

import Input from "../../ui/Input";
import Select from "../../ui/Select";
import StepLayout from "../common/StepLayout";
import { useQuote } from "../context/QuoteContext";


export default function StepProductDetails() {
  const { form, updateField } = useQuote();

  if (form.insuranceType === "Seguro Empresarial") {
    return (
      <StepLayout title="Dados da empresa" subtitle="Informe os dados principais do negócio que será protegido.">
        <Input label="CNPJ" value={form.businessCnpj} placeholder="00.000.000/0000-00" required onChange={(value) => updateField("businessCnpj", value.replace(/\D/g, "").slice(0, 14).replace(/^(\d{2})(\d)/, "$1.$2").replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3").replace(/\.(\d{3})(\d)/, ".$1/$2").replace(/(\d{4})(\d)/, "$1-$2"))} />
        <Input label="Razão social" value={form.businessLegalName} placeholder="Nome registrado da empresa" required onChange={(value) => updateField("businessLegalName", value)} />
        <Input label="Nome fantasia" value={form.businessTradeName} placeholder="Como a empresa é conhecida" onChange={(value) => updateField("businessTradeName", value)} />
        <Input label="Atividade principal" value={form.businessActivity} placeholder="Ex.: comércio de roupas" required onChange={(value) => updateField("businessActivity", value)} />
        <Input label="CEP do estabelecimento" value={form.businessCep} placeholder="00000-000" mask="cep" required onChange={(value) => updateField("businessCep", value)} />
      </StepLayout>
    );
  }

  if (form.insuranceType === "Seguro Saúde") {
    return (
      <StepLayout title="Quem será protegido?" subtitle="Informe o perfil das pessoas que entrarão no plano.">
        <Select label="Plano para" value={form.healthPlanFor} required onChange={(value) => updateField("healthPlanFor", value)} options={[{ label: "Individual", value: "Individual" }, { label: "Familiar", value: "Familiar" }, { label: "Empresarial", value: "Empresarial" }]} />
        <Input label="Quantidade de vidas" value={form.healthLives} placeholder="Ex.: 3" required onChange={(value) => updateField("healthLives", value.replace(/\D/g, "").slice(0, 4))} />
        <Input label="Idades dos participantes" value={form.healthAges} placeholder="Ex.: 35, 33 e 7 anos" required helperText="Separe as idades por vírgula." onChange={(value) => updateField("healthAges", value)} />
        <Select label="Abrangência desejada" value={form.healthScope} required onChange={(value) => updateField("healthScope", value)} options={[{ label: "Regional", value: "Regional" }, { label: "Estadual", value: "Estadual" }, { label: "Nacional", value: "Nacional" }]} />
      </StepLayout>
    );
  }

  if (form.insuranceType === "Seguro Viagem") {
    return (
      <StepLayout title="Dados da viagem" subtitle="Informe o destino e o período para encontrarmos a proteção adequada.">
        <Input label="Destino da viagem" value={form.travelDestination} placeholder="Ex.: Portugal e Espanha" required onChange={(value) => updateField("travelDestination", value)} />
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Data de embarque" value={form.travelDepartureDate} placeholder="dd/mm/aaaa" mask="date" validateDate={false} required onChange={(value) => updateField("travelDepartureDate", value)} />
          <Input label="Data de retorno" value={form.travelReturnDate} placeholder="dd/mm/aaaa" mask="date" validateDate={false} required onChange={(value) => updateField("travelReturnDate", value)} />
        </div>
        <Input label="Quantidade de viajantes" value={form.travelTravelers} placeholder="Ex.: 2" required onChange={(value) => updateField("travelTravelers", value.replace(/\D/g, "").slice(0, 3))} />
        <Input label="Idades dos viajantes" value={form.travelAges} placeholder="Ex.: 36 e 34 anos" required helperText="Informe a idade de todas as pessoas." onChange={(value) => updateField("travelAges", value)} />
      </StepLayout>
    );
  }

  return <EquipmentDetails />;
}
