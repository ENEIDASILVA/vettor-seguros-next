import { NextResponse } from "next/server";

const BASE_URL =
  "https://parallelum.com.br/fipe/api/v1/carros/marcas";

export async function GET() {
  try {
    const response = await fetch(BASE_URL, {
      next: {
        revalidate: 60 * 60 * 24, // 24 horas
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Não foi possível carregar as marcas.",
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