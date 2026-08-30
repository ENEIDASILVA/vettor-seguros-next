"use client";

import { Info, X } from "lucide-react";
import { useState } from "react";

import StepLayout from "../common/StepLayout";
import { useQuote } from "../context/QuoteContext";

const coverageTips: Record<string, string> = {
  "Incêndio, Raio e Explosão":
    "Ajuda a reparar ou reconstruir o imóvel e repor bens atingidos por incêndio, queda de raio no local ou explosão.",
  "Danos Elétricos":
    "Cobre danos causados por curto-circuito, variação de tensão e outros acidentes elétricos em aparelhos e instalações.",
  "Vendaval, Furacão, Ciclone e Granizo":
    "Protege contra danos ao imóvel provocados por ventos fortes e queda de granizo, conforme as condições da apólice.",
  "Impacto de Veículos":
    "Cobre danos materiais quando um veículo atinge muros, portões ou outras partes do imóvel segurado.",
  Desmoronamento:
    "Ajuda a reparar danos causados pelo desmoronamento total ou parcial de estruturas cobertas.",
  "Perda e Pagamento de Aluguel":
    "Pode pagar aluguel temporário ao morador ou compensar o aluguel perdido pelo proprietário quando o imóvel fica sem condições de uso.",
  "Roubo ou Furto Qualificado de Bens":
    "Protege os bens da residência em casos de roubo ou furto com sinais de arrombamento, dentro dos limites contratados.",
  "Quebra de Vidros, Mármores e Granitos":
    "Cobre a quebra acidental de itens fixos, como vidros, espelhos, tampos de mármore e peças de granito.",
  "Responsabilidade Civil Familiar":
    "Ajuda a pagar danos corporais ou materiais causados involuntariamente a outras pessoas por moradores da residência.",
  "Equipamentos Eletrônicos":
    "Amplia a proteção para equipamentos eletrônicos contra eventos previstos na apólice e dentro do limite contratado.",
  "Placas Solares":
    "Protege painéis solares e componentes da instalação contra os riscos descritos nas condições do seguro.",
  "Ruptura de Tanques e Tubulações":
    "Cobre danos provocados pelo rompimento acidental de reservatórios e tubulações do imóvel.",
  "Tumultos, Greves e Lockout":
    "Protege o imóvel contra danos decorrentes de tumultos, greves e paralisações patronais cobertas pela apólice.",
  "Despesas Extraordinárias":
    "Ajuda com gastos emergenciais e necessários após um sinistro coberto, conforme limites e regras da seguradora.",
  "Assistência 24 Horas":
    "Disponibiliza serviços emergenciais para a residência, como chaveiro, encanador e eletricista, conforme o plano contratado.",
  "Assistência Pet":
    "Oferece serviços de apoio para cães e gatos, que podem incluir orientação veterinária e atendimentos previstos no plano.",
};

const coverageGroups = [
  {
    title: "Proteções principais",
    description: "Coberturas essenciais para proteger o imóvel.",
    coverages: [
      "Incêndio, Raio e Explosão",
      "Danos Elétricos",
      "Vendaval, Furacão, Ciclone e Granizo",
      "Impacto de Veículos",
      "Desmoronamento",
    ],
  },
  {
    title: "Coberturas adicionais",
    description:
      "Escolha proteções complementares de acordo com suas necessidades.",
    coverages: [
      "Perda e Pagamento de Aluguel",
      "Roubo ou Furto Qualificado de Bens",
      "Quebra de Vidros, Mármores e Granitos",
      "Responsabilidade Civil Familiar",
      "Equipamentos Eletrônicos",
      "Placas Solares",
      "Ruptura de Tanques e Tubulações",
      "Tumultos, Greves e Lockout",
      "Despesas Extraordinárias",
    ],
  },
  {
    title: "Assistência",
    description:
      "Serviços para ajudar em imprevistos do dia a dia.",
    coverages: [
      "Assistência 24 Horas",
      "Assistência Pet",
    ],
  },
];

export default function StepCoverage() {
  const { form, toggleCoverage } = useQuote();
  const [openTip, setOpenTip] = useState<string | null>(null);

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
                const tipIsOpen = openTip === coverage;
                const tipId =
                  "coverage-tip-" +
                  coverage
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/[^a-zA-Z0-9]+/g, "-")
                    .toLowerCase();

                return (
                  <div
                    key={coverage}
                    className={
                      selected
                        ? "relative rounded-2xl border-2 border-[#0B2E6D] bg-[#0B2E6D] text-white shadow-sm transition-all"
                        : "relative rounded-2xl border border-gray-300 bg-white text-[#0B2E6D] transition-all hover:border-[#0B2E6D] hover:bg-blue-50"
                    }
                  >
                    <button
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleCoverage(coverage)}
                      className="flex min-h-20 w-full items-center gap-3 rounded-2xl p-5 pr-12 text-left font-semibold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                    >
                      <span className={selected ? "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-sm text-[#0B2E6D]" : "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-300 text-sm"}>
                        {selected ? "✓" : ""}
                      </span>
                      {coverage}
                    </button>

                    <button
                      type="button"
                      aria-label={(tipIsOpen ? "Fechar dica sobre " : "Ver dica sobre ") + coverage}
                      aria-expanded={tipIsOpen}
                      aria-controls={tipId}
                      onClick={() => setOpenTip(tipIsOpen ? null : coverage)}
                      className={selected ? "absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-blue-100 transition hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" : "absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-blue-700 transition hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"}
                    >
                      {tipIsOpen ? <X size={15} aria-hidden="true" /> : <Info size={15} aria-hidden="true" />}
                    </button>

                    {tipIsOpen && (
                      <p
                        id={tipId}
                        className={selected ? "mx-4 mb-4 rounded-xl bg-white/10 px-4 py-3 text-sm font-normal leading-relaxed text-blue-50" : "mx-4 mb-4 rounded-xl bg-blue-50 px-4 py-3 text-sm font-normal leading-relaxed text-gray-700"}
                      >
                        {coverageTips[coverage]}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </StepLayout>
  );
}
