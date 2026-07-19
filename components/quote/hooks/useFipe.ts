"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  FipeBrand,
  FipeModel,
  FipeYear,
  getBrands,
  getModels,
  getYears,
} from "../services/fipe";

export function useFipe() {
  const [brands, setBrands] = useState<FipeBrand[]>(
    []
  );

  const [models, setModels] = useState<FipeModel[]>(
    []
  );

  const [years, setYears] = useState<FipeYear[]>(
    []
  );

  const [loadingBrands, setLoadingBrands] =
    useState(false);

  const [loadingModels, setLoadingModels] =
    useState(false);

  const [loadingYears, setLoadingYears] =
    useState(false);

  const [brandsError, setBrandsError] =
    useState("");

  const [modelsError, setModelsError] =
    useState("");

  const [yearsError, setYearsError] =
    useState("");

  const loadBrands = useCallback(async () => {
    setLoadingBrands(true);
    setBrandsError("");

    try {
      const data = await getBrands();
      setBrands(data);
    } catch (error) {
      setBrands([]);

      setBrandsError(
        error instanceof Error
          ? error.message
          : "Erro ao carregar as marcas."
      );
    } finally {
      setLoadingBrands(false);
    }
  }, []);

  const loadModels = useCallback(
    async (brandCode: string) => {
      setModels([]);
      setYears([]);
      setModelsError("");
      setYearsError("");

      if (!brandCode) {
        return;
      }

      setLoadingModels(true);

      try {
        const data = await getModels(brandCode);
        setModels(data);
      } catch (error) {
        setModels([]);

        setModelsError(
          error instanceof Error
            ? error.message
            : "Erro ao carregar os modelos."
        );
      } finally {
        setLoadingModels(false);
      }
    },
    []
  );

  const loadYears = useCallback(
    async (
      brandCode: string,
      modelCode: string
    ) => {
      setYears([]);
      setYearsError("");

      if (!brandCode || !modelCode) {
        return;
      }

      setLoadingYears(true);

      try {
        const data = await getYears(
          brandCode,
          modelCode
        );

        setYears(data);
      } catch (error) {
        setYears([]);

        setYearsError(
          error instanceof Error
            ? error.message
            : "Erro ao carregar os anos e versões."
        );
      } finally {
        setLoadingYears(false);
      }
    },
    []
  );

  useEffect(() => {
    void loadBrands();
  }, [loadBrands]);

  return {
    brands,
    models,
    years,

    loadingBrands,
    loadingModels,
    loadingYears,

    brandsError,
    modelsError,
    yearsError,

    loadBrands,
    loadModels,
    loadYears,
  };
}