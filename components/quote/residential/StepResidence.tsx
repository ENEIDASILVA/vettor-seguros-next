import RadioGroup from "../../ui/RadioGroup";

import StepLayout from "../common/StepLayout";
import { useQuote } from "../context/QuoteContext";

const yesNoOptions = [
  {
    label: "Sim",
    value: "Sim",
  },
  {
    label: "Não",
    value: "Não",
  },
];

export default function StepResidence() {
  const { form, updateField } = useQuote();

  return (
    <StepLayout
      title="Perfil do imóvel"
      subtitle="Essas informações ajudam a encontrar as coberturas mais adequadas."
    >
      <RadioGroup
        label="O imóvel é utilizado como?"
        value={form.propertyUse}
        onChange={(value) =>
          updateField("propertyUse", value)
        }
        options={[
          {
            label: "Moradia habitual",
            value: "Moradia habitual",
          },
          {
            label: "Casa de veraneio",
            value: "Casa de veraneio",
          },
          {
            label: "Imóvel alugado",
            value: "Imóvel alugado",
          },
          {
            label: "Imóvel desocupado",
            value: "Imóvel desocupado",
          },
        ]}
      />

      <RadioGroup
        label="Possui sistema de alarme?"
        value={form.propertyAlarm}
        onChange={(value) =>
          updateField(
            "propertyAlarm",
            value
          )
        }
        options={yesNoOptions}
      />

      <RadioGroup
        label="Possui monitoramento eletrônico?"
        value={form.propertyMonitoring}
        onChange={(value) =>
          updateField(
            "propertyMonitoring",
            value
          )
        }
        options={yesNoOptions}
      />

      <RadioGroup
        label="O imóvel fica em condomínio fechado?"
        value={form.propertyGatedCommunity}
        onChange={(value) =>
          updateField(
            "propertyGatedCommunity",
            value
          )
        }
        options={yesNoOptions}
      />
    </StepLayout>
  );
}