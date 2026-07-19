import { NextRequest, NextResponse } from "next/server";

const BASE_URL =
  "https://parallelum.com.br/fipe/api/v1/carros/marcas";

export async function GET(request: NextRequest) {
  try {
    const brandCode = request.nextUrl.searchParams.get("brand");

    if (!brandCode) {
      return NextResponse.json(
        {
          error: "Código da marca não informado.",
        },
        {
          status: 400,
        }
      );
    }

    const response = await fetch(
      `${BASE_URL}/${brandCode}/modelos`,
      {
        next: {
          revalidate: 60 * 60 * 24,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Não foi possível carregar os modelos.",
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
        error: "Erro interno ao consultar a FIPE.",
      },
      {
        status: 500,
      }
    );
  }
}