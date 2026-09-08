"use client";

import { Info, X } from "lucide-react";
import { useState } from "react";

import StepLayout from "../common/StepLayout";
import { useQuote } from "../context/QuoteContext";

const travelCoverageTips: Record<string, string> = {
  "Despesas médicas e hospitalares": "Cobre atendimentos médicos, exames, medicamentos e internações de emergência durante a viagem, dentro do limite contratado.",
  "Atendimento odontológico de emergência": "Ajuda com despesas odontológicas urgentes para aliviar dor ou tratar um problema inesperado durante a viagem.",
  "Traslado médico": "Organiza e cobre o transporte do viajante até uma unidade de saúde adequada quando houver recomendação médica.",
  "Repatriação sanitária": "Providencia o retorno do viajante ao Brasil por motivo de saúde quando o transporte especial for necessário e autorizado.",
  "Extravio de bagagem": "Oferece indenização complementar quando a bagagem despachada é extraviada definitivamente pela transportadora.",
  "Atraso ou cancelamento de voo": "Ajuda com despesas previstas na apólice quando o voo sofre atraso significativo ou é cancelado.",
  "Cancelamento ou interrupção da viagem": "Reembolsa despesas não recuperáveis quando a viagem precisa ser cancelada ou interrompida por um motivo coberto.",
  "Morte acidental": "Garante indenização aos beneficiários em caso de falecimento do segurado decorrente de acidente durante a viagem.",
  "Invalidez permanente por acidente": "Prevê indenização quando um acidente durante a viagem causa perda ou redução permanente da capacidade funcional.",
  "Assistência jurídica": "Oferece orientação ou apoio jurídico emergencial no exterior, de acordo com as condições do plano contratado.",
  "Assistência 24 horas": "Disponibiliza uma central para orientação e acionamento dos serviços do seguro a qualquer hora durante a viagem.",
};

const coverageOptions = {
  "Seguro Empresarial": ["Incêndio, raio e explosão", "Danos elétricos", "Roubo ou furto qualificado", "Vendaval e granizo", "Lucros cessantes", "Responsabilidade civil", "Quebra de máquinas", "Equipamentos eletrônicos", "Assistência empresarial 24 horas"],
  "Seguro Saúde": ["Consultas e exames", "Internações hospitalares", "Urgência e emergência", "Maternidade e obstetrícia", "Terapias", "Odontologia", "Reembolso", "Telemedicina"],
  "Seguro de Equipamentos": ["Danos acidentais", "Incêndio, raio e explosão", "Danos elétricos", "Roubo ou furto qualificado", "Danos durante transporte", "Quero orientação sobre as coberturas"],
  "Seguro Viagem": ["Despesas médicas e hospitalares", "Atendimento odontológico de emergência", "Traslado médico", "Repatriação sanitária", "Extravio de bagagem", "Atraso ou cancelamento de voo", "Cancelamento ou interrupção da viagem", "Morte acidental", "Invalidez permanente por acidente", "Assistência jurídica", "Assistência 24 horas"],
} as const;

export default function StepProductCoverage() {
  const { form, toggleCoverage } = useQuote();
  const [openTip, setOpenTip] = useState<string | null>(null);
  const options = form.insuranceType === "Seguro Empresarial" || form.insuranceType === "Seguro Saúde" || form.insuranceType === "Seguro de Equipamentos" || form.insuranceType === "Seguro Viagem" ? coverageOptions[form.insuranceType] : [];

  return (
    <StepLayout title="Coberturas desejadas" subtitle="Selecione as opções de interesse. A disponibilidade e as condições serão confirmadas na cotação.">
      <div className="grid gap-4 md:grid-cols-2">
        {options.map((coverage) => {
          const selected = form.coverages.includes(coverage);
          const tip = form.insuranceType === "Seguro Viagem" ? travelCoverageTips[coverage] : undefined;
          const tipIsOpen = openTip === coverage;
          const tipId = "product-coverage-tip-" + coverage.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase();

          return (
            <div key={coverage} className={selected ? "relative rounded-2xl border-2 border-blue-900 bg-blue-900 text-white shadow-sm" : "relative rounded-2xl border border-gray-300 bg-white text-blue-900 transition hover:border-blue-900 hover:bg-blue-50"}>
              <button type="button" aria-pressed={selected} onClick={() => toggleCoverage(coverage)} className={tip ? "flex min-h-20 w-full items-center gap-3 rounded-2xl p-5 pr-12 text-left font-semibold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200" : "flex min-h-20 w-full items-center gap-3 rounded-2xl p-5 text-left font-semibold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"}>
                <span className={selected ? "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-blue-900" : "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-300"}>{selected ? "✓" : ""}</span>
                {coverage}
              </button>

              {tip && (
                <button type="button" aria-label={(tipIsOpen ? "Fechar dica sobre " : "Ver dica sobre ") + coverage} aria-expanded={tipIsOpen} aria-controls={tipId} onClick={() => setOpenTip(tipIsOpen ? null : coverage)} className={selected ? "absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-blue-100 transition hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" : "absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-blue-700 transition hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"}>
                  {tipIsOpen ? <X size={15} aria-hidden="true" /> : <Info size={15} aria-hidden="true" />}
                </button>
              )}

              {tipIsOpen && tip && (
                <p id={tipId} className={selected ? "mx-4 mb-4 rounded-xl bg-white/10 px-4 py-3 text-sm font-normal leading-relaxed text-blue-50" : "mx-4 mb-4 rounded-xl bg-blue-50 px-4 py-3 text-sm font-normal leading-relaxed text-gray-700"}>
                  {tip}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </StepLayout>
  );
}
