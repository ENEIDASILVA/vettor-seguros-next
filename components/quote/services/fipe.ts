export type FipeVehicleType =
  | "carros"
  | "motos"
  | "caminhoes";

export interface FipeBrand {
  value: string;
  label: string;
}

export interface FipeModel {
  value: string;
  label: string;
}

export interface FipeYear {
  value: string;
  label: string;
}

interface BrandApiResponse {
  codigo: string;
  nome: string;
}

interface ModelApiResponse {
  codigo: number;
  nome: string;
}

interface ModelsApiResponse {
  modelos: ModelApiResponse[];
}

interface YearApiResponse {
  codigo: string;
  nome: string;
}

function normalizeYearLabel(label: string) {
  const trimmedLabel = label.trim();

  if (trimmedLabel.startsWith("32000 ")) {
    return (
      "Zero KM " +
      trimmedLabel.substring(6)
    );
  }

  return trimmedLabel;
}

export async function getBrands(
  vehicleType: FipeVehicleType
): Promise<FipeBrand[]> {
  const url =
    "/api/fipe/brands?type=" +
    encodeURIComponent(vehicleType);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      "Não foi possível carregar as marcas."
    );
  }

  const data =
    (await response.json()) as BrandApiResponse[];

  return data
    .map((brand) => ({
      value: String(brand.codigo),
      label: brand.nome,
    }))
    .sort((first, second) =>
      first.label.localeCompare(
        second.label,
        "pt-BR"
      )
    );
}

export async function getModels(
  vehicleType: FipeVehicleType,
  brandCode: string
): Promise<FipeModel[]> {
  if (!brandCode) {
    return [];
  }

  const url =
    "/api/fipe/models?type=" +
    encodeURIComponent(vehicleType) +
    "&brand=" +
    encodeURIComponent(brandCode);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      "Não foi possível carregar os modelos."
    );
  }

  const data =
    (await response.json()) as ModelsApiResponse;

  return data.modelos
    .map((model) => ({
      value: String(model.codigo),
      label: model.nome,
    }))
    .sort((first, second) =>
      first.label.localeCompare(
        second.label,
        "pt-BR"
      )
    );
}

export async function getYears(
  vehicleType: FipeVehicleType,
  brandCode: string,
  modelCode: string
): Promise<FipeYear[]> {
  if (!brandCode || !modelCode) {
    return [];
  }

  const url =
    "/api/fipe/years?type=" +
    encodeURIComponent(vehicleType) +
    "&brand=" +
    encodeURIComponent(brandCode) +
    "&model=" +
    encodeURIComponent(modelCode);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      "Não foi possível carregar os anos e versões."
    );
  }

  const data =
    (await response.json()) as YearApiResponse[];

  return data.map((year) => ({
    value: String(year.codigo),
    label: normalizeYearLabel(year.nome),
  }));
}