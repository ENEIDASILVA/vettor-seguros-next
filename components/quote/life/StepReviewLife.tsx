"use client";

import StepLayout from "../common/StepLayout";
import SummaryCard from "../common/SummaryCard";
import SummaryField from "../common/SummaryField";

import { useQuote } from "../context/QuoteContext";

interface StepReviewLifeProps {
  onEdit: (stepNumber: number) => void;
}

export default function StepReviewLife({
  onEdit,
}: StepReviewLifeProps) {
  const { form } = useQuote();

  const totalPercentage = form.beneficiaries.reduce(
    (total, beneficiary) =>
      total + Number(beneficiary.percentage || 0),
    0
  );

  return (
    <StepLayout
      title="Revise sua solicitação"
      subtitle="Confira todas as informações do Seguro de Vida antes do envio."
    >
      <div className="space-y-6">
        <SummaryCard
          title="Dados do segurado"
          onEdit={() => onEdit(2)}
        >
          <SummaryField
            label="Nome"
            value={form.name}
          />

          <SummaryField
            label="Telefone"
            value={form.phone}
          />

          {form.email.trim() !== "" && (
            <SummaryField
              label="E-mail"
              value={form.email}
            />
          )}

          <SummaryField
            label="CPF"
            value={form.cpf}
          />
        </SummaryCard>

        <SummaryCard
          title="Perfil do segurado"
          onEdit={() => onEdit(3)}
        >
          <SummaryField
            label="Data de nascimento"
            value={form.lifeBirthDate}
          />

          <SummaryField
            label="Estado civil"
            value={form.lifeMaritalStatus}
          />

          <SummaryField
            label="Profissão"
            value={form.lifeProfession}
          />

          <SummaryField
            label="Renda mensal aproximada"
            value={form.lifeMonthlyIncome}
          />
        </SummaryCard>

        <SummaryCard
          title="Saúde e atividades"
          onEdit={() => onEdit(4)}
        >
          <SummaryField
            label="Fumante"
            value={form.lifeSmoker}
          />

          <SummaryField
            label="Atividade profissional de risco"
            value={form.lifeRiskActivity}
          />

          <SummaryField
            label="Pratica esportes radicais"
            value={form.lifeExtremeSports}
          />

          <SummaryField
            label="Viagens frequentes a trabalho"
            value={form.lifeFrequentTravel}
          />
        </SummaryCard>

        <SummaryCard
          title="Capital e coberturas"
          onEdit={() => onEdit(5)}
          complete={
            form.lifeInsuredCapital.trim() !== "" &&
            form.coverages.length > 0
          }
        >
          <SummaryField
            label="Capital segurado"
            value={form.lifeInsuredCapital}
          />

          {form.coverages.length > 0 ? (
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {form.coverages.map((coverage) => (
                <li
                  key={coverage}
                  className="rounded-lg bg-blue-50 px-3 py-2 font-medium text-blue-900"
                >
                  ✓ {coverage}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-amber-700">
              Nenhuma cobertura selecionada.
            </p>
          )}
        </SummaryCard>

        <SummaryCard
          title="Beneficiários"
          onEdit={() => onEdit(6)}
          complete={
            form.beneficiaries.length > 0 &&
            totalPercentage === 100
          }
        >
          {form.beneficiaries.length > 0 ? (
            <div className="space-y-4">
              {form.beneficiaries.map((beneficiary) => (
                <div
                  key={beneficiary.id}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                >
                  <SummaryField
                    label="Nome"
                    value={beneficiary.name}
                  />

                  <SummaryField
                    label="Parentesco"
                    value={beneficiary.relationship}
                  />

                  <SummaryField
                    label="Percentual"
                    value={
                      beneficiary.percentage + "%"
                    }
                  />
                </div>
              ))}

              <div
                className={
                  totalPercentage === 100
                    ? "rounded-xl border border-green-200 bg-green-50 p-4"
                    : "rounded-xl border border-amber-200 bg-amber-50 p-4"
                }
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-bold text-gray-800">
                    Total distribuído
                  </span>

                  <span
                    className={
                      totalPercentage === 100
                        ? "text-xl font-bold text-green-700"
                        : "text-xl font-bold text-amber-700"
                    }
                  >
                    {totalPercentage}%
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-amber-700">
              Nenhum beneficiário cadastrado.
            </p>
          )}
        </SummaryCard>
      </div>
    </StepLayout>
  );
}