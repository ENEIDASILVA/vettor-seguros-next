import {
  NextRequest,
  NextResponse,
} from "next/server";

const BASE_URL =
  "https://parallelum.com.br/fipe/api/v1";

const allowedTypes = [
  "carros",
  "motos",
  "caminhoes",
];

export async function GET(
  request: NextRequest
) {
  try {
    const type =
      request.nextUrl.searchParams.get(
        "type"
      );

    const brandCode =
      request.nextUrl.searchParams.get(
        "brand"
      );

    const modelCode =
      request.nextUrl.searchParams.get(
        "model"
      );

    if (
      !type ||
      !allowedTypes.includes(type)
    ) {
      return NextResponse.json(
        {
          error:
            "Tipo de veículo inválido.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !brandCode ||
      !modelCode
    ) {
      return NextResponse.json(
        {
          error:
            "Marca e modelo são obrigatórios.",
        },
        {
          status: 400,
        }
      );
    }

    const url =
      BASE_URL +
      "/" +
      type +
      "/marcas/" +
      encodeURIComponent(
        brandCode
      ) +
      "/modelos/" +
      encodeURIComponent(
        modelCode
      ) +
      "/anos";

    const response =
      await fetch(url, {
        next: {
          revalidate:
            60 * 60 * 24,
        },
      });

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            "Não foi possível carregar os anos.",
        },
        {
          status: response.status,
        }
      );
    }

    const data =
      await response.json();

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      {
        error:
          "Erro interno ao consultar os anos.",
      },
      {
        status: 500,
      }
    );
  }
}