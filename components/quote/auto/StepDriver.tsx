import Input from "../../ui/Input";
import Select from "../../ui/Select";
import RadioGroup from "../../ui/RadioGroup";
import StepLayout from "../common/StepLayout";
import { useQuote } from "../context/QuoteContext";


export default function StepDriver() {
  const { form, updateField } = useQuote();

  return (
    <StepLayout title="Condutor Principal" subtitle="Essas informações ajudam a calcular o perfil do seguro.">
      <Input label="Nome do condutor principal" value={form.driverName} placeholder="Digite o nome" onChange={(value) => updateField("driverName", value)} />
      <Input label="Data de nascimento"  value={form.driverBirthDate} placeholder="dd/mm/aaaa" onChange={(value) => updateField("driverBirthDate", value)} mask="date" required />

      <Select
        label="Estado civil"
        value={form.driverMaritalStatus}
        onChange={(value) => updateField("driverMaritalStatus", value)}
        options={[
          { label: "Solteiro(a)", value: "Solteiro" },
          { label: "Casado(a)", value: "Casado" },
          { label: "União estável", value: "União estável" },
          { label: "Divorciado(a)", value: "Divorciado" },
          { label: "Viúvo(a)", value: "Viúvo" },
        ]}
      />

      <Input label="Profissão" value={form.driverProfession} placeholder="Ex.: Engenheiro" onChange={(value) => updateField("driverProfession", value)} />

      <RadioGroup label="É o principal condutor do veículo?" value={form.driverIsMain} onChange={(value) => updateField("driverIsMain", value)} options={[{ label: "Sim", value: "Sim" }, { label: "Não", value: "Não" }]} />

      <RadioGroup label="Existe outro condutor frequente?" value={form.driverHasSecondary} onChange={(value) => updateField("driverHasSecondary", value)} options={[{ label: "Sim", value: "Sim" }, { label: "Não", value: "Não" }]} />

      <RadioGroup label="Há condutor entre 18 e 25 anos?" value={form.driverYoung} onChange={(value) => updateField("driverYoung", value)} options={[{ label: "Sim", value: "Sim" }, { label: "Não", value: "Não" }]} />
    </StepLayout>
  );
}