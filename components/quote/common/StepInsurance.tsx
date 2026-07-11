import { Check } from "lucide-react";

import { InsuranceType } from "../types";
import { insuranceTypes } from "../data";

interface Props {
  value: InsuranceType | "";
  onSelect: (value: InsuranceType) => void;
}

export default function StepInsurance({ value, onSelect }: Props) {
  return (
    <div>
      <h2 className="mb-3 text-3xl font-bold text-[#0B2E6D]">
        Qual seguro você procura?
      </h2>

      <p className="mb-8 text-gray-600">
        Selecione uma opção para iniciarmos sua cotação.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {insuranceTypes.map((item) => {
          const selected = value === item;

          return (
            <button
              key={item}
              type="button"
              onClick={() => onSelect(item)}
              className={
                selected
                  ? "flex w-full items-center justify-between rounded-3xl border-2 border-[#0B2E6D] bg-[#0B2E6D] p-7 text-left text-white shadow-lg transition-all duration-300 scale-[1.02]"
                  : "flex w-full items-center justify-between rounded-3xl border border-gray-100 bg-white p-7 text-left text-[#0B2E6D] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#0B2E6D] hover:shadow-lg"
              }
            >
              <span className="text-lg font-bold">{item}</span>

              {selected && <Check size={22} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}