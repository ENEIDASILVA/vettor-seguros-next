"use client";

import Input from "../../ui/Input";
import StepLayout from "../common/StepLayout";
import { useQuote } from "../context/QuoteContext";

const lifeCoverages = [
  "Morte natural",
  "Morte acidental",
  "Invalidez permanente por acidente",
  "Invalidez funcional por doença",
  "Doenças graves",
  "Diária por incapacidade temporária",
  "Assistência funeral individual",
  "Assistência funeral familiar",
];

export default function StepLifeCoverage() {
  const { form, updateField, toggleCoverage } = useQuote();

  return (
    <StepLayout
      title="Capital segurado e coberturas"
      subtitle="Informe o valor de proteção desejado e selecione as coberturas mais importantes."
    >
      <Input
        label="Capital segurado desejado"
        value={form.lifeInsuredCapital}
        placeholder="Ex.: R$ 300.000,00"
        required
        onChange={(value) =>
          updateField("lifeInsuredCapital", value)
        }
      />

      <div className="mt-8">
        <h3 className="mb-2 text-xl font-bold text-blue-900">
          Coberturas desejadas
        </h3>

        <p className="mb-6 text-gray-600">
          Você pode selecionar mais de uma opção.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {lifeCoverages.map((coverage) => {
            const selected = form.coverages.includes(coverage);

            return (
              <button
                key={coverage}
                type="button"
                onClick={() => toggleCoverage(coverage)}
                className={
                  selected
                    ? "rounded-2xl border-2 border-blue-900 bg-blue-900 p-5 text-left font-semibold text-white transition-all"
                    : "rounded-2xl border border-gray-300 bg-white p-5 text-left font-semibold text-blue-900 transition-all hover:border-blue-900"
                }
              >
                {selected ? "✓ " : ""}
                {coverage}
              </button>
            );
          })}
        </div>
      </div>
    </StepLayout>
  );
}