import RadioGroup from "../../ui/RadioGroup";
import StepLayout from "../common/StepLayout";
import { useQuote } from "../context/QuoteContext";

export default function StepResidence() {
  const { form, updateField } = useQuote();

  return (
    <StepLayout
      title="Perfil do imóvel"
      subtitle="Essas informações ajudam a encontrar a melhor cobertura."
    >
      <RadioGroup
        label="O imóvel é utilizado como?"
        value={form.driverIsMain}
        onChange={(value) => updateField("driverIsMain", value)}
        options={[
          { label: "Moradia habitual", value: "Moradia habitual" },
          { label: "Veraneio", value: "Veraneio" },
          { label: "Aluguel", value: "Aluguel" },
        ]}
      />

      <RadioGroup
        label="Possui sistema de alarme?"
        value={form.driverHasSecondary}
        onChange={(value) => updateField("driverHasSecondary", value)}
        options={[
          { label: "Sim", value: "Sim" },
          { label: "Não", value: "Não" },
        ]}
      />

      <RadioGroup
        label="Possui monitoramento eletrônico?"
        value={form.driverYoung}
        onChange={(value) => updateField("driverYoung", value)}
        options={[
          { label: "Sim", value: "Sim" },
          { label: "Não", value: "Não" },
        ]}
      />

      <RadioGroup
        label="O imóvel fica em condomínio fechado?"
        value={form.vehicleGarage}
        onChange={(value) => updateField("vehicleGarage", value)}
        options={[
          { label: "Sim", value: "Sim" },
          { label: "Não", value: "Não" },
        ]}
      />
    </StepLayout>
  );
}