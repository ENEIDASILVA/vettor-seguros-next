import Input from "../../ui/Input";
import Select from "../../ui/Select";
import RadioGroup from "../../ui/RadioGroup";
import StepLayout from "../common/StepLayout";
import { useQuote } from "../context/QuoteContext";

export default function StepHistory() {
  const { form, updateField } = useQuote();

  return (
    <StepLayout title="Histórico do seguro" subtitle="Essas informações ajudam a agilizar a análise junto às seguradoras.">
      <RadioGroup label="Possui seguro atualmente?" value={form.currentInsurance} onChange={(value) => updateField("currentInsurance", value)} options={[{ label: "Sim", value: "Sim" }, { label: "Não", value: "Não" }]} />

      <Select
        label="Seguradora atual"
        value={form.currentInsurer}
        onChange={(value) => updateField("currentInsurer", value)}
        options={[
          { label: "Porto", value: "Porto" },
          { label: "Tokio Marine", value: "Tokio Marine" },
          { label: "HDI", value: "HDI" },
          { label: "Allianz", value: "Allianz" },
          { label: "Mapfre", value: "Mapfre" },
          { label: "Bradesco Seguros", value: "Bradesco Seguros" },
          { label: "Outra", value: "Outra" },
          { label: "Não sei", value: "Não sei" },
        ]}
      />

      <Select
        label="Classe de bônus"
        value={form.bonusClass}
        onChange={(value) => updateField("bonusClass", value)}
        options={["Não sei", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].map((item) => ({
          label: item,
          value: item,
        }))}
      />

      <RadioGroup label="Teve sinistro nos últimos 5 anos?" value={form.hadClaims} onChange={(value) => updateField("hadClaims", value)} options={[{ label: "Sim", value: "Sim" }, { label: "Não", value: "Não" }]} />

      {form.hadClaims === "Sim" && (
        <Input label="Quantos sinistros?" value={form.claimsCount} placeholder="Ex.: 1" onChange={(value) => updateField("claimsCount", value)} />
      )}

      <RadioGroup label="Alguma seguradora já recusou seu seguro?" value={form.insuranceRefused} onChange={(value) => updateField("insuranceRefused", value)} options={[{ label: "Sim", value: "Sim" }, { label: "Não", value: "Não" }]} />
    </StepLayout>
  );
}