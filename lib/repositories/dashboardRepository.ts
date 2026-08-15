import "server-only";

import { createClient } from "@/lib/supabase/server";

export type DashboardIndicadores = {
  emProcessoCotacao: number;
  propostasEmTratamento: number;
  apoliceAEmitir: number;
  vencendo30Dias: number;
};

export type DashboardTrabalhoItem = {
  id: string;
  cliente: string;
  tipoSeguro: string;
  status: string;
  detalhe: string;
  data: string | null;
  href: string;
};

export type DashboardRenovacao = {
  id: string;
  cliente: string;
  seguradora: string;
  tipoSeguro: string;
  vencimento: string;
  diasRestantes: number;
  href: string;
};

export type DashboardData = {
  indicadores: DashboardIndicadores;
  emProcessoCotacao: DashboardTrabalhoItem[];
  propostasEmTratamento: DashboardTrabalhoItem[];
  apoliceAEmitir: DashboardTrabalhoItem[];
  renovacoes: DashboardRenovacao[];

  // Compatibilidade temporária com componentes antigos do Dashboard.
  ultimasCotacoes: [];
  ultimosClientes: [];
  tarefas: [];
};

function primeiro(relacao: any) {
  return Array.isArray(relacao) ? relacao[0] ?? null : relacao ?? null;
}

function texto(valor: unknown) {
  return String(valor ?? "").trim();
}

function normalizar(valor: unknown) {
  return texto(valor)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}

function dataLocalISO(data: Date) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

async function buscarCotacoesEmProcesso(): Promise<DashboardTrabalhoItem[]> {
  const supabase = await createClient();

  const [
    cotacoesResponse,
    propostasResponse,
    cotacoesSeguradorasResponse,
  ] = await Promise.all([
    supabase
      .from("cotacoes")
      .select(`
        id,
        created_at,
        cliente:clientes(nome),
        tipo_seguro:tipos_seguro(nome)
      `)
      .order("created_at", {
        ascending: true,
      }),

    supabase
      .from("propostas")
      .select("cotacao_id")
      .not("cotacao_id", "is", null),

    supabase
      .from("cotacoes_seguradoras")
      .select("cotacao_id"),
  ]);

  if (cotacoesResponse.error) {
    throw new Error(
      `Não foi possível consultar as cotações do Dashboard: ${cotacoesResponse.error.message}`,
    );
  }

  if (propostasResponse.error) {
    throw new Error(
      `Não foi possível verificar as propostas vinculadas: ${propostasResponse.error.message}`,
    );
  }

  if (cotacoesSeguradorasResponse.error) {
    throw new Error(
      `Não foi possível verificar as cotações das seguradoras: ${cotacoesSeguradorasResponse.error.message}`,
    );
  }

  const cotacoesComProposta = new Set(
    (propostasResponse.data ?? [])
      .map((item: any) =>
        item.cotacao_id
          ? String(item.cotacao_id)
          : null,
      )
      .filter(Boolean) as string[],
  );

  const quantidadeSeguradoras =
    new Map<string, number>();

  for (
    const item
    of cotacoesSeguradorasResponse.data ?? []
  ) {
    const cotacaoId =
      String(item.cotacao_id);

    quantidadeSeguradoras.set(
      cotacaoId,
      (quantidadeSeguradoras.get(
        cotacaoId,
      ) ?? 0) + 1,
    );
  }

  return (cotacoesResponse.data ?? [])
    .filter(
      (item: any) =>
        !cotacoesComProposta.has(
          String(item.id),
        ),
    )
    .map((item: any) => {
      const quantidade =
        quantidadeSeguradoras.get(
          String(item.id),
        ) ?? 0;

      return {
        id: String(item.id),
        cliente:
          texto(
            primeiro(item.cliente)?.nome,
          ) || "-",
        tipoSeguro:
          texto(
            primeiro(
              item.tipo_seguro,
            )?.nome,
          ) || "-",
        status:
          quantidade > 0
            ? "Em Cotação"
            : "Nova",
        detalhe:
          quantidade > 0
            ? `${quantidade} cotação(ões) de seguradora`
            : "Aguardando início da cotação",
        data:
          item.created_at ?? null,
        href:
          `/admin/cotacoes/${item.id}`,
      };
    });
}

async function buscarPropostasEmTratamento(): Promise<
  DashboardTrabalhoItem[]
> {
  const supabase = await createClient();

  const [
    propostasResponse,
    apolicesResponse,
  ] = await Promise.all([
    supabase
      .from("propostas")
      .select(`
        id,
        numero_proposta,
        status,
        created_at,
        cotacao:cotacoes(
          cliente:clientes(nome),
          tipo_seguro:tipos_seguro(nome)
        )
      `)
      .order("created_at", {
        ascending: true,
      }),

    supabase
      .from("apolices")
      .select("proposta_id")
      .not("proposta_id", "is", null),
  ]);

  if (propostasResponse.error) {
    throw new Error(
      `Não foi possível consultar as propostas do Dashboard: ${propostasResponse.error.message}`,
    );
  }

  if (apolicesResponse.error) {
    throw new Error(
      `Não foi possível verificar as propostas já convertidas em apólice: ${apolicesResponse.error.message}`,
    );
  }

  const propostasConvertidas =
    new Set(
      (apolicesResponse.data ?? [])
        .map((item: any) =>
          item.proposta_id
            ? String(item.proposta_id)
            : null,
        )
        .filter(Boolean) as string[],
    );

  return (propostasResponse.data ?? [])
    .filter(
      (item: any) =>
        !propostasConvertidas.has(
          String(item.id),
        ) &&
        normalizar(
          item.status,
        ) !== "NEGADA",
    )
    .map((item: any) => {
      const cotacao =
        primeiro(item.cotacao);

      const statusOriginal =
        texto(item.status);

      return {
        id: String(item.id),
        cliente:
          texto(
            primeiro(
              cotacao?.cliente,
            )?.nome,
          ) || "-",
        tipoSeguro:
          texto(
            primeiro(
              cotacao?.tipo_seguro,
            )?.nome,
          ) || "-",
        status:
          statusOriginal ||
          "Em elaboração",
        detalhe:
          item.numero_proposta
            ? `Proposta ${item.numero_proposta}`
            : "Proposta em tratamento",
        data:
          item.created_at ?? null,
        href:
          `/admin/propostas/${item.id}/workspace`,
      };
    });
}

async function buscarRenovacoesProximas(): Promise<DashboardRenovacao[]> {
  const supabase = await createClient();

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const limite = new Date(hoje);
  limite.setDate(limite.getDate() + 30);

  const { data, error } = await supabase
    .from("apolices")
    .select(`
      id,
      fim_vigencia,
      cliente:clientes(nome),
      seguradora:seguradoras(nome),
      tipo_seguro:tipos_seguro(nome)
    `)
    .gte("fim_vigencia", dataLocalISO(hoje))
    .lte("fim_vigencia", dataLocalISO(limite))
    .order("fim_vigencia", { ascending: true });

  if (error) {
    throw new Error(`Não foi possível consultar os seguros vencendo: ${error.message}`);
  }

  return (data ?? []).map((item: any) => {
    const [ano, mes, dia] = String(item.fim_vigencia).split("-").map(Number);
    const vencimento = new Date(ano, mes - 1, dia);
    const diasRestantes = Math.round(
      (vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24),
    );

    return {
      id: String(item.id),
      cliente: texto(primeiro(item.cliente)?.nome) || "-",
      seguradora: texto(primeiro(item.seguradora)?.nome) || "-",
      tipoSeguro: texto(primeiro(item.tipo_seguro)?.nome) || "-",
      vencimento: String(item.fim_vigencia),
      diasRestantes,
      href: `/admin/apolices/${item.id}`,
    };
  });
}

export async function obterDashboardData(): Promise<DashboardData> {
  const [
    emProcessoCotacao,
    propostasEmTratamento,
    renovacoes,
  ] = await Promise.all([
    buscarCotacoesEmProcesso(),
    buscarPropostasEmTratamento(),
    buscarRenovacoesProximas(),
  ]);

  return {
    indicadores: {
      emProcessoCotacao: emProcessoCotacao.length,
      propostasEmTratamento:
        propostasEmTratamento.length,
      apoliceAEmitir: 0,
      vencendo30Dias: renovacoes.length,
    },
    emProcessoCotacao,
    propostasEmTratamento,
    apoliceAEmitir: [],
    renovacoes,

    // Evita quebra caso ainda exista algum componente antigo
    // renderizado enquanto o novo Dashboard é aplicado.
    ultimasCotacoes: [],
    ultimosClientes: [],
    tarefas: [],
  };
}
