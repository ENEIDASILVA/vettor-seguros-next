import "server-only";

import { createClient } from "@/lib/supabase/server";

export type SelectOption = {
  value: string;
  label: string;
};

export type SeguradoraOption = {
  value: number;
  label: string;
  codigo: string | null;
};

export async function obterSeguradorasOptions(): Promise<
  SeguradoraOption[]
> {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from("seguradoras")
      .select(`
        id,
        nome,
        codigo
      `)
      .eq("ativo", true)
      .order("nome");

  if (error) {
    throw new Error(
      `Erro ao carregar seguradoras: ${error.message}`,
    );
  }

  return (data ?? []).map(
    (item) => ({
      value: item.id,
      label: item.nome,
      codigo: item.codigo,
    }),
  );
}

export function obterStatusCotacao(): SelectOption[] {
  return [
    {
      value: "Solicitada",
      label: "Solicitada",
    },
    {
      value: "Recebida",
      label: "Recebida",
    },
    {
      value: "Analisada",
      label: "Analisada",
    },
    {
      value: "Recomendada",
      label: "Recomendada",
    },
    {
      value: "Enviada",
      label: "Enviada ao Cliente",
    },
    {
      value: "Aceita",
      label: "Aceita",
    },
    {
      value: "Recusada",
      label: "Recusada",
    },
  ];
}

export function obterTiposCotacao(): SelectOption[] {
  return [
    {
      value: "Nova",
      label: "Seguro Novo",
    },
    {
      value: "Renovacao",
      label: "Renovação",
    },
    {
      value: "Transferencia",
      label: "Transferência",
    },
  ];
}

export function obterTiposCasco(): SelectOption[] {
  return [
    {
      value: "100FIPE",
      label: "100% FIPE",
    },
    {
      value: "105FIPE",
      label: "105% FIPE",
    },
    {
      value: "110FIPE",
      label: "110% FIPE",
    },
    {
      value: "ValorDeterminado",
      label: "Valor Determinado",
    },
  ];
}

export function obterCarroReserva(): SelectOption[] {
  return [
    {
      value: "Nao",
      label: "Não possui",
    },
    {
      value: "7",
      label: "7 dias",
    },
    {
      value: "15",
      label: "15 dias",
    },
    {
      value: "30",
      label: "30 dias",
    },
  ];
}

export function obterAssistencia24h(): SelectOption[] {
  return [
    {
      value: "Basica",
      label: "Básica",
    },
    {
      value: "Completa",
      label: "Completa",
    },
    {
      value: "Premium",
      label: "Premium",
    },
  ];
}