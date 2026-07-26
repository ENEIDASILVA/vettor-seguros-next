import "server-only";

import { createClient } from "@/lib/supabase/server";

type RelatedName =
  | {
      nome: string | null;
    }
  | Array<{
      nome: string | null;
    }>
  | null;

type LatestQuoteRow = {
  id: string;
  created_at: string;
  clientes: RelatedName;
  tipos_seguro: RelatedName;
  status_cotacao: RelatedName;
};

export type LatestQuote = {
  id: string;
  clientName: string;
  insuranceType: string;
  status: string;
  createdAt: string;
};

export type DashboardData = {
  totalClients: number;
  totalQuotes: number;
  quotesToday: number;
  quotesThisMonth: number;
  inProgressQuotes: number;
  closedQuotes: number;
  latestQuotes: LatestQuote[];
};

function getRelatedName(
  relation: RelatedName,
  fallback: string
): string {
  if (Array.isArray(relation)) {
    return relation[0]?.nome || fallback;
  }

  return relation?.nome || fallback;
}

function getSaoPauloDateParts(date: Date) {
  const formatter = new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone: "America/Sao_Paulo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  );

  const parts = formatter.formatToParts(date);

  const year = Number(
    parts.find(
      (part) => part.type === "year"
    )?.value
  );

  const month = Number(
    parts.find(
      (part) => part.type === "month"
    )?.value
  );

  const day = Number(
    parts.find(
      (part) => part.type === "day"
    )?.value
  );

  return {
    year,
    month,
    day,
  };
}

/*
 * Minas Gerais utiliza o horário de Brasília.
 * Meia-noite em São Paulo corresponde atualmente
 * a 03:00 UTC.
 */
function createSaoPauloMidnightUtc(
  year: number,
  month: number,
  day: number
) {
  return new Date(
    Date.UTC(
      year,
      month - 1,
      day,
      3,
      0,
      0,
      0
    )
  );
}

function getDateRanges() {
  const now = new Date();

  const {
    year,
    month,
    day,
  } = getSaoPauloDateParts(now);

  const todayStart =
    createSaoPauloMidnightUtc(
      year,
      month,
      day
    );

  const tomorrowStart =
    createSaoPauloMidnightUtc(
      year,
      month,
      day + 1
    );

  const monthStart =
    createSaoPauloMidnightUtc(
      year,
      month,
      1
    );

  const nextMonthStart =
    createSaoPauloMidnightUtc(
      year,
      month + 1,
      1
    );

  return {
    todayStart:
      todayStart.toISOString(),

    tomorrowStart:
      tomorrowStart.toISOString(),

    monthStart:
      monthStart.toISOString(),

    nextMonthStart:
      nextMonthStart.toISOString(),
  };
}

async function getStatusIds(
  statusNames: string[]
): Promise<string[]> {
  const supabase =
    await createClient();

  const {
    data,
    error,
  } = await supabase
    .from("status_cotacao")
    .select("id, nome")
    .in("nome", statusNames);

  if (error) {
    throw new Error(
      `Erro ao consultar status: ${error.message}`
    );
  }

  return (
    data?.map((status) => status.id) ?? []
  );
}

async function countQuotesByStatusIds(
  statusIds: string[]
): Promise<number> {
  if (statusIds.length === 0) {
    return 0;
  }

  const supabase =
    await createClient();

  const {
    count,
    error,
  } = await supabase
    .from("cotacoes")
    .select("id", {
      count: "exact",
      head: true,
    })
    .in("status_id", statusIds);

  if (error) {
    throw new Error(
      `Erro ao contar cotações: ${error.message}`
    );
  }

  return count ?? 0;
}

export async function getDashboardData():
Promise<DashboardData> {
  const supabase =
    await createClient();

  const {
    todayStart,
    tomorrowStart,
    monthStart,
    nextMonthStart,
  } = getDateRanges();

  const inProgressStatusNames = [
    "Em atendimento",
    "Em Atendimento",
    "Em cotação",
    "Em Cotação",
    "Proposta enviada",
    "Proposta Enviada",
    "Negociação",
  ];

  const closedStatusNames = [
    "Fechada",
    "Fechado",
    "Concluída",
    "Concluído",
  ];

  const [
    totalClientsResult,
    totalQuotesResult,
    quotesTodayResult,
    quotesThisMonthResult,
    latestQuotesResult,
    inProgressStatusIds,
    closedStatusIds,
  ] = await Promise.all([
    supabase
      .from("clientes")
      .select("id", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("cotacoes")
      .select("id", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("cotacoes")
      .select("id", {
        count: "exact",
        head: true,
      })
      .gte(
        "created_at",
        todayStart
      )
      .lt(
        "created_at",
        tomorrowStart
      ),

    supabase
      .from("cotacoes")
      .select("id", {
        count: "exact",
        head: true,
      })
      .gte(
        "created_at",
        monthStart
      )
      .lt(
        "created_at",
        nextMonthStart
      ),

    supabase
      .from("cotacoes")
      .select(`
        id,
        created_at,
        clientes (
          nome
        ),
        tipos_seguro (
          nome
        ),
        status_cotacao (
          nome
        )
      `)
      .order(
        "created_at",
        {
          ascending: false,
        }
      )
      .limit(10),

    getStatusIds(
      inProgressStatusNames
    ),

    getStatusIds(
      closedStatusNames
    ),
  ]);

  const queryErrors = [
    totalClientsResult.error,
    totalQuotesResult.error,
    quotesTodayResult.error,
    quotesThisMonthResult.error,
    latestQuotesResult.error,
  ].filter(Boolean);

  if (queryErrors.length > 0) {
    const messages = queryErrors
      .map((error) => error?.message)
      .join(" | ");

    throw new Error(
      `Erro ao carregar o dashboard: ${messages}`
    );
  }

  const [
    inProgressQuotes,
    closedQuotes,
  ] = await Promise.all([
    countQuotesByStatusIds(
      inProgressStatusIds
    ),

    countQuotesByStatusIds(
      closedStatusIds
    ),
  ]);

  const latestRows =
    (latestQuotesResult.data ??
      []) as LatestQuoteRow[];

  const latestQuotes =
    latestRows.map((quote) => ({
      id: quote.id,

      clientName:
        getRelatedName(
          quote.clientes,
          "Cliente não identificado"
        ),

      insuranceType:
        getRelatedName(
          quote.tipos_seguro,
          "Seguro não informado"
        ),

      status:
        getRelatedName(
          quote.status_cotacao,
          "Sem status"
        ),

      createdAt:
        quote.created_at,
    }));

  return {
    totalClients:
      totalClientsResult.count ?? 0,

    totalQuotes:
      totalQuotesResult.count ?? 0,

    quotesToday:
      quotesTodayResult.count ?? 0,

    quotesThisMonth:
      quotesThisMonthResult.count ?? 0,

    inProgressQuotes,
    closedQuotes,
    latestQuotes,
  };
}