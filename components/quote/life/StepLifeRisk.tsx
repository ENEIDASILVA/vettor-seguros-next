"use client";

import StepLayout from "../common/StepLayout";
import OptionGroup from "../../ui/OptionGroup";
import { useQuote } from "../context/QuoteContext";

const yesNoOptions = [
  {
    label: "Sim",
    value: "Sim",
    description: "Selecione esta opção se a resposta for positiva.",
  },
  {
    label: "Não",
    value: "Não",
    description: "Selecione esta opção se a resposta for negativa.",
  },
];

export default function StepLifeRisk() {
  const { form, updateField } = useQuote();

  return (
    <StepLayout
      title="Saúde e atividades"
      subtitle="Essas informações ajudam a encontrar a cobertura ideal."
    >
      <OptionGroup
        label="É fumante?"
        value={form.lifeSmoker}
        options={yesNoOptions}
        columns={2}
        onChange={(value) =>
          updateField("lifeSmoker", value)
        }
      />

      <OptionGroup
        label="Exerce atividade profissional de risco?"
        value={form.lifeRiskActivity}
        options={yesNoOptions}
        columns={2}
        onChange={(value) =>
          updateField("lifeRiskActivity", value)
        }
      />

      <OptionGroup
        label="Pratica esportes radicais?"
        value={form.lifeExtremeSports}
        options={yesNoOptions}
        columns={2}
        onChange={(value) =>
          updateField("lifeExtremeSports", value)
        }
      />

      <OptionGroup
        label="Viaja frequentemente a trabalho?"
        value={form.lifeFrequentTravel}
        options={yesNoOptions}
        columns={2}
        onChange={(value) =>
          updateField("lifeFrequentTravel", value)
        }
      />
    </StepLayout>
  );
}