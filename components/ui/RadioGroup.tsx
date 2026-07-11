interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  label: string;
  value: string;
  options: RadioOption[];
  onChange: (value: string) => void;
}

export default function RadioGroup({
  label,
  value,
  options,
  onChange,
}: RadioGroupProps) {
  return (
    <div className="mb-6">
      <label className="mb-3 block font-semibold text-[#0B2E6D]">
        {label}
      </label>

      <div className="flex flex-wrap gap-4">
        {options.map((option) => {
          const selected = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={
                selected
                  ? "rounded-xl border-2 border-[#0B2E6D] bg-[#0B2E6D] px-6 py-3 font-semibold text-white transition-all"
                  : "rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-[#0B2E6D] transition-all hover:border-[#0B2E6D]"
              }
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}