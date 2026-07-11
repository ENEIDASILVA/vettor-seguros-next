"use client";

import { useMemo, useState } from "react";

import Button from "../../ui/Button";
import BeneficiaryCard from "./BeneficiaryCard";
import BeneficiaryModal from "./BeneficiaryModal";

import { Beneficiary } from "../types";
import { useQuote } from "../context/QuoteContext";

export default function BeneficiaryList() {
  const {
    form,
    addBeneficiary,
    updateBeneficiary,
    removeBeneficiary,
  } = useQuote();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] =
    useState<Beneficiary | null>(null);

  const totalPercentage = useMemo(() => {
    return form.beneficiaries.reduce((total, beneficiary) => {
      return total + Number(beneficiary.percentage || 0);
    }, 0);
  }, [form.beneficiaries]);

  function handleAdd() {
    setSelectedBeneficiary(null);
    setModalOpen(true);
  }

  function handleEdit(beneficiary: Beneficiary) {
    setSelectedBeneficiary(beneficiary);
    setModalOpen(true);
  }

  function handleSave(beneficiary: Beneficiary) {
    if (selectedBeneficiary) {
      updateBeneficiary(selectedBeneficiary.id, beneficiary);
      return;
    }

    addBeneficiary(beneficiary);
  }

  function handleClose() {
    setModalOpen(false);
    setSelectedBeneficiary(null);
  }

  const totalIsValid = totalPercentage === 100;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-bold text-blue-900">
            Beneficiários
          </h3>

          <p className="mt-1 text-gray-600">
            Cadastre as pessoas que receberão o capital segurado.
          </p>
        </div>

        <Button variant="primary" onClick={handleAdd}>
          Adicionar beneficiário
        </Button>
      </div>

      {form.beneficiaries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <p className="font-semibold text-gray-700">
            Nenhum beneficiário cadastrado.
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Adicione pelo menos um beneficiário para continuar.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {form.beneficiaries.map((beneficiary) => (
            <BeneficiaryCard
              key={beneficiary.id}
              name={beneficiary.name}
              relationship={beneficiary.relationship}
              percentage={beneficiary.percentage}
              onEdit={() => handleEdit(beneficiary)}
              onRemove={() => removeBeneficiary(beneficiary.id)}
            />
          ))}
        </div>
      )}

      <div
        className={
          totalIsValid
            ? "mt-6 rounded-2xl border border-green-200 bg-green-50 p-5"
            : "mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5"
        }
      >
        <div className="flex items-center justify-between gap-4">
          <span className="font-bold text-gray-800">
            Total distribuído
          </span>

          <span
            className={
              totalIsValid
                ? "text-2xl font-bold text-green-700"
                : "text-2xl font-bold text-amber-700"
            }
          >
            {totalPercentage}%
          </span>
        </div>

        <p
          className={
            totalIsValid
              ? "mt-2 text-sm text-green-700"
              : "mt-2 text-sm text-amber-700"
          }
        >
          {totalIsValid
            ? "A distribuição está correta."
            : "A soma dos percentuais deve ser exatamente 100%."}
        </p>
      </div>

      <BeneficiaryModal
        open={modalOpen}
        beneficiary={selectedBeneficiary}
        onClose={handleClose}
        onSave={handleSave}
      />
    </div>
  );
}