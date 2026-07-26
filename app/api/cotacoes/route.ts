import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";

type QuotePayload = {
  insuranceType?: unknown;

  name?: unknown;
  phone?: unknown;
  email?: unknown;
  cpf?: unknown;

  vehicleType?: unknown;
  observations?: unknown;

  [key: string]: unknown;
};

function readString(value: unknown): string {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function getInsuranceAliases(
  insuranceType: string,
  vehicleType: string
): string[] {
  const insurance =
    insuranceType.toLowerCase();

  const vehicle =
    vehicleType.toLowerCase();

  if (
    insurance.includes("vida") ||
    insurance.includes("life")
  ) {
    return [
      "Seguro de Vida",
      "Vida",
    ];
  }

  if (
    insurance.includes("resid") ||
    insurance.includes("home")
  ) {
    return [
      "Seguro Residencial",
      "Residencial",
    ];
  }

  if (
    vehicle.includes("moto") ||
    insurance.includes("moto")
  ) {
    return [
      "Seguro Auto",
      "Auto",
      "Moto",
    ];
  }

  return [
    "Seguro Auto",
    "Auto",
  ];
}

function isValidEmail(email: string): boolean {
  if (!email) {
    return true;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  );
}

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as QuotePayload;

    const name =
      readString(body.name);

    const phone =
      readString(body.phone);

    const email =
      readString(body.email).toLowerCase();

    const cpf =
      readString(body.cpf);

    const insuranceType =
      readString(body.insuranceType);

    const vehicleType =
      readString(body.vehicleType);

    const observations =
      readString(body.observations);

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Informe o nome do cliente.",
        },
        {
          status: 400,
        }
      );
    }

    const normalizedPhone =
      onlyDigits(phone);

    if (
      normalizedPhone.length < 10 ||
      normalizedPhone.length > 11
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Informe um telefone válido.",
        },
        {
          status: 400,
        }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Informe um e-mail válido.",
        },
        {
          status: 400,
        }
      );
    }

    if (!insuranceType) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Informe o tipo de seguro.",
        },
        {
          status: 400,
        }
      );
    }

    const normalizedCpf =
      onlyDigits(cpf);

    const supabase =
      createAdminClient();

    let clientId: string | null =
      null;

    /*
     * Primeiro procura o cliente pelo CPF.
     */
    if (normalizedCpf) {
      const {
        data: clientByCpf,
        error: clientByCpfError,
      } = await supabase
        .from("clientes")
        .select("id")
        .eq("cpf", normalizedCpf)
        .limit(1)
        .maybeSingle();

      if (clientByCpfError) {
        throw clientByCpfError;
      }

      clientId =
        clientByCpf?.id ?? null;
    }

    /*
     * Se não encontrou pelo CPF,
     * procura pelo telefone.
     */
    if (!clientId) {
      const {
        data: clientByPhone,
        error: clientByPhoneError,
      } = await supabase
        .from("clientes")
        .select("id")
        .eq(
          "telefone",
          normalizedPhone
        )
        .limit(1)
        .maybeSingle();

      if (clientByPhoneError) {
        throw clientByPhoneError;
      }

      clientId =
        clientByPhone?.id ?? null;
    }

    /*
     * Atualiza o cliente existente
     * ou cria um novo cadastro.
     */
    if (clientId) {
      const {
        error: updateClientError,
      } = await supabase
        .from("clientes")
        .update({
          nome: name,
          telefone:
            normalizedPhone,
          email:
            email || null,
          cpf:
            normalizedCpf || null,
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", clientId);

      if (updateClientError) {
        throw updateClientError;
      }
    } else {
      const {
        data: newClient,
        error: createClientError,
      } = await supabase
        .from("clientes")
        .insert({
          nome: name,
          telefone:
            normalizedPhone,
          email:
            email || null,
          cpf:
            normalizedCpf || null,
        })
        .select("id")
        .single();

      if (
        createClientError ||
        !newClient
      ) {
        throw (
          createClientError ??
          new Error(
            "Não foi possível cadastrar o cliente."
          )
        );
      }

      clientId = newClient.id;
    }

    const insuranceAliases =
      getInsuranceAliases(
        insuranceType,
        vehicleType
      );

    const {
      data: insuranceRecords,
      error: insuranceError,
    } = await supabase
      .from("tipos_seguro")
      .select("id, nome")
      .in(
        "nome",
        insuranceAliases
      )
      .limit(1);

    if (insuranceError) {
      throw insuranceError;
    }

    const insuranceRecord =
      insuranceRecords?.[0];

    if (!insuranceRecord) {
      return NextResponse.json(
        {
          success: false,
          error:
            "O tipo de seguro não está cadastrado no banco.",
        },
        {
          status: 422,
        }
      );
    }

    const {
      data: statusRecords,
      error: statusError,
    } = await supabase
      .from("status_cotacao")
      .select("id, nome")
      .in("nome", [
        "Novo",
        "Nova",
        "Recebida",
      ])
      .limit(1);

    if (statusError) {
      throw statusError;
    }

    const statusRecord =
      statusRecords?.[0];

    if (!statusRecord) {
      return NextResponse.json(
        {
          success: false,
          error:
            'O status inicial "Novo" não está cadastrado no banco.',
        },
        {
          status: 422,
        }
      );
    }

    const {
      data: quote,
      error: quoteError,
    } = await supabase
      .from("cotacoes")
      .insert({
        cliente_id:
          clientId,

        tipo_seguro_id:
          insuranceRecord.id,

        status_id:
          statusRecord.id,

        origem:
          "Site",

        observacoes:
          observations || null,

        dados:
          body,
      })
      .select("id")
      .single();

    if (
      quoteError ||
      !quote
    ) {
      throw (
        quoteError ??
        new Error(
          "Não foi possível cadastrar a cotação."
        )
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Cotação registrada com sucesso.",
        quoteId:
          quote.id,
        clientId,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Erro na API de cotações:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Não foi possível registrar a cotação.",
      },
      {
        status: 500,
      }
    );
  }
}