"use client";

import { useEffect } from "react";

import Autocomplete, {
  AutocompleteOption,
} from "../../ui/Autocomplete";

import { useFipe } from "../hooks/useFipe";

interface VehicleSelectorProps {
  brandCode: string;
  modelCode: string;
  yearCode: string;

  onBrandChange: (
    code: string,
    name: string
  ) => void;

  onModelChange: (
    code: string,
    name: string
  ) => void;

  onYearChange: (
    code: string,
    name: string,
    fuel: string
  ) => void;
}

function extractFuel(yearLabel: string) {
  const normalizedLabel = yearLabel.trim();

  if (
    normalizedLabel.toLowerCase().startsWith(
      "zero km "
    )
  ) {
    return normalizedLabel.substring(8).trim();
  }

  const firstSpace =
    normalizedLabel.indexOf(" ");

  if (firstSpace === -1) {
    return "";
  }

  return normalizedLabel
    .substring(firstSpace + 1)
    .trim();
}

export default function VehicleSelector({
  brandCode,
  modelCode,
  yearCode,
  onBrandChange,
  onModelChange,
  onYearChange,
}: VehicleSelectorProps) {
  const {
    brands,
    models,
    years,

    loadingBrands,
    loadingModels,
    loadingYears,

    brandsError,
    modelsError,
    yearsError,

    loadModels,
    loadYears,
  } = useFipe();

  useEffect(() => {
    if (brandCode) {
      void loadModels(brandCode);
    }
  }, [brandCode, loadModels]);

  useEffect(() => {
    if (brandCode && modelCode) {
      void loadYears(
        brandCode,
        modelCode
      );
    }
  }, [
    brandCode,
    modelCode,
    loadYears,
  ]);

  function handleBrand(
    option: AutocompleteOption | null
  ) {
    if (!option) {
      onBrandChange("", "");
      onModelChange("", "");
      onYearChange("", "", "");
      return;
    }

    onBrandChange(
      option.value,
      option.label
    );

    onModelChange("", "");
    onYearChange("", "", "");
  }

  function handleModel(
    option: AutocompleteOption | null
  ) {
    if (!option) {
      onModelChange("", "");
      onYearChange("", "", "");
      return;
    }

    onModelChange(
      option.value,
      option.label
    );

    onYearChange("", "", "");
  }

  function handleYear(
    option: AutocompleteOption | null
  ) {
    if (!option) {
      onYearChange("", "", "");
      return;
    }

    onYearChange(
      option.value,
      option.label,
      extractFuel(option.label)
    );
  }

  return (
    <>
      <Autocomplete
        label="Marca"
        placeholder="Digite ou selecione a marca..."
        value={brandCode}
        options={brands}
        loading={loadingBrands}
        required
        error={brandsError}
        noOptionsMessage="Nenhuma marca encontrada."
        onChange={handleBrand}
      />

      <Autocomplete
        label="Modelo"
        placeholder={
          brandCode
            ? "Digite ou selecione o modelo..."
            : "Selecione primeiro a marca"
        }
        value={modelCode}
        options={models}
        loading={loadingModels}
        disabled={!brandCode}
        required
        error={modelsError}
        noOptionsMessage="Nenhum modelo encontrado para esta marca."
        onChange={handleModel}
      />

      <Autocomplete
        label="Ano / Versão"
        placeholder={
          modelCode
            ? "Selecione o ano e a versão..."
            : "Selecione primeiro o modelo"
        }
        value={yearCode}
        options={years}
        loading={loadingYears}
        disabled={!brandCode || !modelCode}
        required
        error={yearsError}
        noOptionsMessage="Nenhum ano ou versão encontrado para este modelo."
        onChange={handleYear}
      />
    </>
  );
}