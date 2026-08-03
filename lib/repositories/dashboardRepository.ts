import "server-only";

import { createClient } from "@/lib/supabase/server";

export type DashboardIndicadores = {
  clientes: number;
  cotacoes: number;
  emCotacao: number;
  fechadas: number;
};

export type DashboardUltimaCotacao = {
  id: string;
  cliente: string;
  tipoSeguro: string;
  status: string;
  created_at: string;
};

export type DashboardUltimoCliente = {
  id: string;
  nome: string;
  telefone: string | null;
  cidade: string | null;
  created_at: string;
};

export type DashboardRenovacao = {
  id: string;
  cliente: string;
  seguradora: string;
  tipoSeguro: string;
  vencimento: string;
  diasRestantes: number;
};

export type DashboardData = {
  indicadores: DashboardIndicadores;
  ultimasCotacoes: DashboardUltimaCotacao[];
  ultimosClientes: DashboardUltimoCliente[];
  tarefas: [];
  renovacoes: DashboardRenovacao[];
};


async function buscarRenovacoesProximas(): Promise<
  DashboardRenovacao[]
> {
  const supabase = await createClient();

  const hoje = new Date();

  const limite = new Date();

  limite.setDate(
    limite.getDate() + 30,
  );


  const { data, error } = await supabase
    .from("apolices")
    .select(`
      id,
      fim_vigencia,
      cliente:clientes(nome),
      seguradora:seguradoras(nome),
      tipo_seguro:tipos_seguro(nome)
    `)
    .gte(
      "fim_vigencia",
      hoje.toISOString().split("T")[0],
    )
    .lte(
      "fim_vigencia",
      limite.toISOString().split("T")[0],
    )
    .order("fim_vigencia", {
      ascending: true,
    })
    .limit(5);


  if (error) {
    console.error(
      "Erro renovacoes:",
      error,
    );

    return [];
  }


  return (data ?? []).map((item: any) => {

    const vencimento =
      new Date(item.fim_vigencia);


    const diasRestantes =
      Math.ceil(
        (
          vencimento.getTime() -
          hoje.getTime()
        ) /
        (1000 * 60 * 60 * 24),
      );


    return {
      id: item.id,

      cliente:
        item.cliente?.nome ?? "-",

      seguradora:
        item.seguradora?.nome ?? "-",

      tipoSeguro:
        item.tipo_seguro?.nome ?? "-",

      vencimento:
        item.fim_vigencia,

      diasRestantes,
    };
  });
}


export async function obterDashboardData(): Promise<DashboardData> {

  const supabase = await createClient();


  const [
    cotacoesResponse,
    renovacoes,
  ] = await Promise.all([

    supabase
      .from("cotacoes")
      .select("id", {
        count: "exact",
        head: true,
      }),

    buscarRenovacoesProximas(),

  ]);

 
if (cotacoesResponse.error) {
  console.error(
    "Erro Dashboard  Cotações:",
    cotacoesResponse.error,
  );

  throw new Error(
    cotacoesResponse.error.message,
  );
}

  return {

    indicadores: {

      clientes: 0,

      cotacoes:
        cotacoesResponse.count ?? 0,

      emCotacao: 0,

      fechadas: 0,

    },


    ultimasCotacoes: [],


    ultimosClientes: [],


    tarefas: [],


    renovacoes,

  };

}