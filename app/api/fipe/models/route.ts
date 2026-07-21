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

    if (!brandCode) {
      return NextResponse.json(
        {
          error:
            "Código da marca não informado.",
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
      "/modelos";

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
            "Não foi possível carregar os modelos.",
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
          "Erro interno ao consultar a FIPE.",
      },
      {
        status: 500,
      }
    );
  }
}