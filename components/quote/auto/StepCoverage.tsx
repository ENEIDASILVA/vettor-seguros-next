import StepLayout from "../common/StepLayout";
import { useQuote } from "../context/QuoteContext";

const coverages = [
  "Colisão",
  "Roubo e Furto",
  "Incêndio",
  "Danos a Terceiros",
  "Carro Reserva",
  "Assistência 24h",
  "Vidros",
  "Faróis",
  "Lanternas",
  "Retrovisores",
  "APP - Acidentes de Passageiros",
];

export default function StepCoverage() {
  const { form, toggleCoverage } = useQuote();

  return (
    <StepLayout title="Coberturas desejadas" subtitle="Selecione as coberturas que você considera importantes.">
      <div className="grid gap-4 md:grid-cols-2">
        {coverages.map((coverage) => {
          const selected = form.coverages.includes(coverage);

          return (
            <button
              key={coverage}
              type="button"
              onClick={() => toggleCoverage(coverage)}
              className={
                selected
                  ? "rounded-2xl border-2 border-[#0B2E6D] bg-[#0B2E6D] p-5 text-left font-semibold text-white transition-all"
                  : "rounded-2xl border border-gray-300 bg-white p-5 text-left font-semibold text-[#0B2E6D] transition-all hover:border-[#0B2E6D]"
              }
            >
              {coverage}
            </button>
          );
        })}
      </div>
    </StepLayout>
  );
}