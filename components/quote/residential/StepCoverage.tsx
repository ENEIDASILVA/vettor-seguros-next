import StepLayout from "../common/StepLayout";
import { useQuote } from "../context/QuoteContext";

const coverageGroups = [
  {
    title: "Proteções principais",
    description: "Coberturas essenciais para proteger o imóvel.",
    coverages: [
      "Incêndio, Raio e Explosão",
      "Danos Elétricos",
      "Vendaval, Furacão, Ciclone e Granizo",
    ],
  },
  {
    title: "Coberturas adicionais",
    description:
      "Escolha proteções complementares de acordo com suas necessidades.",
    coverages: [
      "Roubo ou Furto de Bens",
      "Quebra de Vidros",
      "Responsabilidade Civil Familiar",
      "Equipamentos Eletrônicos",
      "Placas Solares",
    ],
  },
  {
    title: "Assistência",
    description:
      "Serviços para ajudar em imprevistos do dia a dia.",
    coverages: [
      "Assistência Residencial 24h",
    ],
  },
];

export default function StepCoverage() {
  const { form, toggleCoverage } = useQuote();

  return (
    <StepLayout
      title="Coberturas desejadas"
      subtitle="Escolha as proteções que deseja incluir na sua cotação."
    >
      <div className="space-y-8">
        {coverageGroups.map((group) => (
          <section key={group.title}>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-blue-900">
                {group.title}
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                {group.description}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {group.coverages.map((coverage) => {
                const selected =
                  form.coverages.includes(coverage);

                return (
                  <button
                    key={coverage}
                    type="button"
                    aria-pressed={selected}
                    onClick={() =>
                      toggleCoverage(coverage)
                    }
                    className={
                      selected
                        ? "rounded-2xl border-2 border-[#0B2E6D] bg-[#0B2E6D] p-5 text-left font-semibold text-white shadow-sm transition-all"
                        : "rounded-2xl border border-gray-300 bg-white p-5 text-left font-semibold text-[#0B2E6D] transition-all hover:border-[#0B2E6D] hover:bg-blue-50"
                    }
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={
                          selected
                            ? "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-sm text-[#0B2E6D]"
                            : "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-300 text-sm"
                        }
                      >
                        {selected ? "✓" : ""}
                      </span>

                      {coverage}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </StepLayout>
  );
}