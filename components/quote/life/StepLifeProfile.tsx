import Input from "../../ui/Input";
import Select from "../../ui/Select";

import StepLayout from "../common/StepLayout";
import { useQuote } from "../context/QuoteContext";

export default function StepLifeProfile() {
  const { form, updateField } = useQuote();

  return (
    <StepLayout
      title="Perfil do segurado"
      subtitle="Informe alguns dados para encontrarmos a proteção mais adequada."
    >
      <Input
        label="Data de nascimento"
        value={form.lifeBirthDate}
        placeholder="dd/mm/aaaa"
        mask="date"
        required
        onChange={(value) =>
          updateField("lifeBirthDate", value)
        }
      />

      <Select
        label="Estado civil"
        value={form.lifeMaritalStatus}
        onChange={(value) =>
          updateField("lifeMaritalStatus", value)
        }
        options={[
          {
            label: "Solteiro(a)",
            value: "Solteiro(a)",
          },
          {
            label: "Casado(a)",
            value: "Casado(a)",
          },
          {
            label: "União estável",
            value: "União estável",
          },
          {
            label: "Divorciado(a)",
            value: "Divorciado(a)",
          },
          {
            label: "Viúvo(a)",
            value: "Viúvo(a)",
          },
        ]}
      />

      <Input
        label="Profissão"
        value={form.lifeProfession}
        placeholder="Ex.: Administradora"
        required
        onChange={(value) =>
          updateField("lifeProfession", value)
        }
      />

      <Input
        label="Renda mensal aproximada"
        value={form.lifeMonthlyIncome}
        placeholder="Ex.: R$ 5.000,00"
        required
        onChange={(value) =>
          updateField("lifeMonthlyIncome", value)
        }
      />
    </StepLayout>
  );
}