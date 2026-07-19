"use client";

import Select, {
  SingleValue,
  StylesConfig,
} from "react-select";

export interface AutocompleteOption {
  label: string;
  value: string;
}

interface AutocompleteProps {
  label: string;
  placeholder?: string;
  value: string;
  options: AutocompleteOption[];
  disabled?: boolean;
  required?: boolean;
  loading?: boolean;
  error?: string;
  helperText?: string;
  noOptionsMessage?: string;
  onChange: (
    option: AutocompleteOption | null
  ) => void;
}

const customStyles: StylesConfig<
  AutocompleteOption,
  false
> = {
  control: (base, state) => ({
    ...base,
    minHeight: "50px",
    borderRadius: "0.75rem",
    borderColor: state.isFocused
      ? "#1E3A8A"
      : "#D1D5DB",
    boxShadow: state.isFocused
      ? "0 0 0 4px #DBEAFE"
      : "none",
    cursor: "pointer",

    ":hover": {
      borderColor: "#1E3A8A",
    },
  }),

  valueContainer: (base) => ({
    ...base,
    paddingLeft: "1rem",
    paddingRight: "1rem",
  }),

  input: (base) => ({
    ...base,
    color: "#111827",
  }),

  placeholder: (base) => ({
    ...base,
    color: "#6B7280",
  }),

  singleValue: (base) => ({
    ...base,
    color: "#111827",
  }),

  menu: (base) => ({
    ...base,
    borderRadius: "0.75rem",
    overflow: "hidden",
    zIndex: 50,
  }),

  option: (base, state) => ({
    ...base,
    cursor: "pointer",
    color: state.isSelected
      ? "#FFFFFF"
      : "#111827",
    backgroundColor: state.isSelected
      ? "#1E3A8A"
      : state.isFocused
      ? "#EFF6FF"
      : "#FFFFFF",

    ":active": {
      backgroundColor: "#DBEAFE",
    },
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),
};

export default function Autocomplete({
  label,
  placeholder = "Pesquisar...",
  value,
  options,
  disabled = false,
  required = false,
  loading = false,
  error = "",
  helperText = "",
  noOptionsMessage = "Nenhum resultado encontrado.",
  onChange,
}: AutocompleteProps) {
  const hasError = error.trim() !== "";

  const selectedOption =
    options.find(
      (option) => option.value === value
    ) ?? null;

  function handleChange(
    selected: SingleValue<AutocompleteOption>
  ) {
    onChange(selected ?? null);
  }

  return (
    <div className="mb-6">
      <label className="mb-2 block font-semibold text-blue-900">
        {label}

        {required && (
          <span className="ml-1 text-red-600">
            *
          </span>
        )}
      </label>

      <Select<AutocompleteOption, false>
        instanceId={label}
        value={selectedOption}
        options={options}
        isDisabled={disabled}
        isLoading={loading}
        isClearable
        isSearchable
        placeholder={placeholder}
        loadingMessage={() => "Carregando..."}
        noOptionsMessage={() => noOptionsMessage}
        onChange={handleChange}
        styles={{
          ...customStyles,

          control: (base, state) => {
            const normalControl =
              customStyles.control?.(
                base,
                state
              );

            return {
              ...normalControl,
              borderColor: hasError
                ? "#DC2626"
                : state.isFocused
                ? "#1E3A8A"
                : "#D1D5DB",

              boxShadow: hasError
                ? "0 0 0 4px #FEE2E2"
                : state.isFocused
                ? "0 0 0 4px #DBEAFE"
                : "none",
            };
          },
        }}
        aria-invalid={hasError}
      />

      {helperText && !hasError && (
        <p className="mt-2 text-sm text-gray-500">
          {helperText}
        </p>
      )}

      {hasError && (
        <p className="mt-2 text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}