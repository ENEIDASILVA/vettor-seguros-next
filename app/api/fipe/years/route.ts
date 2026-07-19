import { NextRequest, NextResponse } from "next/server";

const BASE_URL =
  "https://parallelum.com.br/fipe/api/v1/carros/marcas";

export async function GET(request: NextRequest) {
  try {
    const brandCode =
      request.nextUrl.searchParams.get("brand");

    const modelCode =
      request.nextUrl.searchParams.get("model");

    if (!brandCode || !modelCode) {
      return NextResponse.json(
        {
          error:
            "Os códigos da marca e do modelo são obrigatórios.",
        },
        {
          status: 400,
        }
      );
    }

    const url =
      BASE_URL +
      "/" +
      encodeURIComponent(brandCode) +
      "/modelos/" +
      encodeURIComponent(modelCode) +
      "/anos";

    const response = await fetch(url, {
      next: {
        revalidate: 60 * 60 * 24,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            "Não foi possível carregar os anos do veículo.",
        },
        {
          status: response.status,
        }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      {
        error:
          "Erro interno ao consultar os anos na FIPE.",
      },
      {
        status: 500,
      }
    );
  }
}