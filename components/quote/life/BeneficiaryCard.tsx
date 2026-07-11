"use client";

import Button from "../../ui/Button";

interface BeneficiaryCardProps {
  name: string;
  relationship: string;
  percentage: string;
  onEdit: () => void;
  onRemove: () => void;
}

export default function BeneficiaryCard({
  name,
  relationship,
  percentage,
  onEdit,
  onRemove,
}: BeneficiaryCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-blue-900">
            {name}
          </h3>

          <p className="mt-1 text-gray-600">
            {relationship}
          </p>

          <span className="mt-3 inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-900">
            {percentage}%
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={onEdit}
          >
            Editar
          </Button>

          <Button
            variant="outline"
            onClick={onRemove}
            className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
          >
            Excluir
          </Button>
        </div>
      </div>
    </div>
  );
}