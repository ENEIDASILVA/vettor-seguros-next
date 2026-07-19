"use client";

import Input from "../../ui/Input";
import Select from "../../ui/Select";
import RadioGroup from "../../ui/RadioGroup";

import StepLayout from "../common/StepLayout";
import { useQuote } from "../context/QuoteContext";

const yesNoOptions = [
  { label: "Sim", value: "Sim" },
  { label: "Não", value: "Não" },
];

const insurerOptions = [
  { label: "Porto", value: "Porto" },
  { label: "Tokio Marine", value: "Tokio Marine" },
  { label: "HDI", value: "HDI" },
  { label: "Allianz", value: "Allianz" },
  { label: "Mapfre", value: "Mapfre" },
  {
    label: "Bradesco Seguros",
    value: "Bradesco Seguros",
  },
  { label: "Outra", value: "Outra" },
  { label: "Não sei", value: "Não sei" },
];

const bonusOptions = [
  "Não sei",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
].map((item) => ({
  label: item,
  value: item,
}));

export default function StepHistory() {
  const { form, updateField, updateFields } = useQuote();

  function handleCurrentInsuranceChange(value: string) {
    updateField("currentInsurance", value);

    if (value === "Não") {
      updateFields({
        currentInsurer: "",
        bonusClass: "",
        hadClaims: "",
        claimsCount: "",
        insuranceRefused: "",
      });
    }
  }

  function handleClaimsChange(value: string) {
    updateField("hadClaims", value);

    if (value === "Não") {
      updateField("claimsCount", "");
    }
  }

  return (
    <StepLayout
      title="Histórico do seguro"
      subtitle="Essas informações ajudam a agilizar a análise junto às seguradoras."
    >
      <RadioGroup
        label="Possui seguro atualmente?"
        value={form.currentInsurance}
        onChange={handleCurrentInsuranceChange}
        options={yesNoOptions}
      />

      {form.currentInsurance === "Sim" && (
        <>
          <Select
            label="Seguradora atual"
            value={form.currentInsurer}
            required
            onChange={(value) =>
              updateField("currentInsurer", value)
            }
            options={insurerOptions}
          />

          <Select
            label="Classe de bônus"
            value={form.bonusClass}
            required
            onChange={(value) =>
              updateField("bonusClass", value)
            }
            options={bonusOptions}
          />

          <RadioGroup
            label="Teve sinistro na vigência atual do seguro?"
            value={form.hadClaims}
            onChange={handleClaimsChange}
            options={yesNoOptions}
          />

          {form.hadClaims === "Sim" && (
            <Input
              label="Quantos sinistros?"
              value={form.claimsCount}
              placeholder="Ex.: 1"
              required
              onChange={(value) =>
                updateField(
                  "claimsCount",
                  value.replace(/\D/g, "").slice(0, 2)
                )
              }
            />
          )}
        </>
      )}
    </StepLayout>
  );
}